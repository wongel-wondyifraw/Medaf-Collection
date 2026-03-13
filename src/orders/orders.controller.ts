import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {

  constructor(private ordersService: OrdersService) {}

  // ─── PLACE ORDER (Customer) ───────────────────────────────

  // POST /orders — customer places an order
  // req.user comes from JwtStrategy.validate()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Request() req,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(
      req.user.id,   // ← userId from JWT token
      dto.items,
      dto.note,
    );
  }

  // ─── GET ALL ORDERS (Admin) ───────────────────────────────

  // GET /orders — admin sees all orders
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.ordersService.findAll();
  }

  // ─── GET MY ORDERS (Customer) ─────────────────────────────

  // GET /orders/my — customer sees their own orders
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  findMyOrders(@Request() req) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  // ─── GET SINGLE ORDER ─────────────────────────────────────

  // GET /orders/:id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);  // ← string not +id
  }

  // ─── UPDATE ORDER STATUS (Admin) ──────────────────────────

  // PATCH /orders/:id/status
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}