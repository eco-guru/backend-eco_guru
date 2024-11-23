import Joi from "joi";

const createWastePickupValidation = Joi.object({
    user_id: Joi.number().required(),
    pick_up_date: Joi.date().required(),
    location: Joi.string().required(),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').required(),
});

const updateWastePickupValidation = Joi.object({
    id: Joi.number().required(),
    user_id: Joi.number().required(),
    pick_up_date: Joi.date().required(),
    location: Joi.string().required(),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').required(),
});

const getAndDeleteWastePickupValidation = Joi.number().required();

export {
    createWastePickupValidation,
    updateWastePickupValidation,
    getAndDeleteWastePickupValidation
};