/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { UserService } from '../app/user/user.service';
import { UserEntity } from '../entity/user.entity';

config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const { authorization } = request.headers;
      const token = authorization.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.SECRET);

      const userId = decoded['id'];
      const user: UserEntity = await this.userService.getUser(userId);
      request.user = user;
      return !!user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
