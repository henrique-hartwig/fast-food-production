import { z } from 'zod';
import { ProductCategoryService } from '../../domain/service';

const ListProductCategoriesSchema = z.object({
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative()
});

export type ListProductCategoriesRequest = z.infer<typeof ListProductCategoriesSchema>;

export class ListProductCategoriesController {
  constructor(private productCategoryService: ProductCategoryService) {}

  async handle(request: ListProductCategoriesRequest) {
    try {
      const validatedData = ListProductCategoriesSchema.parse(request);

      const productCategory = await this.productCategoryService.listProductCategories(
        validatedData.limit,
        validatedData.offset
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