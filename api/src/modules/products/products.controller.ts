import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { FindOneParams } from './classes/find-one-params';
import { CreateProductDto } from './dto/create-product.dto';
import { ListAllProductsDto } from './dto/list-all-products.dto';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { DeleteProductResponseDto } from './dto/delete-product-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HOST_ADDRESS } from '../../config/configuration';

@Controller('products')
export class ProductsController {
  private uploadsUrl: string = `http://${HOST_ADDRESS}:${process.env.SERVER_PORT}/uploads/`;
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<{ products: Product[] }> {
    const products: Product[] = await this.productsService.findAll();
    products.forEach((product: Product) => {
      product.image = `${this.uploadsUrl}${product.image}`;
    });
    return {
      products: products,
    };
  }

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  public async addImage(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    return image;
  }

  @Get('findByFilter')
  @HttpCode(HttpStatus.OK)
  public async findAllByFilter(
    @Query('sortBy') sortBy: ListAllProductsDto['sortBy'],
    @Query('sortMethod') sortMethod: ListAllProductsDto['sortMethod'],
    @Query('take') take: ListAllProductsDto['take'],
    @Query('skip') skip: ListAllProductsDto['skip'],
    @Query('category') category: ListAllProductsDto['category'],
  ): Promise<{ products: Product[] }> {
    const products: Product[] = await this.productsService.findAllByFilter(
      sortBy,
      sortMethod.toUpperCase() as ListAllProductsDto['sortMethod'],
      take,
      skip,
      category,
    );
    products.forEach((product: Product) => {
      product.image = `${this.uploadsUrl}${product.image}`;
    });
    return {
      products: products,
    };
  }

  @Get('count')
  @HttpCode(HttpStatus.OK)
  public async count(
    @Query('category') category: string,
  ): Promise<{ count: number }> {
    const count: number = await this.productsService.count(category);
    return { count };
  }

  @Get(':id')
  @Header('Cross-Origin-Embedder-Policy', 'unsafe-none')
  @HttpCode(HttpStatus.OK)
  public async findOne(@Param('id') id: FindOneParams['id']): Promise<Product> {
    const product: Product = await this.productsService.findOne(id);
    product.image = `${this.uploadsUrl}${product.image}`;
    return product;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreateProductResponseDto> {
    const product: Product = await this.productsService.create(
      createProductDto,
    );
    return {
      product: product,
      status: HttpStatus.CREATED,
      message: 'Product has been created',
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  public async findOneAndDelete(
    @Param('id') id: FindOneParams['id'],
  ): Promise<DeleteProductResponseDto> {
    await this.productsService.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Product has been deleted',
    };
  }
}
