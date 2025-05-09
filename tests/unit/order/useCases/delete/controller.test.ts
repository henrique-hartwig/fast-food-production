import { DeleteOrderController } from '../../../../../src/order/useCases/delete/controller';
import { OrderService } from '../../../../../src/order/domain/service';

describe('DeleteOrderController', () => {
  let controller: DeleteOrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(() => {
    service = {
      deleteOrder: jest.fn(),
    } as any;
    controller = new DeleteOrderController(service);
  });

  it('should delete the order', async () => {
    const request = { id: 1 };
    service.deleteOrder.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.deleteOrder).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.deleteOrder.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.deleteOrder.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
