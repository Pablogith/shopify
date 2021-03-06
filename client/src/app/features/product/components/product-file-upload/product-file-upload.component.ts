import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'shopify-product-file-upload[progress]',
  templateUrl: './product-file-upload.component.html',
  styleUrls: ['./product-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductFileUploadComponent,
      multi: true,
    },
  ],
})
export class ProductFileUploadComponent implements ControlValueAccessor {
  @Input() progress!: any;
  @Output() onFile = new EventEmitter<File>();

  public onChange!: Function;
  public file: File | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    this.file = event && event.item(0);
    this.onChange(this.file);
    this.onFile.emit(this.file as File);
  }

  constructor(private host: ElementRef<HTMLInputElement>) {}

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {}

  public writeValue(obj: any): void {
    this.host.nativeElement.value = '';
    this.file = null;
  }
}
