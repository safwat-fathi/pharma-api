import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Quote, QuoteSchema } from './schemas/quote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Quote.name, schema: QuoteSchema },
    ]),
  ],
})
export class OrdersModule {}
