import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB_HOST: Joi.string().required(),
  APP_PORT: Joi.string().required(),
});
