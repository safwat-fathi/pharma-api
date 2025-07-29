import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pharmacy } from './schemas/pharmacy.schema';

@Injectable()
export class PharmaciesService {
  constructor(
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
  ) {}

  /**
   * Finds pharmacies within a given radius of a customer's location.
   * @param coordinates - The customer's [longitude, latitude].
   * @param radiusKm - The search radius in kilometers.
   */
  async findNearby(
    coordinates: [number, number],
    radiusKm: number,
  ): Promise<Pharmacy[]> {
    return this.pharmacyModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates,
          },
          // Convert radius from km to meters
          $maxDistance: radiusKm * 1000,
        },
      },
    });
  }

  async create(
    name: string,
    whatsappNumber: string,
    location: { type: string; coordinates: [number, number] },
    address?: string,
  ): Promise<Pharmacy> {
    const newPharmacy = new this.pharmacyModel({
      name,
      whatsappNumber,
      location,
      address,
    });
    return newPharmacy.save();
  }
}
