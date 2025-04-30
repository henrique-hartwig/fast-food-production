import { z } from 'zod';
import { ProductService } from '../../domain/service';

const GetProductSchema = z.object({
  id: z.number().int().positive()
});

export type GetProductRequest = z.infer<typeof GetProductSchema>;

export class GetProductController {
  constructor(private productService: ProductService) {}

  async handle(request: GetProductRequest) {
    try {
      const validatedData = GetProductSchema.parse(request);

      const product = await this.productService.getProductById(
        validatedData.id
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product retrieved successfully',
          data: product,
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