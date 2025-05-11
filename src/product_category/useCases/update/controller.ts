import { z } from 'zod';
import { MealService } from '../../domain/service';

const UpdateMealSchema = z.object({
  id: z.number().int().positive(),
  items: z.array(z.object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive()
  }))
});

export type UpdateMealRequest = z.infer<typeof UpdateMealSchema>;

export class UpdateMealController {
  constructor(private mealService: MealService) { }

  async handle(request: UpdateMealRequest) {
    try {
      const validatedData = UpdateMealSchema.parse(request);
      const meal = await this.mealService.updateMeal(
        validatedData.id,
        validatedData.items
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