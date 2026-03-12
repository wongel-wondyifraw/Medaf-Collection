import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

  constructor(private categoriesService: CategoriesService) {}

//   Create a new category (protected route)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(
      dto.name,
      dto.description,
      dto.imageUrl,
      dto.parentId,
    );
  }

//   Get all root categories with their subcategories - Public
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

//   Update a category (protected route)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(
      id,
      dto.name,
      dto.description,
      dto.imageUrl,
      dto.parentId,
    );
  }

//   Delete a category (protected route)

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
