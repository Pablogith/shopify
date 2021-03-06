import { Component, OnInit } from '@angular/core';
import { ShoppingCartItem, ShoppingCartState } from '@features/shopping-cart/models';
import { Store } from '@ngrx/store';
import { Checkout } from '@features/checkout/models';

@Component({
  selector: 'shopify-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  public shoppingCartItems!: ShoppingCartItem[];
  public checkoutData!: Checkout;
  public shoppingCartItemsIsEmpty!: boolean;

  constructor(private store: Store<ShoppingCartState>) {}

  public ngOnInit(): void {
    this.setShippingCartItems();
  }

  public setCheckoutData(checkoutData: Checkout): void {
    this.checkoutData = checkoutData;
  }

  private setShippingCartItems(): void {
    this.store.select('shoppingCartItems').subscribe((shoppingCartItems: ShoppingCartItem[]) => {
      this.shoppingCartItems = shoppingCartItems;
      this.shoppingCartItemsIsEmpty = this.shoppingCartItems.length <= 0;
    });
  }
}
