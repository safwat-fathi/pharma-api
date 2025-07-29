import { Controller, Get, Post, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id/quotes')
  async getQuotes(@Param('id') id: string): Promise<any> {
    // Placeholder
    return { orderId: id, quotes: [] };
  }

  @Post(':id/confirm')
  async confirmOrder(@Param('id') id: string): Promise<any> {
    // Placeholder
    return { orderId: id, status: 'confirmed' };
  }
}
