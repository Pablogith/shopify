import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { OrderProduct } from './order-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderProduct])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
