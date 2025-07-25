import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pharmacy, PharmacySchema } from './schemas/pharmacy.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Pharmacy.name, schema: PharmacySchema },
		])
	],
})
export class PharmaciesModule {}
