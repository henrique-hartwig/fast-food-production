import { z } from 'zod';
import { OrderService } from '../../../domain/services/OrderService';


const ListOrdersSchema = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().positive().optional()
});

export type ListOrdersRequest = z.infer<typeof ListOrdersSchema>;

export class ListOrdersController {
  constructor(private orderService: OrderService) {}

  async handle(request: ListOrdersRequest) {
    try {
      const validatedData = ListOrdersSchema.parse(request);

      const orders = await this.orderService.listOrders(
        validatedData.limit ?? 10,
        validatedData.offset ?? 0
      );

      return {
        statusCode: 200,
        body: {
          message: 'Orders retrieved successfully',
          data: orders,
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