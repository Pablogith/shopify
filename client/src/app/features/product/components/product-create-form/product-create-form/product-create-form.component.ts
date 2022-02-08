import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '@features/product/services';
import { ProductCreateDto, ProductCreateResponse } from '@features/product/models';
import { NotificationService } from '@features/notification/services';
import { HttpEvent, HttpEventType } from '@angular/common/http';

interface ErrorResponse {
  ok: boolean;
  name: string;
  message: string;
}

@Component({
  selector: 'shopify-create-product-form',
  templateUrl: './product-create-form.component.html',
  styleUrls: ['./product-create-form.component.scss'],
})
export class ProductCreateFormComponent implements OnInit {
  public createProductForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.setCreateProductForm();
  }

  public onSubmit(): void {
    console.log(this.createProductForm);
    this.productService
      .create(this.createProductObjectToSend())
      .subscribe((event: HttpEvent<ProductCreateResponse>) => {
        if (event.type === HttpEventType.Response) {
          const body = event.body as ProductCreateResponse;
          this.handleSuccessResponse(body.status);
          this.notificationService.show({
            title: 'A new product has been successfully added',
            message: body.product.name,
          });
        }
      });
  }

  public setCreateProductForm(): void {
    this.createProductForm = this.fb.group({
      specification: this.fb.array([]),
    });
  }

  public addChildForm(name: string, group: FormGroup): void {
    this.createProductForm.addControl(name, group);
  }

  public newSpecification(): FormGroup {
    return this.fb.group({
      key: '',
      value: '',
    });
  }

  public addSpecification(): void {
    this.getSpecification().push(this.newSpecification());
  }

  public removeSpecification(index: number): void {
    this.getSpecification().removeAt(index);
  }

  public getSpecification(): FormArray {
    return this.createProductForm.get('specification') as FormArray;
  }

  public resetForm(): void {
    this.createProductForm.reset();
    while (this.getSpecification().length !== 0) {
      this.getSpecification().removeAt(0);
    }
  }

  private createProductObjectToSend(): ProductCreateDto {
    const general = this.createProductForm.get('general');
    const variations = this.createProductForm.get('variations');
    const inventory = this.createProductForm.get('inventory');
    const shipping = this.createProductForm.get('shipping');

    return {
      name: general?.get('name')?.value,
      shortDescription: general?.get('shortDescription')?.value,
      description: general?.get('description')?.value,
      defaultPrice: general?.get('regularPrice')?.value,
      promotionPrice: general?.get('salePrice')?.value ? general?.get('salePrice')?.value : 0.0,
      category: variations?.get('category')?.value,
      quantity: inventory?.get('stockQuantity')?.value,
      producer: general?.get('producer')?.value,
      expectedDeliveryTime: shipping?.get('expectedDeliveryTime')?.value,
      refNumber: general?.get('refNumber')?.value,
      dataSheet: JSON.stringify(this.getSpecification()?.value),
      shippingMethods: JSON.stringify(shipping?.get('shippingMethods')?.value),
      image: general?.get('image')?.value,
    } as ProductCreateDto;
  }

  private handleSuccessResponse(code: number): void {
    const codes: Map<number, () => void> = new Map<number, () => void>()
      .set(200, () => this.navigateToProductsManagePage())
      .set(201, () => this.navigateToProductsManagePage())
      .set(204, () => this.navigateToProductsManagePage());

    const action: () => void = codes.get(code) as () => void;
    action();
  }

  private handleErrorResponse(error: ErrorResponse): void {
    const booleans: Map<boolean, () => object> = new Map<boolean, () => object>().set(false, () =>
      this.createSimpleErrorMessageObject(error)
    );

    const action: () => object = booleans.get(error.ok) as () => object;
    action();
  }

  private createSimpleErrorMessageObject(error: ErrorResponse): object {
    return {
      name: error.name,
      message: error.message,
    };
  }

  private navigateToProductsManagePage(): void {
    this.router.navigate(['/admin/products-manage']);
  }
}