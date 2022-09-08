/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableName } from '../TableName';
import { UserEntity } from './user.entity';
import { BikeEntity } from './bike.entity';
import { ReviewReservationEntity } from './review_reservation.entity';

@Entity({ name: TableName.Reservation })
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @Column({ name: 'bikeId', nullable: true })
  bikeId: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'reservationStartDate' })
  reservationStartDate: string;

  @Column({ name: 'reservationEndDate' })
  reservationEndDate: string;

  @ManyToOne(() => UserEntity, (user) => user.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => BikeEntity, (bike) => bike.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bike: BikeEntity;

  @OneToOne(
    () => ReviewReservationEntity,
    (reviewReservation) => reviewReservation.reservation,
    { onDelete: 'CASCADE' },
  )
  review: ReviewReservationEntity;
}
