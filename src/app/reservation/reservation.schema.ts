/* eslint-disable prettier/prettier */
import * as Joi from 'joi';
import * as moment from 'moment';

export const ReservationSchema = Joi.object({
  bikeId: Joi.number().positive().required(),
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
});

export const rateReservationSchema = Joi.object({
  reservationId: Joi.number().positive().required(),
  comment: Joi.string().trim().min(1).max(200).required(),
  rating: Joi.number().positive().min(1).max(5).required(),
});

export const getReservationEntitySchema = Joi.object({
  entity: Joi.string().required(),
  id: Joi.number().positive().required(),
  page: Joi.number().positive().required(),
});
