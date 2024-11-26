import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    proofUserValidation,
    registerUserValidation,
    createUserValidation,
    resetPasswordAuthenticatedValidation,
    resetPasswordValidation,
    tokenValidation,
    updateMobileValidation,
    updateUserValidation,
    verificationUserValidation
} from "../validation/user-validation.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import jwt from 'jsonwebtoken'

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.users.count({
        where: {
            OR: [
                { phone: user.phone },
                { username: user.username }
            ]
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username Or Phone already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.users.create({
        data: {
            username: user.username,
            password: user.password,
            phone: user.phone,
            role_id: user.role_id,
            answers: {
                create: {
                    question_id: user.question_id,
                    answer_text: user.answers
                }
            }
        },
        select: {
            username: true,
            phone: true
        }
    });
}

const login = async (request) => {
    request = validate(loginUserValidation, request);

    const user = await prismaClient.users.findFirst({
      where: {
        OR: [
          { username: request.usernameOrPhone },
          { phone: request.usernameOrPhone }
        ]
      },
      include: { Roles: true } 
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new ResponseError(404, 'Invalid password');
    }

    const token = uuid().toString();

    const updatedUser = await prismaClient.users.update({
      data: {
        token: token
      },
      where: {
        id: user.id
      },
      select:{
        username: true,
        phone: true,
        token: true,
        Roles:{
            select:{
                name: true
            }
        }
      }
    });


    if (!updatedUser) {
      throw new ResponseError(400, 'Failed to update user token');
    }

    return {
        username: updatedUser.username,
        phone: updatedUser.phone,
        token: updatedUser.token,
        role: updatedUser.Roles.name
    };
};

const mobileLogin = async (request) => {
    request = validate(loginUserValidation, request);

    const user = await prismaClient.users.findFirst({
      where: {
        username: request.username
      },
      include: { Roles: true } 
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(request.password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(404, 'Invalid password');
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {expiresIn: '1d'});

    return {
        message: "Login berhasil",
        token: token,
        user: {role: user.role_id},
    };
};

const verification = async (request) => {
    request = validate(verificationUserValidation, request);
    const questionText = await prismaClient.users.findFirst({
        where: {
            phone: request.phone
        },
        select: {
            answers: {
                select: {
                    question: {
                        select: {
                            question_text: true
                        }
                    }
                }
            }
        }
    });

    if(!questionText) {
        return { message: "Pengguna tidak ditemukan", error: true};
    } 

    return {
        message: "Nomor telepon ditemukan, lakukan verifikasi berikut",
        question: questionText.answers[0].question.question_text,
    };

}

const proofUser = async (request, response) => {
    request = validate(proofUserValidation, request);
    const answers = await prismaClient.users.findFirst({
        where: { phone: request.phone },
        select: {
            answers: {
                select: {
                    answer_text: true
                }
            }
        }
    });
    const answer = answers.answers[0].answer_text  === request.answer
    if(answer) return response.status(200).json({ message: "Verifikasi berhasil, lakukan reset password segera" });
    else return response.status(400).json({ message: "Verifikasi gagal, jawaban yang diberikan tidak sesuai" });

}

const resetPassword = async (request) => {
    request = validate(resetPasswordValidation, request);
    const newPassword = await bcrypt.hash(request.password, 10);
    return prismaClient.users.update({
        where: {
            phone: request.phone
        },
        data: {
            password: newPassword
        },
        select: {
            username: true
        }
    });
}

const resetPasswordAuthenticated = async (request, res) => {
    request = validate(resetPasswordAuthenticatedValidation, request);

    const data = jwt.verify(request.token, process.env.SECRET_KEY);
    const user = await prismaClient.users.findFirst({
        where: { id: data.id },
        select: { password: true }
    });
    const match = await bcrypt.compare(request.oldPassword, user.password);

    if(!match) return res.status(400).json({ message: "Password yang kamu masukkan salah!", wrongPassword: true });

    const newPassword = await bcrypt.hash(request.password, 10);
    await prismaClient.users.update({
        where: {  id: data.id },
        data: { password: newPassword }
    });

    return res.status(200).json({message: "Password mu berhasil diubah!"});
}

const logout = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.users.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.users.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

const getUserByToken = async (token) => {
    token = validate(tokenValidation, token);
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await prismaClient.users.findFirst({
        where: { id: data.id },
        select: { balance: true, username: true, phone: true, profile_picture: true }
    });
    return user;
}

const get = async (username) => {
  
    const user = await prismaClient.users.findMany({
      select: {
        username: true,
        phone: true,
        role_id: true,
        profile_picture: true,
        balance: true,
      }
    });

    return user;
}

const getHouseHold = async (username) => {
  
    const user = await prismaClient.users.findMany({
      select: {
        username: true,
        phone: true,
        role_id: true,
        profile_picture: true,
        balance: true,
      },
      where: {
        role_id: 1
      }
    });

    return user;
}

const updateMobile = async (req, token) => {
    token = validate(tokenValidation, token);
    req = validate(updateMobileValidation, req);

    const data = jwt.verify(token, process.env.SECRET_KEY);
    const totalUser = await prismaClient.users.count({
        where: { id: data.id },
    });
    if(totalUser !== 1) return ({ message: "Pengguna tidak ditemukan "});
    return prismaClient.users.update({
        where: {id: data.id},
        data: {
            username: req.username,
            phone: req.phone
        }
    })

}

const update = async (username,request,profile_picture) => {
    const user = validate(updateUserValidation, request);
    console.log(user.username);
    const totalUserInDatabase = await prismaClient.users.count({
        where: {
            username: username
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data = {};
    if (user.username) {
        data.username = user.username;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }
    if (user.phone) {
        data.phone = user.phone;
    }
    if (user.profile_picture) {
        data.profile_picture = user.profile_picture;
    }else{
        data.profile_picture = profile_picture;
    }
    console.log(data);
    return prismaClient.users.update({
        where: {
            username: username
        },
        data: data,
        select: {
            username: true,
            phone: true,
            profile_picture: true
        }
    })
}

const getCurrent = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.users.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            phone: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const getUserByUsername = async (username) => {
    username = validate(getUserValidation, username);
  
    // Query untuk mencari user berdasarkan username
    const user = await prismaClient.users.findFirst({
      where: { 
        OR: [
            {username: username},
            {phone: username},
        ]
       },
      select:{
        username: true,
        phone: true,
        role_id: true,
        profile_picture: true,
        balance: true,
      }
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    return user;
};

const updateUser = async (username, data) => {
    username = validate(getUserValidation, username);

    if (!username) {
        throw new Error('Username is required');
    }

    const updatedUser = await prismaClient.users.update({
        where: { username: username },
        data: data,
        select:{
            username: true,
            phone: true,
            role_id: true
        }
    });

    return updatedUser;
};

const createUser = async (request, profile_picture) => {
    request = validate(createUserValidation, request);
  
    const existingUser = await prismaClient.users.findUnique({
      where: { username: request.username }
    });
  
    if (existingUser) {
      throw new ResponseError(400, "Username sudah digunakan");
    }
  
    const role = await prismaClient.roles.findUnique({
      where: { id: request.role_id }
    });
  
    if (!role) {
      throw new ResponseError(400, "Role ID tidak valid");
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);
  
    const user = await prismaClient.users.create({
      data: {
        ...request,
        profile_picture: profile_picture,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        phone: true,
        role_id: true
      }
    });
  
    return user;
  };


export default {
    get,
    getHouseHold,
    login,
    mobileLogin,
    verification,
    proofUser,
    resetPassword,
    resetPasswordAuthenticated,
    register,
    logout,
    update,
    getCurrent,
    getUserByUsername,
    updateUser,
    createUser,
    getUserByToken,
    updateMobile
}