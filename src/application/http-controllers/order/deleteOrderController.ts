import { z } from 'zod';
import { OrderService } from '../../../domain/services/OrderService';


const DeleteOrderSchema = z.object({
  id: z.number().int().positive()
});

export type DeleteOrderRequest = z.infer<typeof DeleteOrderSchema>;

export class DeleteOrderController {
  constructor(private orderService: OrderService) {}

  async handle(request: DeleteOrderRequest) {
    try {
      const validatedData = DeleteOrderSchema.parse(request);

      const order = await this.orderService.deleteOrder(
        validatedData.id
      );

      return {
        statusCode: 201,
        body: {
          message: 'Order deleted successfully',
          data: order,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: {
            message: 'Validation error',
            details: error.errors,
          },
        };
      }
      
      return {
        statusCode: 500,
        body: {
          message: 'Internal server error',
          details: error,
        },
      };
    }
  }
}