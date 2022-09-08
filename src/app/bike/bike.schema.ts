/* eslint-disable prettier/prettier */
import * as Joi from 'joi';
import * as moment from 'moment';

export const bikeSchema = Joi.object({
  model: Joi.string().trim().min(2).max(100).required(),
  color: Joi.string().trim().required(),
  avgRating: Joi.number().default(0),
  location: Joi.string().trim().required(),
  isAvailableAdmin: Joi.boolean().default(true).required(),
});

export const getBikesSchema = Joi.object({
  reservationStartDate: Joi.date()
    .min(moment().startOf('day').toDate())
    .message('Reservation start date should not be a past today!')
    .required(),
  reservationEndDate: Joi.date()
    .min(Joi.ref('reservationStartDate'))
    .message(
      'Reservation end date must be greater than reservation start date!',
    )
    .required(),
  page: Joi.number().positive().required(),
  model: Joi.string().trim().optional(),
  color: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  minAvgRating: Joi.number().min(0).max(5).optional(),
});

export const putBikeSchema = Joi.object({
  bikeId: Joi.number().positive().required(),
  model: Joi.string().trim().min(2).max(100).optional(),
  color: Joi.string().trim().optional(),
  location: Joi.string().trim().optional(),
  isAvailableAdmin: Joi.boolean().optional(),
});
