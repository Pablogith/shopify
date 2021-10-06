import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'products-manage',
    loadChildren: () => import('./products-manage/products-manage.module').then(m => m.ProductsManageModule)
  },
  {
    path: 'orders-manage',
    loadChildren: () => import('./orders-manage/orders-manage.module').then(m => m.OrdersManageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPagesRoutingModule { }
