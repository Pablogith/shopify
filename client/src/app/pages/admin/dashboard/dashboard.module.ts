import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProductModule } from '@features/product/product.module';
import { UserModule } from '@features/user/user.module';
import { CategoryModule } from '@features/category/category.module';
import { OrderModule } from '@features/order/order.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ProductModule,
    UserModule,
    CategoryModule,
    OrderModule,
  ],
})
export class DashboardModule {}
