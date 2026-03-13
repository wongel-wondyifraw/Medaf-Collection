import { IsArray, IsOptional, IsString, IsUUID, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 1. DTO for each item in the order
export class OrderItemDto {

  // Must be a valid product UUID
  @IsUUID()
  productId: string;

  // Must be a whole number >= 1
  @IsInt()
  @Min(1)
  quantity: number;
}

// 2. DTO for the entire order
export class CreateOrderDto {

  // Array of items — must have at least one
  @IsArray()
  @ValidateNested({ each: true }) // validate each item in array
  @Type(() => OrderItemDto)       // transform each item to OrderItemDto
  items: OrderItemDto[];

  // Optional note from customer
  @IsOptional()
  @IsString()
  note?: string;
}