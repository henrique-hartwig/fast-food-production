import { DeleteMealController } from '../../../../../src/meal/useCases/delete/controller';
import { MealService } from '../../../../../src/meal/domain/service';

describe('DeleteMealController', () => {
  let controller: DeleteMealController;
  let service: jest.Mocked<MealService>;

  beforeEach(() => {
    service = {
      deleteMeal: jest.fn(),
    } as any;
    controller = new DeleteMealController(service);
  });

  it('should delete the meal', async () => {
    const request = { id: 1 };
    service.deleteMeal.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.deleteMeal).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.deleteMeal.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.deleteMeal.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
