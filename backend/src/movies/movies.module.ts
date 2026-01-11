import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie, MovieSchema } from '../schema/movie.schema';
import { Review, ReviewSchema } from '../schema/review.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]) 
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}