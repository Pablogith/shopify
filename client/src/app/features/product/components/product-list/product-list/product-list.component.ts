import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '@features/product/services';
import { switchMap } from 'rxjs';
import {
  Product,
  ProductGetAllByResponse,
  SortAction,
  SortOptions,
} from '@features/product/models';

@Component({
  selector: 'shopify-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public categoryName!: string;

  public productCount!: number;
  public pageCount!: number;
  public currentPage = 1;
  public productsRange = { from: 0, to: 0 };

  public productsListIsEmpty = false;

  private queryParams!: Map<string, string>;
  private sortOptions: SortOptions = {
    by: 'id',
    method: 'ASC',
    take: 10,
    skip: 0,
  };

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService) {}

  public ngOnInit(): void {
    this.getProducts();
  }

  public sortProducts(sort: SortAction): void {
    this.sortOptions.by = sort.name;
    this.sortOptions.method = sort.method;

    this.getProducts();
  }

  private getQueryMap(sortOptions: SortOptions = this.sortOptions): Map<string, string> {
    this.queryParams = new Map<string, string>()
      .set('sortBy', sortOptions.by)
      .set('sortMethod', sortOptions.method)
      .set('limit', sortOptions.take + '')
      .set('offset', (this.currentPage - 1).toString())
      .set('category', this.categoryName);

    return this.queryParams;
  }

  private getProducts(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          this.categoryName = params.category;
          return this.productService.getAllBy(this.getQueryMap());
        })
      )
      .subscribe((response: ProductGetAllByResponse) => {
        this.products = response.products;
        this.productCount = response.productsCountInCategory;
        if (this.productCount > 10) {
          this.pageCount = +(this.productCount / 10).toFixed(0);
        } else {
          this.pageCount = 1;
        }
        this.productsListIsEmpty = this.products.length <= 0;

        this.setProductsRange();
      });
  }

  private setProductsRange(): void {
    if (this.currentPage === 1) {
      this.productsRange.from = 1;
      this.productsRange.to = this.productCount > 10 ? 10 : this.productCount;
    } else {
      this.productsRange.from = (this.currentPage - 1) * 10 + 1;
      this.productsRange.to =
        this.currentPage === this.pageCount ? this.productCount : (this.currentPage - 1) * 10 + 10;
    }
  }
}
