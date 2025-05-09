import { UpdateOrderStatusController } from '../../../../../src/order/useCases/update_status/controller';
import { OrderService } from '../../../../../src/order/domain/service';

describe('UpdateOrderStatusController', () => {
  let controller: UpdateOrderStatusController;
  let service: jest.Mocked<OrderService>;

  beforeEach(() => {
    service = {
      updateOrderStatus: jest.fn(),
    } as any;
    controller = new UpdateOrderStatusController(service);
  });

  it('should update the order status', async () => {
    const request = {
      id: 1,
      status: 'in_preparation',
    };
    service.updateOrderStatus.mockResolvedValue({
      id: 1,
      status: 'in_preparation',
    } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({
      id: 1,
      status: 'in_preparation',
    } as any);
    expect(service.updateOrderStatus).toHaveBeenCalledWith(1, 'in_preparation');
  });

  it('should throw validation error', async () => {
    const request = {
      id: 1,
      status: 'in_preparation',
    };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = {
      id: 1,
      status: 'in_preparation',
    };
    service.updateOrderStatus.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      id: 1,
      status: 'in_preparation',
    };
    service.updateOrderStatus.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
