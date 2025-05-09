import { z } from 'zod';
import { ProductCategoryService } from '../../domain/service';

const GetProductCategorySchema = z.object({
  id: z.number().int().positive()
});

export type GetProductCategoryRequest = z.infer<typeof GetProductCategorySchema>;

export class GetProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  async handle(request: GetProductCategoryRequest) {
    try {
      const validatedData = GetProductCategorySchema.parse(request);

      const productCategory = await this.productCategoryService.getProductCategoryById(
        validatedData.id
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