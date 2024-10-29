import Joi from "joi";

const createAndUpdateSchema = Joi.object({
    transaction_id: Joi.number().positive().required(),
    waste_id: Joi.number().positive().required(),
    uom_id: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
});

const getOneSchema = Joi.number().required().positive();

export {
    createAndUpdateSchema,
    getOneSchema
}