import { MealRepository } from './repository';
import { Meal } from './entity';
import { PrismaClient } from '@prisma/client';

export class DbMealRepository implements MealRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(meal: Meal): Promise<Meal> {
    const mealData = await this.prisma.meal.create({
      data: {
        items: meal.items,
      },
    });

    return new Meal(
      mealData.id,
      mealData.items,
    );
  }

  async findById(id: number): Promise<Meal | null> {
    const mealData = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!mealData) {
      return null;
    }

    return new Meal(
      mealData.id,
      mealData.items,
    );
  }

  async update(meal: Meal): Promise<Meal> {
    const mealData = await this.prisma.meal.update({
      where: { id: meal.id },
      data: {
        items: meal.items,
      },
    });

    return new Meal(
      mealData.id,
      mealData.items,
    );
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.meal.delete({
      where: { id },
    });
    return true;
  }

  async list(limit: number, offset: number): Promise<Meal[]> {
    const mealsData = await this.prisma.meal.findMany({
      skip: offset,
      take: limit,
    });
    return mealsData.map((mealData: Meal) => 
      new Meal(
        mealData.id,
        mealData.items,
      ),
    );
  }
}
