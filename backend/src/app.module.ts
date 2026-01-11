import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cinefy'),
    MoviesModule,
    ReviewsModule,
  ],
})
export class AppModule {}