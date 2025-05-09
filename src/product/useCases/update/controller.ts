import { z } from 'zod';
import { ProductService } from '../../domain/service';

const UpdateProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(5).max(500),
  price: z.number().int().positive(),
  categoryId: z.number().int().positive()
});

export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

export class UpdateProductController {
  constructor(private productService: ProductService) { }

  async handle(request: UpdateProductRequest) {
    try {
      const validatedData = UpdateProductSchema.parse(request);

      const product = await this.productService.updateProduct(
        validatedData.id,
        {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          categoryId: validatedData.categoryId
        }
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