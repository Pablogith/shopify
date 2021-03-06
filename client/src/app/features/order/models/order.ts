import { OrderProduct, OrderStatus, Payment } from '@features/order/models';
import { User } from '@features/user/models';

export interface Order {
  id: number;
  createdAt: string;
  shippingMethod: string;
  products: OrderProduct[];
  comments?: string;
  user: User;
  status: OrderStatus;
  payment: Payment;
  summaryPrice: number;
}
