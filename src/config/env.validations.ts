import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	// App
	PORT: Joi.number().required(),

	// DB
	DATABASE_URL: Joi.string().required(),
}).unknown(true);
