import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,      // many orders belong to one user
  OneToMany,      // one order has many items
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { OrderItem } from './order-item.entity';

// 1. Order status tracks where the order is
export enum OrderStatus {
  PENDING = 'pending',       // order placed, not confirmed
  CONFIRMED = 'confirmed',   // admin confirmed the order
  SHIPPED = 'shipped',       // order is on the way
  DELIVERED = 'delivered',   // customer received order
  CANCELLED = 'cancelled',   // order was cancelled
}

@Entity('orders')
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 2. Many orders belong to one user
  //    onDelete RESTRICT — can't delete user with orders
  @ManyToOne(() => User, { 
    nullable: false,
    onDelete: 'RESTRICT' 
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  // 3. One order has many items
  //    cascade: true — save items when order is saved
  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  // 4. Current status of the order
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // 5. Total price of entire order
  //    calculated when order is placed
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  // 6. Delivery details snapshot
  //    stored separately from customer profile
  //    because customer might change address later
  //    but old orders should keep original address
  @Column()
  deliveryPhone: string;

  @Column()
  deliveryAddress: string;

  @Column()
  deliveryCity: string;

  @Column()
  deliveryRegion: string;

  // 7. Optional note from customer
  //    e.g. "leave at the door"
  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
