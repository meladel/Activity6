import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie, MovieDocument } from "../schema/movie.schema";
import { Review, ReviewDocument } from "../schema/review.schema";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newVal = new this.movieModel(createMovieDto);
    return newVal.save();
  }

  async findAll(): Promise<any[]> {
    const movies = await this.movieModel.aggregate([
      {
        $addFields: {
          movieIdString: { $toString: "$_id" }
        }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "movieIdString",
          foreignField: "movieId",
          as: "reviews"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    
    return movies.map(m => ({ ...m, id: m._id }));
  }

  async findOne(id: string): Promise<any> {
    const movie = await this.movieModel.findById(id).lean();
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    const reviews = await this.reviewModel.find({ movieId: id }).lean();
    
    return { ...movie, id: movie._id, reviews: reviews.map(r => ({...r, id: r._id})) };
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const updated = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true });
    if (!updated) throw new NotFoundException(`Movie ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Movie ${id} not found`);
    await this.reviewModel.deleteMany({ movieId: id });
  }

  async getAverageRating(id: string): Promise<number> {
    const reviews = await this.reviewModel.find({ movieId: id });
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }
}