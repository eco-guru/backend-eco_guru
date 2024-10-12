import Joi from "joi";


const postAndUpdatePricelistValidation = Joi.object({
    waste_id: Joi.number().required(),
    uom_id: Joi.number().required(),
    price: Joi.number().required(),
    isActive: Joi.boolean().default(true).optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional().default(null),
    isDeleted: Joi.boolean().default(false).optional()
});

const getAndDeletePricelistValidation = Joi.object({
    wasteId: Joi.number().required(),
    uomId: Joi.number().required()
})


export{
    postAndUpdatePricelistValidation,
    getAndDeletePricelistValidation
}