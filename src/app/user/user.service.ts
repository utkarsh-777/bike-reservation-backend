/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../../entity/user.entity';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { hash, compare } from 'bcrypt';
config();

export interface IUser {
  id?: number;
  name: string;
  role: string;
  password: string;
  email: string;
}

export interface Igetuser {
  users: UserEntity[];
  totalPages: number;
}

@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getUsers(page: number): Promise<Igetuser> {
    if (page < 1) {
      throw new HttpException(
        'Page cannot be negative!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const users = await UserEntity.findAndCount({
      take: 5,
      skip: (page - 1) * 5,
      order: { id: 'DESC' },
    });
    return { users: users[0], totalPages: users[1] };
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await UserEntity.findOne({
      where: { id },
      relations: ['reservations'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async signup({ email, password, fullName, role = 'regular' }) {
    const existingUser = await UserEntity.findOneBy({
      email,
    });

    if (existingUser) {
      throw new HttpException(
        'User already exists try changing the email!',
        400,
      );
    }

    const hashedPassword = await hash(password, 12);
    const newUser = UserEntity.create({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      role,
    });

    await UserEntity.save(newUser);
    const token = await sign(
      {
        id: newUser.id,
      },
      process.env.SECRET,
    );
    return {
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login({ email, password }) {
    const user = await UserEntity.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        'User does not exist, kindly signup first!',
        HttpStatus.NOT_FOUND,
      );
    }
    const comparePassword = await compare(password, user.password);
    if (!comparePassword) {
      throw new HttpException(
        'Email or Password does not match!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await sign({ id: user.id }, process.env.SECRET);
    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async deleteUser(id: number): Promise<any> {
    const user = await UserEntity.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    await UserEntity.delete({ id: user.id });
    return {
      success: `${user.fullName} deleted successfully!`,
      email: user.email,
    };
  }

  async updateUser(param: {
    fullName: string;
    email: string;
    role: string;
    id: number;
  }) {
    const { fullName, email, role, id } = param;
    const user = await UserEntity.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    const updatedUser = { ...user };
    if (email) {
      const existingEmail = await UserEntity.findOne({
        where: { email },
      });
      if (existingEmail)
        throw new HttpException(
          'User already exists try changing the email!',
          HttpStatus.BAD_REQUEST,
        );
      updatedUser.email = email;
    }

    if (fullName) {
      updatedUser.fullName = fullName;
    }

    if (role) {
      updatedUser.role = role;
    }

    await UserEntity.update(
      { id },
      {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
    );
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
    };
  }
}
