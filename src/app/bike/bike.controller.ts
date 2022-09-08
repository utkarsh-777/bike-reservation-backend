/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BikeService } from './bike.service';
import { RoleGuard } from '../../AuthGuards/RoleGuard';
import { BikeEntity } from '../../entity/bike.entity';
import { bikeSchema, getBikesSchema, putBikeSchema } from './bike.schema';
import { AuthGuard } from '../../AuthGuards/AuthGuard';

@Controller('bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @UseGuards(RoleGuard)
  @Post('')
  addBike(@Body() { model, color, location, isAvailableAdmin }: BikeEntity) {
    const data = {
      model: model?.toUpperCase(),
      color,
      location,
      isAvailableAdmin,
    };
    const { error, value } = bikeSchema.validate(data);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return this.bikeService.addBike(value);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  updateBike(
    @Body() { model, location, color, isAvailableAdmin }: BikeEntity,
    @Param() { id }: { id: number },
  ) {
    const data = { bikeId: id, model, color, location, isAvailableAdmin };
    const { error, value } = putBikeSchema.validate(data);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return this.bikeService.updateBike(value);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getBike(@Param('id', ParseIntPipe) id: number) {
    return this.bikeService.getBike(id);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  deleteBike(@Param('id', ParseIntPipe) id: number) {
    return this.bikeService.deleteBike(id);
  }

  @UseGuards(RoleGuard)
  @Get('all/:page')
  getAllBikes(@Param('page', ParseIntPipe) page: number) {
    return this.bikeService.getAllBikes(page);
  }

  @UseGuards(AuthGuard)
  @Get()
  getBikes(@Query() query: any) {
    const { error, value } = getBikesSchema.validate(query);
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return this.bikeService.getBikes(value);
  }
}
