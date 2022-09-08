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

@Entity({ name: TableName.User })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role', default: 'regular' })
  role: string;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user, {
    onDelete: 'CASCADE',
  })
  reservations: ReservationEntity[];
}
