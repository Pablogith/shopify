import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { options as localOptions } from '../../utils/fileInterceptorLocalOptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateProductDto,
    required: true,
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'The product has been successfully created.',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden.',
  })
  @Post()
  @Header('Content-Type', 'application/json')
  public async create(
    @Body('product') createProductDto: CreateProductDto | any,
  ) {
    const product = await this.productsService.create(createProductDto);
    return {
      product: product,
      status: HttpStatus.CREATED,
      message: 'Product has been created',
    };
  }

  @ApiOperation({ summary: 'Add image' })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description:
      'Return object containing file metadata and access information.',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource.',
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', localOptions))
  public async addImage(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    return image;
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Return all products.' })
  @ApiQuery({
    name: 'category',
    type: 'string',
    required: false,
    example: 'solar-panels',
    description: 'Format name of category',
  })
  @ApiQuery({
    name: 'sortBy',
    type: 'string',
    required: false,
    example: 'defaultPrice',
    description: 'Name of column by which rows will sort',
  })
  @ApiQuery({
    name: 'sortMethod',
    type: 'string',
    required: false,
    example: 'ASC',
  })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async findAll(
    @Query('category') category?: string,
    @Query('sortBy', new DefaultValuePipe('created_on')) sortBy?: string,
    @Query('sortMethod', new DefaultValuePipe('DESC')) sortMethod?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('minPrice', new DefaultValuePipe(0), ParseFloatPipe)
    minPrice?: number,
    @Query(
      'maxPrice',
      new DefaultValuePipe(Number.MAX_SAFE_INTEGER),
      ParseFloatPipe,
    )
    maxPrice?: number,
  ) {
    const query = { sortBy, sortMethod, limit, offset, minPrice, maxPrice };
    category ? Object.assign(query, { category }) : null;

    const products = await this.productsService.findAll(query);
    return {
      count: products.length,
      products,
    };
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No products found',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Return product',
  })
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  public async findOne(@Param('id') id: Product['id']) {
    const product = await this.productsService.findOneById(id);
    if (!product) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Not found product',
      };
    }

    return { product };
  }

  @ApiOperation({ summary: 'Update product by id' })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'The product has been successfully updated.',
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  public async update(
    @Param('id') id: Product['id'],
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return { product };
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 201,
    description: 'The product has been successfully deleted.',
  })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  public async remove(@Param('id') id: Product['id']) {
    await this.productsService.remove(id);
    return {
      message: 'The product has been successfully deleted.',
    };
  }
}
