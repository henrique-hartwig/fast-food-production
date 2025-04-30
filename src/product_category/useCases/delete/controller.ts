import { z } from 'zod';
import { ProductCategoryService } from '../../domain/service';

const DeleteProductCategorySchema = z.object({
  id: z.number().int().positive()
});

export type DeleteProductCategoryRequest = z.infer<typeof DeleteProductCategorySchema>;

export class DeleteProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  async handle(request: DeleteProductCategoryRequest) {
    try {
      const validatedData = DeleteProductCategorySchema.parse(request);

      const productCategory = await this.productCategoryService.deleteProductCategory(
        validatedData.id
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product Category deleted successfully',
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