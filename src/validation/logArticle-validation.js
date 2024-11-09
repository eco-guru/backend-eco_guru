import Joi from "joi";

const createLogArticles = Joi.object({
    article_id: Joi.number().optional(),
    accessed_by: Joi.string().max(100).required(),
    accessed_time: Joi.date().required()
});

const schemaUpdateLogArticle = Joi.object({
    article_id: Joi.number().required(),
    accessed_by: Joi.string().max(100).required(),
    accessed_time_new: Joi.date().required(),
    accessed_time_old: Joi.date().required()
})

const schemaDeleteLogArticles = Joi.object({
    article_id: Joi.number().required(),
    accessed_by: Joi.string().max(100).required(),
});


export {
    schemaUpdateLogArticle,
    createLogArticles,
    schemaDeleteLogArticles
}