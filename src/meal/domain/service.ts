import { Meal, MealItem } from './entity';
import { MealRepository } from './repository';

export class MealService {
  constructor(private meal: MealRepository) {}

  async createMeal(items: MealItem[]): Promise<Meal> {
    const meal = new Meal(Date.now(), items);
    return this.meal.create(meal);
  }

  async getMealById(id: number): Promise<Meal | null> {
    return this.meal.findById(id);
  }

  async updateMeal(id: number, items: MealItem[]): Promise<Meal> {
    const meal = await this.meal.findById(id);
    if (!meal) {
      throw new Error('Meal not found');
    }

    const updatedMeal = new Meal(id, items);
    return this.meal.update(updatedMeal);
  }

  async deleteMeal(id: number): Promise<boolean> {
    return this.meal.delete(id);
  }

  async listMeals(limit: number, offset: number): Promise<Meal[]> {
    return this.meal.list(limit, offset);
  }
}
