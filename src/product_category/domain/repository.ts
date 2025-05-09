import { ProductCategory } from './entity';

export interface ProductCategoryRepository {
  create(productCategory: ProductCategory): Promise<ProductCategory>;
  findById(id: number): Promise<ProductCategory | null>;
  update(productCategory: ProductCategory): Promise<ProductCategory>;
  delete(id: number): Promise<boolean>;
  list(limit: number, offset: number): Promise<ProductCategory[]>;
}

