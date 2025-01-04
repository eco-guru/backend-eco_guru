import Joi from "joi";

const createArticles = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).max(100).required(),
    categoryId: Joi.number().required(),
    isPublished: Joi.boolean().optional().default(false),
    article_order: Joi.number().optional().default(0),
    created_by: Joi.string().max(100).required(),
    created_date: Joi.date().required(),
    thumbnail_url: Joi.string().min(3).max(255).required()
});

const UpdateArticles = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(3).required(),
    isPublished: Joi.boolean().optional(),
    created_by: Joi.string().max(100).optional(),
    created_date: Joi.date().optional(),
    article_order: Joi.number().optional(),
    thumbnail_url: Joi.string().uri().optional(),
    categoryId: Joi.number().optional(),
  });
  

const getAndDeleteArticles = Joi.number().required();

export {
    createArticles,
    UpdateArticles,
    getAndDeleteArticles
}