import Joi from "joi";


const postAndUpdatePricelistValidation = Joi.object({
    waste_id: Joi.number().required(),
    uom_id: Joi.number().required(),
    price: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional().default(null),
    isDeleted: Joi.boolean().default(false)
});

const getAndDeletePricelistValidation = Joi.number().required();


export{
    postAndUpdatePricelistValidation,
    getAndDeletePricelistValidation
}