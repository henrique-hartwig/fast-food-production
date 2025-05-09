import { ListProductsController } from '../../../../../src/product/useCases/list/controller';
import { ProductService } from '../../../../../src/product/domain/service';

describe('ListProductsController', () => {
  let controller: ListProductsController;
  let service: jest.Mocked<ProductService>;

  beforeEach(() => {
    service = {
      listProducts: jest.fn(),
    } as any;
    controller = new ListProductsController(service);
  });

  it('should list the products', async () => {
    const request = { limit: 10, offset: 0 };
    service.listProducts.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.listProducts).toHaveBeenCalledWith(10, 0);
  });

  it('should throw validation error', async () => {
    const request = { limit: 10, offset: 0 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listProducts.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listProducts.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
