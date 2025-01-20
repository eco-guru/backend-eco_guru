import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    email: Joi.string().required(),
    role_id: Joi.number().optional().default(1),
    question_id: Joi.number().required(),
    answers: Joi.string().max(40).required(),
});

const loginUserValidation = Joi.object({
    usernameOrPhone: Joi.string().optional(),
    username: Joi.string().optional(),
    password: Joi.string().min(6).required()
});

const verificationUserValidation = Joi.object({
    email: Joi.string().required()
});

const proofUserValidation = Joi.object({
    email: Joi.string().required(),
    answer: Joi.string().required()
});

const resetPasswordValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

const resetPasswordAuthenticatedValidation = Joi.object({
    token: Joi.string().required(),
    oldPassword: Joi.string().required(),
    password: Joi.string().required()
});

const getUserValidation = Joi.string().max(100).required();

const tokenValidation = Joi.string().required();

const updateMobileValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required()
})

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    profile_picture: Joi.any().optional().custom((value, helpers) => {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        return helpers.message("Profile picture must be a binary data (Blob).");
    }),
    email: Joi.string().optional().pattern(/^[0-9]+$/)
});

const createUserValidation = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    role_id: Joi.number().required(),
    profile_picture: Joi.any().optional().custom((value, helpers) => {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        return helpers.message("Profile picture must be a binary data (Blob).");
    })
  });

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
    createUserValidation,
    verificationUserValidation,
    resetPasswordValidation,
    resetPasswordAuthenticatedValidation,
    proofUserValidation,
    tokenValidation, 
    updateMobileValidation
}