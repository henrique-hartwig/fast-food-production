import { z } from 'zod';
import { MealService } from '../../domain/service';

const DeleteMealSchema = z.object({
  id: z.number().int().positive()
});

export type DeleteMealRequest = z.infer<typeof DeleteMealSchema>;

export class DeleteMealController {
  constructor(private mealService: MealService) {}

  async handle(request: DeleteMealRequest) {
    try {
      const validatedData = DeleteMealSchema.parse(request);

      const meal = await this.mealService.deleteMeal(
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