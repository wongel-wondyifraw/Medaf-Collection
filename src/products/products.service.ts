// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // ─── CREATE PRODUCT ───────────────────────────────────────
  async create(
    name: string,
    price: number,
    categoryId: string,
    description?: string,
    stock?: number,
    imageUrl?: string,
  ) {
    // 1. Find the category — product must belong to a category
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId }
    });
    if (!category) throw new NotFoundException('Category not found');

    // 2. Create and save product
    const product = this.productsRepository.create({
      name,
      price,
      description,
      stock: stock ?? 0,
      imageUrl,
      category,
    });
    return this.productsRepository.save(product);
  }

  // ─── GET ALL PRODUCTS ─────────────────────────────────────
  async findAll(page: number = 1, limit: number = 20) {
    return this.productsRepository.find({
      where: { isActive: true },
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // ─── GET PRODUCTS BY CATEGORY ─────────────────────────────
  async findByCategory(categoryId: string) {
    return this.productsRepository.find({
      where: {
        isActive: true,
        category: { id: categoryId },
      },
      relations: ['category'],
    });
  }

  // ─── GET SINGLE PRODUCT ───────────────────────────────────
  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ─── UPDATE PRODUCT ───────────────────────────────────────
  async update(
    id: string,
    name?: string,
    price?: number,
    description?: string,
    stock?: number,
    imageUrl?: string,
    categoryId?: string,
  ) {
    const product = await this.productsRepository.findOne({
      where: { id }
    });
    if (!product) throw new NotFoundException('Product not found');

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId }
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl) product.imageUrl = imageUrl;

    return this.productsRepository.save(product);
  }

  // ─── UPDATE STOCK ─────────────────────────────────────────
  async updateStock(id: string, quantity: number) {
    const product = await this.productsRepository.findOne({
      where: { id }
    });
    if (!product) throw new NotFoundException('Product not found');
    product.stock = product.stock - quantity;
    return this.productsRepository.save(product);
  }

  // ─── DELETE PRODUCT ───────────────────────────────────────
  async remove(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id }
    });
    if (!product) throw new NotFoundException('Product not found');
    product.isActive = false;
    return this.productsRepository.save(product);
  }
}