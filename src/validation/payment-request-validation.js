import Joi from "joi";

const createPaymentRequest = Joi.object({
    user_id: Joi.number().required(),
    request_date: Joi.date().required(),
    request_amount: Joi.number().required(),
    expected_payment_date: Joi.date().optional(),
    payment_date: Joi.date().optional(),
    payment_by: Joi.number().required(),
    confirmation_status: Joi.string().valid('Waiting_For_Confirmation', 'Success', 'Canceled').required(),
    confirmation_date: Joi.date().required()
});

const updatePaymentRequest = Joi.object({
    payment_request_id: Joi.number().required(),
    user_id: Joi.number().required(),
    request_date: Joi.date().required(),
    request_amount: Joi.number().optional(),
    expected_payment_date: Joi.date().optional(),
    payment_date: Joi.date().required(),
    payment_by: Joi.number().required(),
    confirmation_status: Joi.string().valid('Waiting_For_Confirmation', 'Success', 'Canceled').required(),
    confirmation_date: Joi.date().required()
});

const getAndDeletePaymentRequest = Joi.number().required();

export {
    createPaymentRequest,
    updatePaymentRequest,
    getAndDeletePaymentRequest
};