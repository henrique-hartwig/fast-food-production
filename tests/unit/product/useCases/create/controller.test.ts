import { CreateProductController } from '../../../../../src/product/useCases/create/controller';
import { ProductService } from '../../../../../src/product/domain/service';

describe('CreateOrderController', () => {
  let controller: CreateProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(() => {
    service = {
      createProduct: jest.fn(),
    } as any;
    controller = new CreateProductController(service);
  });

  it('should create the product', async () => {
    const request = {
      name: 'Product 1',
      price: 10,
      description: 'Description 1',
      categoryId: 1,
      userId: 1
    };
    service.createProduct.mockResolvedValue({
      id: 1,
      name: 'Product 1',
      price: 10,
      description: 'Description 1',
      categoryId: 1,
      userId: 1
    } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({
      id: 1,
      name: 'Product 1',
      price: 10,
      description: 'Description 1',
      categoryId: 1,
      userId: 1
    } as any);
    expect(service.createProduct).toHaveBeenCalledWith(
      'Product 1',
      'Description 1',
      10,
      1
    );
  });

  it('should throw validation error', async () => {
    const request = {
      id: 1,
      name: 'Product 1',
      price: 10,
      description: 'Description 1',
      categoryId: 1,
      userId: 1
    };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = {
      name: 'Product 1',
      price: 10,
      description: 'Description 1',
      categoryId: 1,
      userId: 1
    };
    service.createProduct.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      name: 'Product 1',
      price: 10,
      description: 'Description 1',
      categoryId: 1,
      userId: 1
    };
    service.createProduct.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
