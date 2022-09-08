/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { IBikeToReserve } from './reservation.service';
import { AuthGuard } from '../../AuthGuards/AuthGuard';
import {
  getReservationEntitySchema,
  rateReservationSchema,
  ReservationSchema,
} from './reservation.schema';
import { Auth } from '../../../util/Auth.Decorator';
import { UserEntity } from '../../entity/user.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard)
  @Post()
  async reserveBikeforUser(
    @Body() resbike: IBikeToReserve,
    @Auth() auth: { user: UserEntity },
  ) {
    const { error, value } = ReservationSchema.validate(resbike);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return this.reservationService.reserveBikeforUser({ ...value, auth });
  }

  @UseGuards(AuthGuard)
  @Get(':entity/:id/:page')
  async getReservationsOfEntity(
    @Param('id', ParseIntPipe) id: number,
    @Param('entity') entity: string,
    @Param('page') page: number,
    @Auth() auth: { user: UserEntity },
  ) {
    const { error, value } = getReservationEntitySchema.validate({
      id,
      entity,
      page,
    });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return this.reservationService.getReservationEntity(value, auth);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  async cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @Auth() auth: { user: UserEntity },
  ) {
    return this.reservationService.cancelReservation(id, auth);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/rate')
  async addRating(
    @Body() { comment, rating }: { comment: string; rating: string },
    @Param() id: any,
    @Auth() auth: { user: UserEntity },
  ) {
    const { error, value } = rateReservationSchema.validate({
      reservationId: id?.id,
      comment,
      rating,
    });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return this.reservationService.addRating(value, auth);
  }
}
