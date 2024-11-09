import Joi from "joi";

const createArticles = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).max(100).required(),
    category: Joi.string().min(3).max(100).required(),
    isPublished: Joi.boolean().optional().default(false),
    article_order: Joi.number().optional().default(0),
    created_by: Joi.string().max(100).required(),
    created_date: Joi.date().required()
});

const UpdateArticles = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).max(100).required(),
    category: Joi.string().min(3).max(100).required(),
    isPublished: Joi.boolean().optional().default(false),
    article_order: Joi.number().optional().default(0),
    created_by: Joi.string().max(100).required(),
    created_date: Joi.date().required()
});

const getAndDeleteArticles = Joi.number().required();

export {
    createArticles,
    UpdateArticles,
    getAndDeleteArticles
}