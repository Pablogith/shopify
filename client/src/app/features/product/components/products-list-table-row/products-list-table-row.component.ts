import {Component, HostBinding, HostListener, Input} from '@angular/core';

import {ProductSimple} from '@features/product/models';


@Component({
  selector: 'shopify-products-list-table-row',
  templateUrl: './products-list-table-row.component.html',
  styleUrls: ['./products-list-table-row.component.scss']
})
export class ProductsListTableRowComponent {
  @Input()
  set product(value: ProductSimple) {
    this._product = value;
  }
  get product(): ProductSimple {
    return this._product;
  }

  @HostBinding('style.backgroundColor') bgColor!: string;
  @HostBinding('style.cursor') cursor!: string;

  private _product!: ProductSimple;

  public date = new Date();

  @HostListener('mouseover')
  public onMouseOver(): void {
    this.bgColor = 'rgb(215,215,215)';
    this.cursor = 'pointer';
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.bgColor = 'rgb(255, 255, 255)';
    this.cursor = '';
  }

  public isSuccess(): boolean {
    return this.product.amount >= 8;
  }

  public isWarning(): boolean {
    return this.product.amount > 3 && this.product.amount < 8;
  }

  public isDanger(): boolean {
    return this.product.amount <= 3;
  }
}