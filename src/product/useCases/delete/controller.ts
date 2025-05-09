import { z } from 'zod';
import { ProductService } from '../../domain/service';

const DeleteProductSchema = z.object({
  id: z.number().int().positive()
});

export type DeleteProductRequest = z.infer<typeof DeleteProductSchema>;

export class DeleteProductController {
  constructor(private productService: ProductService) {}

  async handle(request: DeleteProductRequest) {
    try {
      const validatedData = DeleteProductSchema.parse(request);

      const product = await this.productService.deleteProduct(
        validatedData.id
      ) as any;

      if (product.error) {
        throw product.error;
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}