import { z } from 'zod';
import { ProductService } from '../../domain/service';

const UpdateProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(5).max(500),
  price: z.number().int().positive(),
  categoryId: z.number().int().positive()
});

export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

export class UpdateProductController {
  constructor(private productService: ProductService) { }

  async handle(request: UpdateProductRequest) {
    try {
      const validatedData = UpdateProductSchema.parse(request);

      const product = await this.productService.updateProduct(
        validatedData.id,
        {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          categoryId: validatedData.categoryId
        }
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product updated successfully',
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