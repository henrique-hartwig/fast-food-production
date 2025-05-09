import { GetProductController } from '../../../../../src/product/useCases/get/controller';
import { ProductService } from '../../../../../src/product/domain/service';

describe('GetProductController', () => {
  let controller: GetProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(() => {
    service = {
      getProductById: jest.fn(),
    } as any;
    controller = new GetProductController(service);
  });

  it('should get the product', async () => {
    const request = { id: 1 };
    service.getProductById.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.getProductById).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.getProductById.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.getProductById.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
