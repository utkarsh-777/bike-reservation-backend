/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableName } from '../TableName';
import { ReservationEntity } from './reservation.entity';

@Entity({ name: TableName.ReviewReservation })
export class ReviewReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reservationId' })
  reservationId: number;

  @Column({ name: 'bikeId' })
  bikeId: number;

  @Column({ name: 'comment' })
  comment: string;

  @Column({ name: 'rating' })
  rating: number;

  @OneToOne(() => ReservationEntity, (reservation) => reservation.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  reservation: ReservationEntity;
}
