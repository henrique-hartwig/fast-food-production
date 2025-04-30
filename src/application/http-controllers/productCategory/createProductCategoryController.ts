import { z } from 'zod';
import { ProductCategoryService } from '../../../domain/services/ProductCategoryService';

const CreateProductCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(5).max(500)
});

export type CreateProductCategoryRequest = z.infer<typeof CreateProductCategorySchema>;

export class CreateProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  async handle(request: CreateProductCategoryRequest) {
    try {
      const validatedData = CreateProductCategorySchema.parse(request);

      const productCategory = await this.productCategoryService.createProductCategory(
        validatedData.name,
        validatedData.description
      );

      return {
        statusCode: 201,
        body: {
          message: 'Product Category created successfully',
          data: productCategory,
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