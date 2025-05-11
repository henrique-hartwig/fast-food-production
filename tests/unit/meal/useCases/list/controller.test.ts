import { ListMealsController } from '../../../../../src/meal/useCases/list/controller';
import { MealService } from '../../../../../src/meal/domain/service';

describe('ListMealsController', () => {
  let controller: ListMealsController;
  let service: jest.Mocked<MealService>;

  beforeEach(() => {
    service = {
      listMeals: jest.fn(),
    } as any;
    controller = new ListMealsController(service);
  });

  it('should list the meals', async () => {
    const request = { limit: 10, offset: 0 };
    service.listMeals.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.listMeals).toHaveBeenCalledWith(10, 0);
  });

  it('should throw validation error', async () => {
    const request = { limit: 10, offset: 0 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listMeals.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listMeals.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
