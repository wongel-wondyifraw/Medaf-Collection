import {IsEmail , IsString, MinLength, IsOptional  } from 'class-validator';
export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    middleName: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    region: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}