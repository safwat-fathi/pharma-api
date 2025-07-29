import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ unique: true, required: true })
  whatsappNumber: string;

  @Prop()
  name?: string;

  @Prop()
  address?: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] },
  })
  location: { type: string; coordinates: [number, number] }; // [longitude, latitude]
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
