import { 
  Injectable, 
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ─── CREATE ORDER ─────────────────────────────────────────

  async create(
    userId: string,
    items: { productId: string; quantity: number }[],
    note?: string,
  ) {
    // 1. Find the user with customer profile
    //    we need delivery details from customer profile
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['customer'],  // load customer profile
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.customer) throw new BadRequestException('User has no customer profile');

    // 2. Validate all products and check stock
    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      // 3. Find each product
      const product = await this.productsRepository.findOne({
        where: { id: item.productId, isActive: true },
      });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      // 4. Check if enough stock available
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${product.name}. Available: ${product.stock}`
        );
      }

      // 5. Calculate subtotal for this item
      const subtotal = Number(product.price) * item.quantity;
      totalPrice += subtotal;

      // 6. Create order item
      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        priceAtOrder: product.price, // snapshot price
      });
      orderItems.push(orderItem);

      // 7. Reduce stock immediately
      product.stock = product.stock - item.quantity;
      await this.productsRepository.save(product);
    }

    // 8. Create order with delivery snapshot from customer profile
    const order = this.ordersRepository.create({
      user,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
      // snapshot delivery details from customer profile
      deliveryPhone:   user.customer.phone,
      deliveryAddress: user.customer.address,
      deliveryCity:    user.customer.city,
      deliveryRegion:  user.customer.region,
      note,
    });

    // 9. Save order — cascade saves order items too
    return this.ordersRepository.save(order);
  }

  // ─── GET ALL ORDERS (Admin) ───────────────────────────────

  async findAll() {
    return this.ordersRepository.find({
      relations: [
        'user',           // who placed the order
        'items',          // what was ordered
        'items.product',  // product details
      ],
      order: { createdAt: 'DESC' }, // newest first
    });
  }

  // ─── GET MY ORDERS (Customer) ─────────────────────────────

  async findMyOrders(userId: string) {
    // 10. Customer can only see their own orders
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // ─── GET SINGLE ORDER ─────────────────────────────────────

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // ─── UPDATE ORDER STATUS (Admin) ──────────────────────────

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.ordersRepository.findOne({
      where: { id }
    });
    if (!order) throw new NotFoundException('Order not found');

    // 11. Restore stock if order is cancelled
    if (status === OrderStatus.CANCELLED) {
      const orderWithItems = await this.ordersRepository.findOne({
        where: { id },
        relations: ['items', 'items.product'],
      });

      if (orderWithItems) {
        for (const item of orderWithItems.items) {
          item.product.stock += item.quantity; // restore stock
          await this.productsRepository.save(item.product);
        }
      }
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }
}