import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { DeliveryMethodEntity } from './entities/delivery-method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductsModule,
    UsersModule,
    DeliveryMethodEntity,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
