import { z } from 'zod';
import { OrderService } from '../../../domain/services/OrderService';

const GetOrderSchema = z.object({
  id: z.number().int().positive()
});

export type GetOrderRequest = z.infer<typeof GetOrderSchema>;

export class GetOrderController {
  constructor(private orderService: OrderService) {}

  async handle(request: GetOrderRequest) {
    try {
      const validatedData = GetOrderSchema.parse(request);

      const order = await this.orderService.getOrderById(
        validatedData.id
      );

      return {
        statusCode: 200,
        body: {
          message: 'Order retrieved successfully',
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