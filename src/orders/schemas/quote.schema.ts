import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Quote extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pharmacy', required: true })
  pharmacy: ObjectId;

  @Prop()
  price: number;

  @Prop()
  etaMinutes: number;

  @Prop()
  status: 'sent' | 'received' | 'expired' | 'accepted';
}
export const QuoteSchema = SchemaFactory.createForClass(Quote);
