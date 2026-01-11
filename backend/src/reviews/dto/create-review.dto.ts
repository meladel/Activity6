import { IsString, IsNotEmpty, IsNumber, Min, Max, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '64f8a123...', description: 'Movie ID' })
  @IsMongoId()
  movieId: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'Amazing movie! Must watch.', description: 'Review comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ example: 5, description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}