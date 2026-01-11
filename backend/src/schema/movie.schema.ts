import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true })
  releaseYear: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});