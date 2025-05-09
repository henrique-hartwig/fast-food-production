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
      ) as any;

      if (productCategory.error) {
        throw Error(productCategory.error);
      }

      return productCategory;
    } catch (error: any) {
      throw error;
    }
  }
}