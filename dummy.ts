/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UserEntity } from './src/entity/user.entity';
import { ReservationEntity } from './src/entity/reservation.entity';
import { BikeEntity } from './src/entity/bike.entity';
import { ReviewReservationEntity } from './src/entity/review_reservation.entity';
import { hash } from 'bcrypt';
import * as moment from 'moment';
import * as _ from 'lodash';
import { faker } from '@faker-js/faker';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await UserEntity.delete({});
  await BikeEntity.delete({});
  await ReservationEntity.delete({});
  await ReviewReservationEntity.delete({});
  await seedUsers();
  await seedBikes();
  await seedReservations();
  await app.close();
};

const seedUsers = async () => {
  const user = new UserEntity();
  user.fullName = 'Utkarsh Kashyap';
  user.password = await hash('12345', 12);
  user.role = 'manager';
  user.email = 'kumarutkarsh305@gmail.com';
  const users = [user];
  const role = ['manager', 'regular'];
  for (let i = 0; i < 10; i++) {
    const u = new UserEntity();
    u.fullName = faker.name.fullName();
    u.password = await hash('12345', 12);
    u.role = i % 3 === 0 ? role[0] : role[1];
    u.email = faker.internet.email().toLowerCase();
    users.push(u);
  }
  await UserEntity.save(users);
};

const seedBikes = async () => {
  const bikes = [];
  for (let i = 0; i < 50; i++) {
    const bike = new BikeEntity();
    bike.model = _.sample([
      `YAMAHA ${i + 1}`,
      `KAWASAKI ${i + 1}`,
      `DUCATI ${i + 1}`,
    ]);
    bike.color = faker.color.human();
    bike.location = faker.address.city();
    bike.isAvailableAdmin = Math.random() < 0.7;
    bike.avgRating = 0;
    bikes.push(bike);
  }
  await BikeEntity.save(bikes);
};

const seedReservations = async () => {
  const users = await UserEntity.find({});
  const bikes = await BikeEntity.find({});
  const reservations = [];
  for (let i = 0; i < 20; i++) {
    const randHour: number = parseInt(String(Math.random() * 200));
    const r = new ReservationEntity();
    r.bike = _.sample(bikes);
    r.user = _.sample(users);
    r.status = _.sample(['active', 'cancel']);
    r.reservationStartDate = moment()
      .subtract(randHour, 'hour')
      .toDate()
      .toDateString();
    r.reservationEndDate = moment()
      .add(randHour, 'hour')
      .toDate()
      .toDateString();
    reservations.push(r);
  }
  await ReservationEntity.save(reservations);
};

bootstrap()
  .then()
  .catch((err) => console.error(err));
