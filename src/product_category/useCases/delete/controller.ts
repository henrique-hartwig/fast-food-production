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
      ) as any;

      if (productCategory.error) {
        throw productCategory.error;
      }

      return productCategory;
    } catch (error: any) {
      throw error;
    }
  }
}