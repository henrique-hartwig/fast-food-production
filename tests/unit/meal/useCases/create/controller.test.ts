import { CreateMealController } from '../../../../../src/meal/useCases/create/controller';
import { MealService } from '../../../../../src/meal/domain/service';

describe('CreateMealController', () => {
  let controller: CreateMealController;
  let service: jest.Mocked<MealService>;

  beforeEach(() => {
    service = {
      createMeal: jest.fn(),
    } as any;
    controller = new CreateMealController(service);
  });

  it('should create the meal', async () => {
    const request = {
      items: [{ id: 1, quantity: 1 }],
    };
    service.createMeal.mockResolvedValue({
      id: 1,
      items: [{ id: 1, quantity: 1 }],
    } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({
      id: 1,
      items: [{ id: 1, quantity: 1 }],
    } as any);
    expect(service.createMeal).toHaveBeenCalledWith(
      [{ id: 1, quantity: 1 }],
    );
  });

  it('should throw validation error', async () => {
    const request = {
      items: [{ id: 1, quantity: 1 }],
    };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = {
      items: [{ id: 1, quantity: 1 }],
    };
    service.createMeal.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      items: [{ id: 1, quantity: 1 }],
    };
    service.createMeal.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
