import { z } from 'zod';
import { ProductCategoryService } from '../../domain/service';

const UpdateProductCategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(5).max(500)
});

export type UpdateProductCategoryRequest = z.infer<typeof UpdateProductCategorySchema>;

export class UpdateProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) { }

  async handle(request: UpdateProductCategoryRequest) {
    try {
      const validatedData = UpdateProductCategorySchema.parse(request);

      const productCategory = await this.productCategoryService.updateProductCategory(
        validatedData.id,
        validatedData.name,
        validatedData.description
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product Category updated successfully',
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