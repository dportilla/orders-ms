import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	// App
	PORT: Joi.number().required(),
}).unknown(true);
