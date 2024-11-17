import Joi from "joi";


const postPricelistValidation = Joi.object({
    waste_type_id: Joi.number().required(),
    uom_id: Joi.number().required(),
    price: Joi.number().required(),
    isActive: Joi.boolean().default(true).optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional().default(null)
});

const updatePricelistValidation = Joi.object({
    waste_type_id: Joi.number().required(),
    uom_id: Joi.number().required(),
    price: Joi.number().required(),
    isActive: Joi.boolean().default(true).optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional().default(null),
    params_waste_type_id: Joi.number().required(),
    params_uom_id: Joi.number().required()
});

const getAndDeletePricelistValidation = Joi.object({
    waste_type_id: Joi.number().required(),
    uomId: Joi.number().required()
})


export{
    postPricelistValidation,
    getAndDeletePricelistValidation,
    updatePricelistValidation
}