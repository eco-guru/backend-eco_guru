import Joi from "joi";

const createLogVideo = Joi.object({
    video_id: Joi.number().optional(),
    accessed_by: Joi.string().max(100).required(),
    accessed_time: Joi.date().required()
});

const schemaUpdateLogVideo = Joi.object({
    video_id: Joi.number().required(),
    accessed_by: Joi.string().max(100).required(),
    accessed_time_new: Joi.date().required(),
    accessed_time_old: Joi.date().required()
});

const schemaDeleteLogVideo = Joi.object({
    video_id: Joi.number().required(),
    accessed_by: Joi.string().max(100).required(),
});


export {
    schemaUpdateLogVideo,
    createLogVideo,
    schemaDeleteLogVideo
}