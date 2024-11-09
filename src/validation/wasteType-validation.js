import Joi from "joi";

const createAndUpdateWasteTypeValidation = Joi.object({
    id: Joi.number().optional(),
    type: Joi.string().min(3).max(100).required(),
    waste_category_id: Joi.number().required(),
    isDeleted: Joi.boolean().optional().default(false)
});

const getAndDeleteWasteTypeValidation = Joi.number().required();

export {
    createAndUpdateWasteTypeValidation,
    getAndDeleteWasteTypeValidation
}