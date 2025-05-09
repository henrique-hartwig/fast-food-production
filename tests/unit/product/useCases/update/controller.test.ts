import { UpdateProductController } from '../../../../../src/product/useCases/update/controller';
import { ProductService } from '../../../../../src/product/domain/service';

describe('UpdateProductController', () => {
  let controller: UpdateProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(() => {
    service = {
      updateProduct: jest.fn(),
    } as any;
    controller = new UpdateProductController(service);
  });

  it('should update the product', async () => {
    const request = {
      id: 1,
      name: 'Some Name',
      description: 'Product Descrition',
      price: 10,
      categoryId: 1
    };
    service.updateProduct.mockResolvedValue({
      id: 1,
      name: 'Some Name',
      description: 'Product Descrition',
      price: 10,
      categoryId: 1
    } as any);

    const result = await controller.handle(request);

    expect(result).toEqual({
      id: 1,
      name: 'Some Name',
      description: 'Product Descrition',
      price: 10,
      categoryId: 1
    } as any);
    expect(service.updateProduct).toHaveBeenCalledWith(1, {
      name: 'Some Name',
      description: 'Product Descrition',
      price: 10,
      categoryId: 1
    });
  });

  it('should throw validation error', async () => {
    const request = {
      id: 1, name: '',
      description: 'Desc',
      price: 10,
      categoryId: 1
    };

    await expect(controller.handle(request)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1, name: 'Some Name', description: 'Product Descrition', price: 10, categoryId: 1 };
    service.updateProduct.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      id: 1,
      name: 'Some Name',
      description: 'Product Descrition',
      price: 10,
      categoryId: 1
    };
    service.updateProduct.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request)).rejects.toThrow('Unexpected error');
  });
});
