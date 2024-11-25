import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

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

const get = async (username) => {
  
    const user = await prismaClient.users.findMany({
      select: {
        username: true,
        phone: true,
      }
    });

    return user;
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
      where: { username: username },
      select:{
        username: true,
        phone: true
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


export default {
    get,
    login,
    register,
    logout,
    update,
    getCurrent,
    getUserByUsername,
    updateUser
}