import Joi from "joi";

const createAndUpdateUOMValidation = Joi.object({
    id: Joi.number().optional(),
    unit: Joi.string().min(1).max(100).required(),
    isDeleted: Joi.boolean().optional().default(false)
});

const getAndDeleteUomValidation = Joi.number().required();


export {
    createAndUpdateUOMValidation,
    getAndDeleteUomValidation
}