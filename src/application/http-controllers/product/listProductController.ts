import { z } from 'zod';
import { ProductService } from '../../../domain/services/ProductService';

const ListProductsSchema = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().positive().optional()
});

export type ListProductsRequest = z.infer<typeof ListProductsSchema>;

export class ListProductsController {
  constructor(private productService: ProductService) {}

  async handle(request: ListProductsRequest) {
    try {
      const validatedData = ListProductsSchema.parse(request);

      const products = await this.productService.listProducts(
        validatedData.limit ?? 10,
        validatedData.offset ?? 0
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product list retrieved successfully',
          data: products,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: {
            message: 'Validation error',
            details: error.errors,
          },
        };
      }
      
      return {
        statusCode: 500,
        body: {
          message: 'Internal server error',
          details: error,
        },
      };
    }
  }
}