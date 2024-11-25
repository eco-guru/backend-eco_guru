import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    phone: Joi.string().optional().pattern(/^[0-9]+$/),
    role_id: Joi.number().optional().default(2),
    question_id: Joi.number().required(),
    answers: Joi.string().max(40).required(),
});

const loginUserValidation = Joi.object({
    usernameOrPhone: Joi.string().optional(),
    username: Joi.string().optional(),
    password: Joi.string().min(6).required()
});

const verificationUserValidation = Joi.object({
    phone: Joi.string().required()
});

const proofUserValidation = Joi.object({
    phone: Joi.string().required(),
    answer: Joi.string().required()
});

const resetPasswordValidation = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    profile_picture: Joi.any().optional().custom((value, helpers) => {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        return helpers.message("Profile picture must be a binary data (Blob).");
    }),
    phone: Joi.string().optional().pattern(/^[0-9]+$/)
})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
    verificationUserValidation,
    resetPasswordValidation,
    proofUserValidation
}