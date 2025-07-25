import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: ObjectId;

  @Prop()
  prescriptionMediaPath: string; // Path in local filesystem

  @Prop()
  status: 'pending' | 'quoted' | 'confirmed' | 'completed';
}
export const OrderSchema = SchemaFactory.createForClass(Order);

