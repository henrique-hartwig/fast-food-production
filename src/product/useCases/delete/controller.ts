import { z } from 'zod';
import { ProductService } from '../../domain/service';

const DeleteProductSchema = z.object({
  id: z.number().int().positive()
});

export type DeleteProductRequest = z.infer<typeof DeleteProductSchema>;

export class DeleteProductController {
  constructor(private productService: ProductService) {}

  async handle(request: DeleteProductRequest) {
    try {
      const validatedData = DeleteProductSchema.parse(request);

      const product = await this.productService.deleteProduct(
        validatedData.id
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product deleted successfully',
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