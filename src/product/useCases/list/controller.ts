import { z } from 'zod';
import { ProductService } from '../../domain/service';

const ListProductsSchema = z.object({
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative()
});

export type ListProductsRequest = z.infer<typeof ListProductsSchema>;

export class ListProductsController {
  constructor(private productService: ProductService) {}

  async handle(request: ListProductsRequest) {
    try {
      const validatedData = ListProductsSchema.parse(request);

      const products = await this.productService.listProducts(
        validatedData.limit,
        validatedData.offset
      ) as any;

      if (products.error) {
        throw Error(products.error);
      }

      return products;

    } catch (error: any) {
      throw error;
    }
  }
}