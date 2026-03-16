import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus } from './entities/order.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Type } from 'class-transformer';


@Controller('orders')
export class OrdersController {

  constructor(private ordersService: OrdersService) {}

  // ─── PLACE ORDER (Customer) ───────────────────────────────

  // POST /orders — customer places an order
  // req.user comes from JwtStrategy.validate()
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.CUSTOMER)
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(

    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.ordersService.findAll(page, limit);
  }

  // ─── GET MY ORDERS (Customer) ─────────────────────────────

  // GET /orders/my — customer sees their own orders
  @Get('my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.CUSTOMER)
  findMyOrders(@Request() req,

  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,

) {
    return this.ordersService.findMyOrders(req.user.id, page , limit);
  }

  // ─── GET SINGLE ORDER ─────────────────────────────────────

  // GET /orders/:id
  @Get(':id')
@UseGuards(AuthGuard('jwt'))
async findOne(
  @Param('id') id: string,
  @Request() req,
) {
  const order = await this.ordersService.findOne(id);

  if (
    req.user.role !== UserRole.ADMIN &&
    order.user.id !== req.user.id
  ) {
    throw new ForbiddenException('You can only view your own orders');
  }

  return order;
}

  // ─── UPDATE ORDER STATUS (Admin) ──────────────────────────

  // PATCH /orders/:id/status
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}