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
import transactionService from "./transaction-service.js";
import fs from "fs";
import path, {dirname, join} from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

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

    const salt = process.env.HASH_SALT;
    if (!salt) {
        throw new Error("HASH_SALT is not set in environment variables");
    }

    const saltedPassword = user.password + salt;
    user.password = await bcrypt.hash(saltedPassword, 10);

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
};


const getWasteCollector = async (request, response) => {
    const data = jwt.verify(request.token, process.env.SECRET_KEY);
    const user = await prismaClient.paymentRequest.aggregate({
        _sum: {
            accepted_amount: true
        },
        where: {
            payment_by: data.id,
            confirmation_status: "Selesai",
            payment_date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
        }
    });

    const userTransactions = await prismaClient.transactions.findMany({
        where: { 
            approved_by: data.id,
            transaction_date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
        },
        select: { id: true }
    });

    const transaction = await transactionService.getTransactionDataReport(userTransactions);

    return response.status(200).json({
        userBalance: user._sum.accepted_amount,
        transactions: transaction
    });
}

const login = async (request) => {
    request = validate(loginUserValidation, request);

    const salt = process.env.HASH_SALT;
    if (!salt) {
        throw new Error("HASH_SALT is not set in environment variables");
    }

    const user = await prismaClient.users.findFirst({
        where: {
            OR: [
                { username: request.usernameOrPhone },
                { phone: request.usernameOrPhone },
            ],
        },
        include: { Roles: true },
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    const saltedPassword = request.password + salt;

    const isPasswordValid = await bcrypt.compare(saltedPassword, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(404, "Invalid password");
    }

    const token = uuid().toString();

    const updatedUser = await prismaClient.users.update({
        data: {
            token: token,
        },
        where: {
            id: user.id,
        },
        select: {
            username: true,
            phone: true,
            token: true,
            Roles: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!updatedUser) {
        throw new ResponseError(400, "Failed to update user token");
    }

    return {
        id: user.id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        token: updatedUser.token,
        role: updatedUser.Roles.name,
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
        return { message: "Password yang kamu masukkan salah!", wrongPassword: true };
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
    console.log(data.id);
    const user = await prismaClient.users.findFirst({
        where: { id: data.id },
        select: { balance: true, username: true, phone: true, profile_picture: true }
    });
    return user;
}

const get = async (username) => {
  
    const user = await prismaClient.users.findMany({
      select: {
        id: true,
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

const __filenameUpdate = fileURLToPath(import.meta.url);
const __dirnameUpdate = path.dirname(__filenameUpdate);

const update = async (username, request, profilePicturePath) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        if (profilePicturePath) {
            try {
                const filePath = path.join(process.cwd(), profilePicturePath);
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting uploaded file:', error);
            }
        }
        throw new ResponseError(404, "User not found");
    }

    if (user.profile_picture && profilePicturePath) {
        try {
            const rootDir = path.resolve(__dirnameUpdate, '..', '..');
            const oldFilePath = path.join(rootDir, user.profile_picture);
            await fs.unlink(oldFilePath);
        } catch (error) {
            console.error('Error deleting old profile picture:', error);
        }
    }

    // Prepare data untuk update
    const data = {
        ...request
    };

    if (profilePicturePath) {
        data.profile_picture = profilePicturePath;
    }

    // Update user
    const updatedUser = await prisma.user.update({
        where: {
            username: username
        },
        data: data,
        select: {
            username: true,
            name: true,
            phone: true,
            role_id: true,
            profile_picture: true
        }
    });

    return updatedUser;
};

const getCurrent = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.users.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            phone: true,
            id: true
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
        id: true,
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

const createUser = async (request, profilePicturePath) => {
    request = validate(createUserValidation, request);
    
    const existingUser = await prismaClient.users.findUnique({
        where: { username: request.username }
    });
    
    if (existingUser) {
        if (profilePicturePath) {
            try {
                const filePath = path.join(__dirname, profilePicturePath);
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting uploaded file:', error);
            }
        }
        throw new ResponseError(400, "Username sudah digunakan");
    }
    
    const role = await prismaClient.roles.findUnique({
        where: { id: request.role_id }
    });
    
    if (!role) {
        if (profilePicturePath) {
            try {
                const filePath = path.join(__dirname, profilePicturePath);
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting uploaded file:', error);
            }
        }
        throw new ResponseError(400, "Role ID tidak valid");
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);
    
    const user = await prismaClient.users.create({
        data: {
            ...request,
            profile_picture: profilePicturePath,
            password: hashedPassword
        },
        select: {
            id: true,
            username: true,
            phone: true,
            role_id: true,
            profile_picture: true
        }
    });
    
    return user;
};


const updateBalance = async (req) => {
  return await prismaClient.users.update({
      where: { id: req.user_id },
      data: { balance: req.total },
  })
}

const updatePhoto = async (requestParam, requestBody, res) => {
    try {
        const data = jwt.verify(requestParam.token, process.env.SECRET_KEY);
        const user = await prismaClient.users.findFirst({
            where: { id: data.id },
            select: { 
                id: true, 
                username: true 
            }
        });

        if(!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        const __dirname = dirname(__filename);
        const rootDir = join(__dirname, '../../');
        const base64Data = requestBody.uri.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${Date.now()}-${requestBody.name}-${user.id}-${user.username}.${requestBody.type.split("/")[1]}`;
        const filePath = path.join(rootDir, 'storage', 'photoProfile', filename);
    
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
              console.error("Gagal menyimpan gambar:", err);
              return res.status(500).json({ message: "Gagal menyimpan gambar" });
            }
        });

        await prismaClient.users.update({
            where: { id: data.id },
            data: {
                profile_picture: filename
            }
        });
        return res.status(200).json({ message: "Profil berhasil diperbarui" });
    } catch (e) {
        console.log(e);
    }
}


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
    updateMobile,
    updateBalance,
    getWasteCollector,
    updatePhoto,
}