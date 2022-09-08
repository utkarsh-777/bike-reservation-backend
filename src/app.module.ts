/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeController } from './app/bike/bike.controller';
import { BikeService } from './app/bike/bike.service';
import { ReservationController } from './app/reservation/reservation.controller';
import { ReservationService } from './app/reservation/reservation.service';
import { UserController } from './app/user/user.controller';
import { UserService } from './app/user/user.service';
import config from './ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(config)],
  controllers: [UserController, BikeController, ReservationController],
  providers: [UserService, BikeService, ReservationService],
})
export class AppModule {}
