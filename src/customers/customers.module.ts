import { Module } from '@nestjs/common';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Customer.name, schema: CustomerSchema },
		])
	],
})
export class CustomersModule {}
