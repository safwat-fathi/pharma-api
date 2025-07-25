import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Pharmacy extends Document {
  @Prop({ unique: true, required: true })
  whatsappNumber: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] },
  })
  location: { type: string; coordinates: [number, number] };

  @Prop()
  serviceRadiusKm: number;

  @Prop()
  hours: string;
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);
// Important: Create a geospatial index for location queries
PharmacySchema.index({ location: '2dsphere' });
