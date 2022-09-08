/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReservationEntity } from '../../entity/reservation.entity';
import { BikeEntity } from '../../entity/bike.entity';
import { UserEntity } from '../../entity/user.entity';
import { ReviewReservationEntity } from '../../entity/review_reservation.entity';

export interface IBikeToReserve {
  bikeId: number;
  reservationStartDate: string;
  reservationEndDate: string;
}

export interface IRating {
  comment: string;
  rating: number;
}

@Injectable()
export class ReservationService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getReservationEntity(data, auth) {
    const { id, page, entity } = data;
    if (entity === 'user') {
      if (auth?.user?.role !== 'manager' && auth?.user?.id !== id) {
        throw new HttpException(
          'You are not authorized',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userReservationsData = await ReservationEntity.findAndCount({
        where: { userId: id },
        take: 5,
        skip: (page - 1) * 5,
        order: { id: 'DESC' },
        relations: ['review'],
      });
      if (!userReservationsData) {
        throw new HttpException(
          'reservations not found!',
          HttpStatus.NOT_FOUND,
        );
      }
      return userReservationsData;
    } else {
      if (auth?.user?.role !== 'manager') {
        throw new HttpException(
          'You are not authorized',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const bikeReservationData = await ReservationEntity.findAndCount({
        where: { bikeId: id },
        take: 5,
        skip: (page - 1) * 5,
        order: { id: 'DESC' },
      });

      if (!bikeReservationData) {
        throw new HttpException(
          'reservations not found!',
          HttpStatus.NOT_FOUND,
        );
      }
      return bikeReservationData;
    }
  }

  async reserveBikeforUser({
    bikeId,
    reservationStartDate,
    reservationEndDate,
    auth,
  }) {
    const rsDate = new Date(reservationStartDate);
    const reDate = new Date(reservationEndDate);
    const bike = await BikeEntity.findOne({
      where: { id: bikeId },
      relations: ['reservations'],
    });
    if (!bike) {
      throw new HttpException('Bike not found!', HttpStatus.NOT_FOUND);
    }

    if (!bike.isAvailableAdmin) {
      throw new HttpException(
        `Sorry, ${bike.model} is not available at the moment!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    for (let i = 0; i < bike.reservations.length; i++) {
      if (bike.reservations[i].status == 'active') {
        const bike_rsDate = new Date(bike.reservations[i].reservationStartDate);
        const bike_reDate = new Date(bike.reservations[i].reservationEndDate);
        if (
          rsDate.getTime() >= bike_rsDate.getTime() &&
          rsDate.getTime() <= bike_reDate.getTime()
        ) {
          throw new HttpException(
            'Bike is not available at the selected time!',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (
          reDate.getTime() >= bike_rsDate.getTime() &&
          reDate.getTime() <= bike_reDate.getTime()
        ) {
          throw new HttpException(
            'Bike is not available at the selected time!',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    const reservation = ReservationEntity.create({
      status: 'active',
      reservationStartDate: rsDate.toDateString(),
      reservationEndDate: reDate.toDateString(),
      user: auth?.user,
      bike,
    });

    await ReservationEntity.save(reservation);
    return { success: 'Reservation successfully created!' };
  }

  async cancelReservation(reservationId: number, auth: { user: UserEntity }) {
    if (reservationId < 0) {
      throw new HttpException(
        'Reservation id cannot be negative!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const reservation = await ReservationEntity.findOne({
      where: { id: reservationId },
      relations: ['user', 'bike'],
    });
    if (!reservation) {
      throw new HttpException('Reservation not found!', HttpStatus.NOT_FOUND);
    }

    if (reservation.user.email !== auth?.user?.email) {
      throw new HttpException(
        'You are not authorized!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (reservation.status === 'cancel') {
      throw new HttpException(
        'Reservation is already cancelled!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cancel_reservation = { ...reservation, status: 'cancel' };

    await ReservationEntity.update({ id: reservationId }, cancel_reservation);

    return { message: 'Reservation cancelled!' };
  }

  async addRating(body, auth: { user: UserEntity }) {
    const { comment, rating, reservationId } = body;
    const reservation = await ReservationEntity.findOne({
      where: { id: reservationId },
      relations: ['review', 'user'],
    });
    if (!reservation) {
      throw new HttpException('Reservation not found!', HttpStatus.NOT_FOUND);
    }

    if (reservation.user.email !== auth?.user?.email) {
      throw new HttpException(
        'You are not authorized!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (reservation.status === 'cancel') {
      throw new HttpException(
        'You can only review active reservations!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const review_exist = await ReviewReservationEntity.findOne({
      where: { reservationId },
    });

    if (review_exist) {
      throw new HttpException(
        'Cannot review again on the same active reservation!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bikeReview = await ReviewReservationEntity.find({
      where: { bikeId: reservation.bikeId },
    });

    let previousReviewNumber = 0;
    let totalRating = 0;

    bikeReview.forEach((review) => {
      previousReviewNumber += 1;
      totalRating += review.rating;
    });

    const newRating = (totalRating + rating) / (previousReviewNumber + 1);
    await BikeEntity.update(
      {
        id: reservation.bikeId,
      },
      {
        avgRating: newRating,
      },
    );

    const new_review = ReviewReservationEntity.create({
      comment,
      rating,
      reservation,
      bikeId: reservation.bikeId,
    });
    await ReviewReservationEntity.save(new_review);
    return { message: 'Created review!' };
  }
}
