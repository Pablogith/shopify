import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  Product,
  ProductCreateDto,
  ProductCreateResponse,
  ProductDeleteResponse,
  ProductGetAllByResponse,
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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public getAll(): Observable<Product[]> {
    this.setDefaultUrlConfig();
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl);
    return this.http.get<Product[]>(url);
  }

  public getAllBy(queryParams: Map<string, string>): Observable<ProductGetAllByResponse> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push('findByFilter');
    for (const [key, value] of queryParams) {
      this.queryStringParameters.push(key, value);
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
    return this.http.post<ProductCreateResponse>(url, product, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public delete(id: number): Observable<ProductDeleteResponse> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push(id.toString());
    const url: string = this.urlBuilder.getUrl(this.segmentsUrl);
    return this.http.delete<ProductDeleteResponse>(url);
  }

  public getCount(options: Map<string, string>): Observable<{ count: number }> {
    this.setDefaultUrlConfig();
    this.segmentsUrl.push('count');
    let url!: string;

    if (options.has('category')) {
      this.queryStringParameters.push('category', options.get('category'));
      url = this.urlBuilder.getUrl(this.segmentsUrl, this.queryStringParameters);
    }

    url = this.urlBuilder.getUrl(this.segmentsUrl, this.queryStringParameters);
    return this.http.get<{ count: number }>(url);
  }

  private setDefaultUrlConfig(): void {
    this.segmentsUrl = new SegmentsUrl();
    this.urlBuilder = new UrlBuilder();
    this.queryStringParameters = new QueryStringParameters();
    this.segmentsUrl.push('products');
  }
}
