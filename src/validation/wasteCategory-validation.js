import Joi from "joi";

const createAndUpdateWasteCategoryValidation = Joi.object({
    id: Joi.number().optional(),
    category: Joi.string().min(3).max(100).required(),
    isDeleted: Joi.boolean().optional().default(false)
});

const getAndDeleteWasteCategoryValidation = Joi.number().required();

export {
    createAndUpdateWasteCategoryValidation,
    getAndDeleteWasteCategoryValidation
}