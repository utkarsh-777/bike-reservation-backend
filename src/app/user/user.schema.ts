/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const SignupUserSchema = Joi.object({
  fullName: Joi.string().min(4).max(100).required().trim(),
  password: Joi.string().min(5).required(),
  email: Joi.string().email().required().trim(),
  role: Joi.string().trim().valid('regular', 'manager'),
});

export const LoginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required().trim(),
});

export const UserUpdateSchema = Joi.object({
  fullName: Joi.string().min(3).max(30).trim(),
  password: Joi.string().min(4),
  email: Joi.string().email().trim(),
  role: Joi.string().valid('regular', 'manager'),
  id: Joi.number(),
});
