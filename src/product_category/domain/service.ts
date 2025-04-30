import { ProductCategory } from './entity';
import { ProductCategoryRepository } from './repository';

export class ProductCategoryService {
  constructor(private productCategory: ProductCategoryRepository) {}

  async createProductCategory(name: string, description: string): Promise<void> {
    const productCategory = new ProductCategory(Date.now(), name, description);
    return this.productCategory.create(productCategory);
  }

  async getProductCategoryById(id: number): Promise<ProductCategory | null> {
    return this.productCategory.findById(id);
  }

  async updateProductCategory(id: number, name: string, description: string): Promise<void> {
    const productCategory = new ProductCategory(id, name, description);
    return this.productCategory.update(productCategory);
  }

  async deleteProductCategory(id: number): Promise<void> {
    return this.productCategory.delete(id);
  }

  async listProductCategories(limit: number, offset: number): Promise<ProductCategory[]> {
    return this.productCategory.list(limit, offset);
  }
}
