import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findByWhatsappNumber(whatsappNumber: string): Promise<Customer | null> {
    return this.customerModel.findOne({ whatsappNumber }).exec();
  }

  async create(
    whatsappNumber: string,
    name: string,
    location?: { type: string; coordinates: [number, number] },
  ): Promise<Customer> {
    const newCustomer = new this.customerModel({
      whatsappNumber,
      name,
      location,
      createdAt: new Date(),
    });

    return newCustomer.save();
  }

  async updateLocation(
    customerId: string,
    location: { latitude: number; longitude: number },
  ): Promise<Customer> {
    const customer = await this.customerModel.findByIdAndUpdate(
      customerId,
      {
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      },
      { new: true },
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
    return customer;
  }

  async updateAddress(
    customerId: ObjectId,
    address: string,
  ): Promise<Customer> {
    const customer = await this.customerModel.findByIdAndUpdate(
      customerId,
      {
        address,
      },
      { new: true },
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return customer;
  }
}
