import { UpdateMealController } from '../../../../../src/meal/useCases/update/controller';
import { MealService } from '../../../../../src/meal/domain/service';

describe('UpdateMealController', () => {
    let controller: UpdateMealController;
    let service: jest.Mocked<MealService>;

    beforeEach(() => {
        service = {
            updateMeal: jest.fn(),
        } as any;
        controller = new UpdateMealController(service);
    });

    it('should update the meal', async () => {
        const request = {
            id: 1,
            items: [{ id: 1, quantity: 1 }],
        };
        service.updateMeal.mockResolvedValue({
            id: 1,
            items: [{ id: 1, quantity: 1 }],
        } as any);

        const result = await controller.handle(request);

        expect(result).toEqual({
            id: 1,
            items: [{ id: 1, quantity: 1 }],
        });
        expect(service.updateMeal).toHaveBeenCalledWith(1,
            [{ id: 1, quantity: 1 }]);
    });

    it('should throw validation error', async () => {
        const request = {
            id: 1,
            items: [{ id: 1, quantity: 1 }],
        };

        await expect(controller.handle(request)).rejects.toThrow();
    });

    it('should throw error if the service returns an error', async () => {
        const request = {
            id: 1,
            items: [{ id: 1, quantity: 1 }],
        };
        service.updateMeal.mockResolvedValue({ error: 'Service error' } as any);

        await expect(controller.handle(request)).rejects.toThrow('Service error');
    });

    it('should throw unexpected error', async () => {
        const request = {
            id: 1,
            items: [{ id: 1, quantity: 1 }],
        };
        service.updateMeal.mockRejectedValue(new Error('Unexpected error'));

        await expect(controller.handle(request)).rejects.toThrow('Unexpected error');
    });
});
