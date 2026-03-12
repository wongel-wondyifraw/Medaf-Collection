// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [
    // Register Category repository
    // so it can be injected in CategoriesService
    TypeOrmModule.forFeature([Category])
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService], // ← export so ProductsModule can use it
})
export class CategoriesModule {}