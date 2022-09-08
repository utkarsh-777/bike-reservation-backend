/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleGuard } from '../../AuthGuards/RoleGuard';
import { UserEntity } from '../../entity/user.entity';
import {
  LoginUserSchema,
  SignupUserSchema,
  UserUpdateSchema,
} from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() { email, password, fullName }) {
    const data = { fullName, email: email?.toLowerCase(), password };
    const { error, value } = SignupUserSchema.validate(data);
    if (error) throw new HttpException(error.message, 400);
    return this.userService.signup(value);
  }

  @Post('login')
  loginUser(@Body() { email, password }) {
    const data = { email: email?.toLowerCase(), password };
    const { error, value } = LoginUserSchema.validate(data);
    if (error) throw new HttpException(error.message, 400);
    return this.userService.login(value);
  }

  @UseGuards(RoleGuard)
  @Post()
  addUser(@Body() { email, password, fullName, role }: UserEntity) {
    const data = { email, password, fullName, role: role?.toLowerCase() };
    const { error, value } = SignupUserSchema.validate(data);
    if (error) throw new HttpException(error.message, 400);
    return this.userService.signup(value);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  updateUser(
    @Body() { email, password, fullName, role }: UserEntity,
    @Param() { id }: { id: number },
  ) {
    const data = { fullName, email, password, role, id };
    const { error, value } = UserUpdateSchema.validate(data);
    if (error) throw new HttpException(error.message, 400);
    return this.userService.updateUser({ ...value });
  }

  @UseGuards(RoleGuard)
  @Get()
  getUsers(@Query() { page }: { page: string }) {
    return this.userService.getUsers(+page);
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
