import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schema/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findByMovie(movieId: string): Promise<Review[]> {
    return this.reviewModel.find({ movieId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().sort({ createdAt: -1 }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Review with ID ' + id + ' not found');
    }
  }
}