import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Customer } from 'src/customers/schemas/customer.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(
    customer: Customer,
    prescriptionMediaPath?: string,
    text?: string,
  ): Promise<Order> {
    const newOrder = new this.orderModel({
      customer: customer._id,
      prescriptionMediaPath,
      text,
      status: OrderStatus.PENDING,
    });

    return newOrder.save();
  }

  /**
   * Finds an active order for a given customer.
   * Active is defined as 'pending', 'quoted', or 'confirmed'.
   * @param customerId The ID of the customer.
   * @returns The active order or null if none is found.
   */
  async findActiveOrderByCustomerId(
    customerId: Types.ObjectId,
  ): Promise<Order | null> {
    return this.orderModel
      .findOne({
        customer: customerId,
        status: {
          $in: [OrderStatus.PENDING, OrderStatus.QUOTED, OrderStatus.CONFIRMED],
        },
      })
      .exec();
  }
}
