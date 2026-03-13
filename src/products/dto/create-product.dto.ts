import { IsString, IsNumber, IsOptional, IsUUID, IsInt,Min } from 'class-validator';
export class CreateProductDto {

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;   

    @IsNumber()
    @Min(0)
    price: number;

    @IsInt()
    @Min(1)
    stock: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsUUID()
    categoryId: string;
}

