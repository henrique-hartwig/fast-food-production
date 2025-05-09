import { z } from 'zod';
import { ProductService } from '../../domain/service';

const CreateProductSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(5).max(500),
  price: z.number().int().positive(),
  categoryId: z.number().int().positive()
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

export class CreateProductController {
  constructor(private productService: ProductService) {}

  async handle(request: CreateProductRequest) {
    try {
      const validatedData = CreateProductSchema.parse(request);

      const product = await this.productService.createProduct(
        validatedData.name,
        validatedData.description,
        validatedData.price,
        validatedData.categoryId
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