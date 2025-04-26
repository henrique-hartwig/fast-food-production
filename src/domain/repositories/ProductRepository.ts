import { Product } from '../entities/Product';

export interface ProductRepository {
  create(product: Product): Promise<void>;
  findById(id: number): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  update(product: Product): Promise<void>;
  delete(id: number): Promise<void>;
  list(limit: number, offset: number): Promise<Product[]>;
}
