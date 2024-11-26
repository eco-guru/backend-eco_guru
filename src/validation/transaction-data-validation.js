import Joi from "joi";

const createAndUpdateSchema = Joi.object({
    id: Joi.number().positive().optional(),
    transaction_id: Joi.number().positive().required(),
    waste_type_id: Joi.number().positive().required(),
    uom_id: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
});

const getOneSchema = Joi.number().optional().positive();

export {
    createAndUpdateSchema,
    getOneSchema
}