import Joi from 'joi';

const createSchema = Joi.object({
    user_id: Joi.number().required(),
    transaction_date: Joi.date().required(),
    total: Joi.number().required(),
    approved_by: Joi.number().required(),
});


const ListAndDeleteSchema = Joi.number().positive().required();

const updateSchema = Joi.object({
    id: Joi.number().required(),
    user_id: Joi.number().required(),
    transaction_date: Joi.date().required(),
    total: Joi.number().required(),
    approved_by: Joi.number().required(),
})


export {
    createSchema,
    ListAndDeleteSchema,
    updateSchema
};