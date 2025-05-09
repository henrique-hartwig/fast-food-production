import { ListProductCategoriesController } from '../../../../../src/product_category/useCases/list/controller';
import { ProductCategoryService } from '../../../../../src/product_category/domain/service';

describe('ListProductCategoriesController', () => {
  let controller: ListProductCategoriesController;
  let service: jest.Mocked<ProductCategoryService>;

  beforeEach(() => {
    service = {
      listProductCategories: jest.fn(),
    } as any;
    controller = new ListProductCategoriesController(service);
  });

  it('should list the product categories', async () => {
    const request = { limit: 10, offset: 0 };
    service.listProductCategories.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.listProductCategories).toHaveBeenCalledWith(10, 0);
  });

  it('should throw validation error', async () => {
    const request = { limit: 10, offset: 0 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listProductCategories.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listProductCategories.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
