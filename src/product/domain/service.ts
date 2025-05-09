import { Product } from './entity';
import { ProductRepository } from './repository';

export class ProductService {
  constructor(private product: ProductRepository) {}

  async createProduct(name: string, description: string, price: number, categoryId: number): Promise<Product> {
    const product = new Product(Date.now(), name, description, price, categoryId);
    return this.product.create(product);
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.product.findById(id);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.product.findByCategoryId(categoryId);
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    const product = await this.product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const updatedProduct = { ...product, ...productData };
    return this.product.update(updatedProduct);
  }

  async listProducts(limit: number, offset: number): Promise<Product[]> {
    return this.product.list(limit, offset);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.product.delete(id);
  }
}
