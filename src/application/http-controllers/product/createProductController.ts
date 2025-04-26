import { z } from 'zod';
import { ProductService } from '../../../domain/services/ProductService';

const CreateProductSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(5).max(500),
  price: z.number().int().positive(),
  categoryId: z.number().int().positive()
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

export class CreateProductController {
  constructor(private productService: ProductService) {}

  async handle(request: CreateProductRequest) {
    try {
      const validatedData = CreateProductSchema.parse(request);

      const product = await this.productService.createProduct(
        validatedData.name,
        validatedData.description,
        validatedData.price,
        validatedData.categoryId
      );

      return {
        statusCode: 201,
        body: {
          message: 'Product created successfully',
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