/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BikeEntity } from '../../entity/bike.entity';

export interface IBike {
  id?: number;
  model: string;
  color: string;
  location: string;
  rating: string;
  isAvailable: boolean;
}

export interface IFilterbike {
  model?: string;
  color?: string;
  location?: string;
  reservationStartDate?: Date;
  reservationEndDate?: Date;
  minAvgRating?: string;
  isAvailableAdmin: boolean;
  page?: number;
}

export interface IFilterResponse {
  resultedBikes: BikeEntity[];
  total_pages: number;
}

@Injectable()
export class BikeService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getBikes(query: IFilterbike): Promise<IFilterResponse> {
    const all_bikes = await BikeEntity.find({
      relations: ['reservations'],
    });

    let resultedBikes = [];
    const {
      reservationStartDate,
      reservationEndDate,
      page,
      model,
      color,
      location,
      minAvgRating,
    } = query;

    if (reservationStartDate && reservationEndDate) {
      const queried_rsDate = new Date(reservationStartDate).getTime();
      const queried_reDate = new Date(reservationEndDate).getTime();
      all_bikes.forEach((bike) => {
        if (bike.isAvailableAdmin) {
          let flag = true;
          for (let i = 0; i < bike.reservations.length; i++) {
            if (bike.reservations[i].status === 'active') {
              const bike_rsDate = new Date(
                bike.reservations[i].reservationStartDate,
              ).getTime();
              const bike_reDate = new Date(
                bike.reservations[i].reservationEndDate,
              ).getTime();
              if (
                queried_reDate < bike_rsDate ||
                queried_rsDate > bike_reDate
              ) {
                continue;
              } else {
                flag = false;
                break;
              }
            }
          }
          if (flag) {
            resultedBikes.push(bike);
          }
        }
      });
    }

    if (model) {
      const re = new RegExp(model, 'i');
      resultedBikes = resultedBikes.filter((bike) => re.test(bike.model));
    }

    if (color) {
      const re = new RegExp(color, 'i');
      resultedBikes = resultedBikes.filter((bike) => re.test(bike.color));
    }

    if (location) {
      const re = new RegExp(location, 'i');
      resultedBikes = resultedBikes.filter((bike) => re.test(bike.location));
    }

    if (minAvgRating != undefined) {
      resultedBikes = resultedBikes.filter(
        (bike) => bike.avgRating >= minAvgRating,
      );
    }

    const startSlice = (page - 1) * 5;
    const endSlice = startSlice + 5;

    resultedBikes = resultedBikes.map((bike) => ({
      id: bike.id,
      model: bike.model,
      color: bike.color,
      location: bike.location,
      isAvailableAdmin: bike.isAvailableAdmin,
      avgRating: bike.avgRating,
    }));

    return {
      resultedBikes: resultedBikes.slice(startSlice, endSlice),
      total_pages: Math.ceil(resultedBikes.length / 5),
    };
  }

  async deleteBike(id: number): Promise<any> {
    const bike = await BikeEntity.findOneBy({ id });
    if (!bike) {
      throw new HttpException('Bike not found!', HttpStatus.NOT_FOUND);
    }

    await BikeEntity.delete({ id: bike.id });
    return { message: `${bike.model} deleted successfully!` };
  }

  async addBike(bike) {
    const newBike = BikeEntity.create(bike);
    await BikeEntity.save(newBike);
    return newBike;
  }

  async getBike(id: number): Promise<BikeEntity> {
    const bike = await BikeEntity.findOneBy({ id });
    if (!bike) {
      throw new HttpException('bike not found', HttpStatus.BAD_REQUEST);
    }
    return bike;
  }

  async updateBike({ model, color, location, bikeId, isAvailableAdmin }) {
    const bike = await BikeEntity.findOneBy({ id: bikeId });
    if (!bike) {
      throw new HttpException('Bike not found!', HttpStatus.NOT_FOUND);
    }
    const updatedBike = { ...bike };

    model = model && model.trim().toUpperCase();
    color = color && color.trim();
    location = location && location.trim();

    if (model) {
      updatedBike.model = model;
    }

    if (color) {
      updatedBike.color = color;
    }

    if (location) {
      updatedBike.location = location;
    }

    if (isAvailableAdmin !== null) {
      updatedBike.isAvailableAdmin = isAvailableAdmin;
    }

    await BikeEntity.update(
      { id: bikeId },
      {
        model: updatedBike.model,
        color: updatedBike.color,
        location: updatedBike.location,
        isAvailableAdmin: updatedBike.isAvailableAdmin,
        avgRating: updatedBike.avgRating,
      },
    );
    return updatedBike;
  }

  async getAllBikes(page: number) {
    if (page < 1) {
      throw new HttpException(
        'Page cannot be negative!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const bikes = await BikeEntity.findAndCount({
      take: 5,
      skip: (page - 1) * 5,
    });
    return bikes;
  }
}
