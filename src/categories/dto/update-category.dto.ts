import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// PartialType makes ALL fields from CreateCategoryDto optional
// no need to repeat all fields again
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}