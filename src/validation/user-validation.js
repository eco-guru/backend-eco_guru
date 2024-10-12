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
    phone: Joi.string().max(100).optional()
})

const userUpdateSchema = Joi.object({
    username: Joi.string().max(100).optional(),
    phone: Joi.string().optional().pattern(/^[0-9]+$/), // Validasi nomor telepon
    role_id: Joi.number().optional(),
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
    userUpdateSchema
}