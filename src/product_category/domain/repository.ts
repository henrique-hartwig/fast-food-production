import { Meal } from './entity';

export interface MealRepository {
  create(meal: Meal): Promise<Meal>;
  findById(id: number): Promise<Meal | null>;
  update(meal: Meal): Promise<Meal>;
  delete(id: number): Promise<boolean>;
  list(limit: number, offset: number): Promise<Meal[]>;
}
