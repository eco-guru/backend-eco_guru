import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    phone: Joi.string().optional().pattern(/^[0-9]+$/),
    role_id: Joi.number().optional().default(2),
});

const loginUserValidation = Joi.object({
    usernameOrPhone: Joi.string().optional(),
    password: Joi.string().min(6).required()
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
});

const createUserValidation = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().required(),
    phone: Joi.string().pattern(/^(\+62|62|0)8[1-9][0-9]{6,10}$/).optional(),
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
    createUserValidation
}