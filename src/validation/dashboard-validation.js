import Joi from "joi";

const dashboardSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
});

export {
    dashboardSchema
}