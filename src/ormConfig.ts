/* eslint-disable prettier/prettier */
import { BikeEntity } from './entity/bike.entity';
import { ReservationEntity } from './entity/reservation.entity';
import { ReviewReservationEntity } from './entity/review_reservation.entity';
import { UserEntity } from './entity/user.entity';
import { userMigration1662062926925 } from './migration/1662062926925-userMigration';
import { bikeMigration1662062981252 } from './migration/1662062981252-bikeMigration';
import { reservationMigration1662063016890 } from './migration/1662063016890-reservationMigration';
import { reviewReservationMigration1662063246359 } from './migration/1662063246359-review_reservationMigration';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: './src/data/bikeRegistrationDB.db',
  entities: [
    UserEntity,
    BikeEntity,
    ReservationEntity,
    ReviewReservationEntity,
  ],
  synchronize: true,
  migrations: [
    userMigration1662062926925,
    bikeMigration1662062981252,
    reservationMigration1662063016890,
    reviewReservationMigration1662063246359,
  ],
};

export default config;
