import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';

export enum QuoteStatus {
  SENT = 'sent',
  RECEIVED = 'received',
  EXPIRED = 'expired',
  ACCEPTED = 'accepted',
}

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

  @Prop({
    type: String,
    enum: Object.values(QuoteStatus), // ← tell Mongoose which string values are allowed
    default: QuoteStatus.SENT, // ← optional: set a default
    required: true,
  })
  status: QuoteStatus;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
