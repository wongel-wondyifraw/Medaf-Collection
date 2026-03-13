import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // This is what fixes the red line ↓
  @ManyToOne(() => Product, product => product.orderItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;      // ← THIS was missing!

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtOrder: number;
}