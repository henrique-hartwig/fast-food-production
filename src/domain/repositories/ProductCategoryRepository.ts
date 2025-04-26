import { ProductCategory } from '../entities/ProductCategory';

export interface ProductCategoryRepository {
  create(productCategory: ProductCategory): Promise<void>;
  findById(id: number): Promise<ProductCategory | null>;
  update(productCategory: ProductCategory): Promise<void>;
  delete(id: number): Promise<void>;
  list(limit: number, offset: number): Promise<ProductCategory[]>;
}

