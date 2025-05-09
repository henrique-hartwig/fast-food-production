import { z } from 'zod';
import { ProductService } from '../../domain/service';

const GetProductSchema = z.object({
  id: z.number().int().positive()
});

export type GetProductRequest = z.infer<typeof GetProductSchema>;

export class GetProductController {
  constructor(private productService: ProductService) {}

  async handle(request: GetProductRequest) {
    try {
      const validatedData = GetProductSchema.parse(request);

      const product = await this.productService.getProductById(
        validatedData.id
      ) as any;

      if (product.error) {
        throw Error(product.error);
      }

      return product;
    } catch (error: any) {
      throw error;
    }
  }
}