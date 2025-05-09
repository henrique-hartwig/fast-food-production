import { ProductCategoryRepository } from './repository';
import { ProductCategory } from './entity';
import { PrismaClient } from '@prisma/client';

export class DbProductCategoryRepository implements ProductCategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(productCategory: ProductCategory): Promise<ProductCategory> {
    const productCategoryData = await this.prisma.productCategory.create({
      data: {
        name: productCategory.name,
        description: productCategory.description,
      },
    });

    return new ProductCategory(
      productCategoryData.id,
      productCategoryData.name,
      productCategoryData.description,
    );
  }

  async findById(id: number): Promise<ProductCategory | null> {
    const productCategoryData = await this.prisma.productCategory.findUnique({
      where: { id },
    });

    if (!productCategoryData) {
      return null;
    }

    return new ProductCategory(
      productCategoryData.id,
      productCategoryData.name,
      productCategoryData.description,
    );
  }

  async update(productCategory: ProductCategory): Promise<ProductCategory> {
    const productCategoryData = await this.prisma.productCategory.update({
      where: { id: productCategory.id },
      data: {
        name: productCategory.name,
        description: productCategory.description,
      },
    });

    return new ProductCategory(
      productCategoryData.id,
      productCategoryData.name,
      productCategoryData.description,
    );
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.productCategory.delete({
      where: { id },
    });
    return true;
  }

  async list(limit: number, offset: number): Promise<ProductCategory[]> {
    const productCategoriesData = await this.prisma.productCategory.findMany({
      skip: offset,
      take: limit,
    });
    return productCategoriesData.map((productCategoryData: ProductCategory) => 
      new ProductCategory(
        productCategoryData.id,
        productCategoryData.name,
        productCategoryData.description,
      ),
    );
  }
}
