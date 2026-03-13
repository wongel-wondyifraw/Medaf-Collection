import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,      // many items belong to one order
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 1. Many order items belong to ONE order
  //    onDelete CASCADE — delete items when order is deleted
  //    if order is deleted, its items should be deleted too
  @ManyToOne(() => Order, order => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  // 2. Many order items reference ONE product
  //    onDelete RESTRICT — can't delete product with orders
  //    we need product history for old orders
  @ManyToOne(() => Product, product => product.orderItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // 3. How many of this product was ordered
  //    e.g. customer ordered 2x Nike Tee
  @Column({ type: 'int' })
  quantity: number;

  // 4. Price at the TIME of order
  //    stored separately because product price can change
  //    e.g. Nike Tee was 29.99 when ordered
  //    even if price changes to 49.99 later
  //    this order still shows 29.99 ✅
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtOrder: number;
}