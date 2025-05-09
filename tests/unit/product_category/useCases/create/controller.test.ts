import { CreateProductCategoryController } from '../../../../../src/product_category/useCases/create/controller';
import { ProductCategoryService } from '../../../../../src/product_category/domain/service';

describe('CreateOrderController', () => {
  let controller: CreateProductCategoryController;
  let service: jest.Mocked<ProductCategoryService>;

  beforeEach(() => {
    service = {
      createProductCategory: jest.fn(),
    } as any;
    controller = new CreateProductCategoryController(service);
  });

  it('should create the product category', async () => {
    const request = {
      name: 'Product 1',
      description: 'Description 1',
    };
    service.createProductCategory.mockResolvedValue({
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
    } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
    } as any);
    expect(service.createProductCategory).toHaveBeenCalledWith(
      'Product 1',
      'Description 1',
    );
  });

  it('should throw validation error', async () => {
    const request = {
      name: 'Product 1',
      description: 'Description 1',
    };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = {
      name: 'Product 1',
      description: 'Description 1',
    };
    service.createProductCategory.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      name: 'Product 1',
      description: 'Description 1',
    };
    service.createProductCategory.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
