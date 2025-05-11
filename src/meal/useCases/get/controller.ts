import { z } from 'zod';
import { MealService } from '../../domain/service';

const GetMealSchema = z.object({
  id: z.number().int().positive()
});

export type GetMealRequest = z.infer<typeof GetMealSchema>;

export class GetMealController {
  constructor(private mealService: MealService) {}

  async handle(request: GetMealRequest) {
    try {
      const validatedData = GetMealSchema.parse(request);

      const meal = await this.mealService.getMealById(
        validatedData.id
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