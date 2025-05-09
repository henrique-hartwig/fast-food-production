import { GetProductCategoryController } from '../../../../../src/product_category/useCases/get/controller';
import { ProductCategoryService } from '../../../../../src/product_category/domain/service';

describe('GetProductController', () => {
  let controller: GetProductCategoryController;
  let service: jest.Mocked<ProductCategoryService>;

  beforeEach(() => {
    service = {
      getProductCategoryById: jest.fn(),
    } as any;
    controller = new GetProductCategoryController(service);
  });

  it('should get the product category', async () => {
    const request = { id: 1 };
    service.getProductCategoryById.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.getProductCategoryById).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.getProductCategoryById.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.getProductCategoryById.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
