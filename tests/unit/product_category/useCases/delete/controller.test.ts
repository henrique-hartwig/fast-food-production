import { DeleteProductCategoryController } from '../../../../../src/product_category/useCases/delete/controller';
import { ProductCategoryService } from '../../../../../src/product_category/domain/service';

describe('DeleteProductCategoryController', () => {
  let controller: DeleteProductCategoryController;
  let service: jest.Mocked<ProductCategoryService>;

  beforeEach(() => {
    service = {
      deleteProductCategory: jest.fn(),
    } as any;
    controller = new DeleteProductCategoryController(service);
  });

  it('should delete the product category', async () => {
    const request = { id: 1 };
    service.deleteProductCategory.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.deleteProductCategory).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.deleteProductCategory.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.deleteProductCategory.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
