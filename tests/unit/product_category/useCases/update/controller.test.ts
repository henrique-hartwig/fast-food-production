import { UpdateProductCategoryController } from '../../../../../src/product_category/useCases/update/controller';
import { ProductCategoryService } from '../../../../../src/product_category/domain/service';

describe('UpdateProductCategoryController', () => {
    let controller: UpdateProductCategoryController;
    let service: jest.Mocked<ProductCategoryService>;

    beforeEach(() => {
        service = {
            updateProductCategory: jest.fn(),
        } as any;
        controller = new UpdateProductCategoryController(service);
    });

    it('should update the product category', async () => {
        const request = {
            id: 1,
            name: 'Some Name',
            description: 'Product Category Descrition'
        };
        service.updateProductCategory.mockResolvedValue({
            id: 1,
            name: 'Some Name',
            description: 'Product Category Descrition'
        } as any);

        const result = await controller.handle(request);

        expect(result).toEqual({
            id: 1,
            name: 'Some Name',
            description: 'Product Category Descrition'
        });
        expect(service.updateProductCategory).toHaveBeenCalledWith(1,
            'Some Name',
            'Product Category Descrition');
    });

    it('should throw validation error', async () => {
        const request = {
            id: 1,
            name: '',
            description: 'Desc'
        };

        await expect(controller.handle(request)).rejects.toThrow();
    });

    it('should throw error if the service returns an error', async () => {
        const request = {
            id: 1,
            name: 'Some Name',
            description: 'Product Category Descrition'
        };
        service.updateProductCategory.mockResolvedValue({ error: 'Service error' } as any);

        await expect(controller.handle(request)).rejects.toThrow('Service error');
    });

    it('should throw unexpected error', async () => {
        const request = {
            id: 1,
            name: 'Some Name',
            description: 'Product Category Descrition'
        };
        service.updateProductCategory.mockRejectedValue(new Error('Unexpected error'));

        await expect(controller.handle(request)).rejects.toThrow('Unexpected error');
    });
});
