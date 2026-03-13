import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // ← add auth guard here if needed
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(
      dto.name,
      dto.price,
      dto.categoryId,
      dto.description,
      dto.stock,
      dto.imageUrl,
      
    );
  }

    // pagination parameters: ?page=1&limit=20
    // default to page 1 and limit 20 if not provided

  @Get()
  findAll(

    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,

  ) {
    return this.productsService.findAll(page, limit);
  }

   // GET Products by Category ID

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  // Get Products by ID

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

 

  // Update and Delete Products by ID}

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // ← add auth guard here if needed 
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(
      id,
      dto.name,
      dto.price,
      dto.description,
      dto.stock,
      dto.imageUrl,
      dto.categoryId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ← add auth guard here if needed 
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
