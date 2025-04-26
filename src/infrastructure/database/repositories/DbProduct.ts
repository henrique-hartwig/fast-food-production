import { PrismaClient } from '@prisma/client';
import { Product } from '../../../domain/entities/Product';
import { ProductRepository } from '../../../domain/repositories/ProductRepository';

export class DbProductRepository implements ProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
      },
    });
  }

  async findById(id: number): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productData) {
      return null;
    }

    return new Product(
      productData.id,
      productData.name,
      productData.description,
      productData.price,
      productData.categoryId,
    );
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { categoryId },
    });
    return productsData.map((productData: Product) => 
      new Product(
        productData.id,
        productData.name,
        productData.description,
        productData.price,
        productData.categoryId,
      ),
    );
  }

  async update(product: Product): Promise<void> {
    await this.prisma.product.update({
      where: { id: product.id },
      data: product,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async list(limit: number, offset: number): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      skip: offset,
      take: limit,
    });
    return productsData.map((productData: Product) => 
      new Product(
        productData.id,
        productData.name,
        productData.description,
        productData.price,
        productData.categoryId,
      ),
    );
  }
}
