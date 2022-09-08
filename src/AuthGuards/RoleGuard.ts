/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../app/user/user.service';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
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
      return user.role === 'manager';
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
