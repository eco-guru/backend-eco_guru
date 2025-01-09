import Joi from "joi";

const createVideos = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).required(),
    duration: Joi.number().required(),
    format: Joi.string().min(3).max(255).required(),
    thumbnail_url: Joi.string().min(3).max(255).required(),
    url: Joi.string().min(3).required(),
    upload_date: Joi.date().required(),
    uploaded_by: Joi.string().max(100).required(),
    categoryId: Joi.number().required(),
    isActive: Joi.boolean().default(true).optional(),
    video_order: Joi.number().optional().default(0),
  });
  
  const UpdatedVideos = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).required(),
    duration: Joi.number().required(),
    format: Joi.string().min(3).max(255).required(),
    thumbnail_url: Joi.string().min(3).max(255).required(),
    url: Joi.string().min(3).max(255).required(),
    upload_date: Joi.date().required(),
    uploaded_by: Joi.string().max(100).required(),
    categoryId: Joi.number().required(),
    isActive: Joi.boolean().default(true).optional(),
    video_order: Joi.number().optional().default(0),
  });
  

const getAndDeleteVideos = Joi.number().required();

export {
    createVideos,
    UpdatedVideos,
    getAndDeleteVideos
}