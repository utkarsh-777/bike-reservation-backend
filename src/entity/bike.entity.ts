/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableName } from '../TableName';
import { ReservationEntity } from './reservation.entity';

@Entity({ name: TableName.Bike })
export class BikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'model' })
  model: string;

  @Column({ name: 'color' })
  color: string;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'isAvailableAdmin' })
  isAvailableAdmin: boolean;

  @Column({ name: 'avgRating' })
  avgRating: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.bike, {
    onDelete: 'CASCADE',
  })
  reservations: ReservationEntity[];
}
