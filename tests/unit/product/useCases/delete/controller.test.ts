import { DeleteProductController } from '../../../../../src/product/useCases/delete/controller';
import { ProductService } from '../../../../../src/product/domain/service';

describe('DeleteOrderController', () => {
  let controller: DeleteProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(() => {
    service = {
      deleteProduct: jest.fn(),
    } as any;
    controller = new DeleteProductController(service);
  });

  it('should delete the product', async () => {
    const request = { id: 1 };
    service.deleteProduct.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.deleteProduct).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.deleteProduct.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.deleteProduct.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
