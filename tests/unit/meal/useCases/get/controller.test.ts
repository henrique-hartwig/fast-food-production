import { GetMealController } from '../../../../../src/meal/useCases/get/controller';
import { MealService } from '../../../../../src/meal/domain/service';

describe('GetMealController', () => {
  let controller: GetMealController;
  let service: jest.Mocked<MealService>;

  beforeEach(() => {
    service = {
      getMealById: jest.fn(),
    } as any;
    controller = new GetMealController(service);
  });

  it('should get the meal', async () => {
    const request = { id: 1 };
    service.getMealById.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.getMealById).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.getMealById.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.getMealById.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
