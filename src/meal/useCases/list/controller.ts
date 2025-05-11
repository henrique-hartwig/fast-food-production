import { z } from 'zod';
import { MealService } from '../../domain/service';

const ListMealsSchema = z.object({
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative()
});

export type ListMealsRequest = z.infer<typeof ListMealsSchema>;

export class ListMealsController {
  constructor(private mealService: MealService) {}

  async handle(request: ListMealsRequest) {
    try {
      const validatedData = ListMealsSchema.parse(request);

      const meal = await this.mealService.listMeals(
        validatedData.limit,
        validatedData.offset
      ) as any;

      if (meal.error) {
        throw Error(meal.error);
      }

      return meal;
    } catch (error: any) {
      throw error;
    }
  }
}