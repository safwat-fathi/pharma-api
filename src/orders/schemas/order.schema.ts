import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  QUOTED = 'quoted',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: ObjectId;

  @Prop()
  prescriptionMediaPath?: string; // Path in local filesystem

  @Prop()
  text?: string; // For text-based orders

  @Prop({
    type: String,
    enum: Object.values(OrderStatus), // ← tell Mongoose which string values are allowed
    default: OrderStatus.PENDING,
    required: true,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('validate', function (next) {
  // 'this' refers to the document being validated
  const hasMediaPath = !!this.prescriptionMediaPath;
  const hasText = !!this.text;

  // If both are missing, throw a validation error.
  if (!hasMediaPath && !hasText) {
    this.invalidate(
      'order',
      'An order must have either a prescription image or a text description.',
    );
  }

  // If both are provided, you might want to enforce that only one is allowed.
  // if (hasMediaPath && hasText) {
  //   this.invalidate(
  //     'order',
  //     'An order cannot have both a prescription image and a text description.',
  //   );
  // }

  next();
});
