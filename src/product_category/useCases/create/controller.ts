import { z } from 'zod';
import { MealService } from '../../domain/service';

const CreateMealSchema = z.object({
  items: z.array(z.object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive()
  }))
});

export type CreateMealRequest = z.infer<typeof CreateMealSchema>;

export class CreateMealController {
  constructor(private mealService: MealService) { }

  async handle(request: CreateMealRequest) {
    try {
      const validatedData = CreateMealSchema.parse(request);

      const meal = await this.mealService.createMeal(validatedData.items) as any;

      if (meal.error) {
        throw Error(meal.error);
      }

      return meal;
    } catch (error: any) {
      throw error;
    }
  }
}