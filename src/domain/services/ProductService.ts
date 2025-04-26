import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class ProductService {
  constructor(private product: ProductRepository) {}

  async createProduct(name: string, description: string, price: number, categoryId: number): Promise<void> {
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
    const existingProduct = await this.product.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = { ...existingProduct, ...productData };
    await this.product.update(updatedProduct);
    return updatedProduct;
  }

  async listProducts(limit: number, offset: number): Promise<Product[]> {
    return this.product.list(limit, offset);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.product.delete(id);
  }
}
