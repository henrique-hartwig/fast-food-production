import { Product } from './entity';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<boolean>;
  list(limit: number, offset: number): Promise<Product[]>;
}
