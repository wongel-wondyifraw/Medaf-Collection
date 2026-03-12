import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {

  // Required — category must have a name
  @IsString()
  name: string;

  // Optional — short description
  @IsOptional()
  @IsString()
  description?: string;

  // Optional — category image
  @IsOptional()
  @IsString()
  imageUrl?: string;

  // Optional — null means root category
  @IsOptional()
  @IsUUID()               // ← must be a valid UUID if provided
  parentId?: string;
}