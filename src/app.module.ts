import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { User } from './users/user.entity';
import { Customer } from './customers/customer.entity';
import {Category} from './categories/category.entity';
import {Product} from './products/entities/product.entity';

// Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module';


@Module({
  imports: [
    // 1. Load .env file globally
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Database connection — THIS WAS MISSING
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'ministore',
      entities: [User, Customer, Category , Product],  // ← register all entities here
      synchronize: true,           // ← auto creates tables
    }),

    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}