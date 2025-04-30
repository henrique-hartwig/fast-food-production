import { z } from 'zod';
import { ProductCategoryService } from '../../domain/service';

const ListProductCategoriesSchema = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().positive().optional()
});

export type ListProductCategoriesRequest = z.infer<typeof ListProductCategoriesSchema>;

export class ListProductCategoriesController {
  constructor(private productCategoryService: ProductCategoryService) {}

  async handle(request: ListProductCategoriesRequest) {
    try {
      const validatedData = ListProductCategoriesSchema.parse(request);

      const productCategory = await this.productCategoryService.listProductCategories(
        validatedData.limit ?? 10,
        validatedData.offset ?? 0
      );

      return {
        statusCode: 200,
        body: {
          message: 'Product Category list retrieved successfully',
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