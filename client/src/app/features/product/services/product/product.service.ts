import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

import {
  Product,
  ProductCreateDto,
  ProductCreateResponse,
  ProductDeleteResponse,
  ProductGetAllByResponse,
  ProductWithViewsCount,
} from '@features/product/models';
import { QueryStringParameters, SegmentsUrl, UrlBuilder } from '@core/utils';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private segmentsUrl!: SegmentsUrl;
  private urlBuilder!: UrlBuilder;
  private queryStringParameters!: QueryStringParameters;

  private userRolesHeaderKey = 'User-Roles';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public getAll(): Observable<Product[]> {
    this.setDefaultUrlConfig();
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl);
    return this.http.get<Product[]>(url);
  }

  public getAllBy(queryParams: Map<string, string | number>): Observable<ProductGetAllByResponse> {
    this.setDefaultUrlConfig();

    for (const [key, value] of queryParams) {
      this.queryStringParameters.push(key, value.toString());
    }

    const url: string = this.urlBuilder.getUrl(this.segmentsUrl, this.queryStringParameters);
    return this.http.get<ProductGetAllByResponse>(url);
  }

  public getById(id: number): Observable<Product> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push(id.toString());
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl);
    return this.http.get<Product>(url).pipe(
      map((product: Product) => {
        const trustedHTMLShortDescription = this.sanitizer.bypassSecurityTrustHtml(
          product.shortDescription as string
        );
        const trustedHTMLDescription = this.sanitizer.bypassSecurityTrustHtml(
          product.description as string
        );

        product.shortDescription = trustedHTMLShortDescription;
        product.description = trustedHTMLDescription;

        return product;
      })
    );
  }

  public create(product: ProductCreateDto): Observable<HttpEvent<ProductCreateResponse>> {
    this.setDefaultUrlConfig();
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl) + '/';

    const headers = new HttpHeaders().append(this.userRolesHeaderKey, 'admin');

    return this.addImage(product.image).pipe(
      switchMap((image: any) => {
        product.image = image.filename;
        return this.http.post<ProductCreateResponse>(url, product, {
          reportProgress: true,
          observe: 'events',
          headers,
        });
      })
    );
  }

  public delete(id: number): Observable<ProductDeleteResponse> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push(id.toString());
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl);

    const headers = new HttpHeaders().append(this.userRolesHeaderKey, 'admin');
    const requestOptions = { headers };

    return this.http.delete<ProductDeleteResponse>(url, requestOptions);
  }

  public getCount(options: Map<string, string>) {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push('count');

    if (options.has('category')) {
      this.queryStringParameters.push('category', options.get('category'));
    }
    const url = this.urlBuilder.getUrl(this.segmentsUrl, this.queryStringParameters);

    const headers = new HttpHeaders().append(this.userRolesHeaderKey, 'admin');
    const requestOptions = { headers };

    return this.http.get(url, requestOptions);
  }

  public getMostViewedProducts(): Observable<ProductWithViewsCount[]> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push('views');
    this.queryStringParameters.push('limit', '5');
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl, this.queryStringParameters);

    const headers = new HttpHeaders().append(this.userRolesHeaderKey, 'admin');
    const requestOptions = { headers };

    return this.http.get<ProductWithViewsCount[]>(url, requestOptions);
  }

  private addImage(image: Blob): Observable<Object> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push('image');
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl);
    const formData = new FormData();
    formData.append('image', image);

    const headers = new HttpHeaders().append(this.userRolesHeaderKey, 'admin');
    const requestOptions = { headers };

    return this.http.post(url, formData, requestOptions);
  }

  private setDefaultUrlConfig(): void {
    this.segmentsUrl = new SegmentsUrl();
    this.urlBuilder = new UrlBuilder();
    this.queryStringParameters = new QueryStringParameters();
    this.segmentsUrl.push('products');
  }
}
