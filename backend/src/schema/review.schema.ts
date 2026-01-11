import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Movie } from './movie.schema';

export type ReviewDocument = Review & Document;

@Schema()
export class Review {
  @Prop({ required: true })
  movieId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});