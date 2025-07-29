import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pharmacy, PharmacySchema } from './schemas/pharmacy.schema';
import { PharmaciesService } from './pharmacies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pharmacy.name, schema: PharmacySchema },
    ]),
  ],
  providers: [PharmaciesService],
  exports: [PharmaciesService],
})
export class PharmaciesModule {}
