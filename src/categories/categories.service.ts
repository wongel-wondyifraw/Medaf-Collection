import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './category.entity';
@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    // Create a new category with optional parent category
    
    async create(name: string, description?: string, imageUrl?: string, parentId?: string) {
        const existing = await this.categoryRepository.findOne({ where: { name } });
        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }

        let parent: Category | null= null;
        if (parentId) {
            parent = await this.categoryRepository.findOne({ where: { id: parentId } });
            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }
        }

        const category = this.categoryRepository.create({ name, description, imageUrl, ...(parent&&{parent}) });
        return this.categoryRepository.save(category);
    }

    // Get all Root categories with their subcategories
    async findAll() {
        return this.categoryRepository.find({ where: { parent: IsNull() }, relations: ['children', 'children.children'] });
    }
    // Get a single category by ID with its subcategories

    async findOne(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id }, relations: ['parent', 'children', 'children.children', 'products'] });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;

    }

    // Update a category
    async update(id: string, name?: string, description?: string, imageUrl?: string, parentId?: string) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: parentId } });
            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }
            category.parent = parent;
        }

        if (name) category.name = name;
        if (description) category.description = description;
        if (imageUrl) category.imageUrl = imageUrl;

        return this.categoryRepository.save(category);
    }

    // Delete a category
    async remove(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id }, relations: ['children', 'products']  });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (category.products.length > 0) {
            throw new ConflictException('Cannot delete category with products — move or delete products first');
        }

        category.isActive = false;
        return this.categoryRepository.save(category);
    }
}