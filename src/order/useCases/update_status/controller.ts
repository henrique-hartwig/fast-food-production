import { z } from 'zod';
import { OrderService } from '../../domain/service';
import { OrderStatus } from '../../domain/entity';

const UpdateOrderStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.nativeEnum(OrderStatus)
});

export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusSchema>;

export class UpdateOrderStatusController {
  constructor(private orderService: OrderService) {}

  async handle(request: UpdateOrderStatusRequest) {
    try {
      const validatedData = UpdateOrderStatusSchema.parse(request);

      const order = await this.orderService.updateOrderStatus(
        validatedData.id,
        validatedData.status
      );

      return {
        statusCode: 200,
        body: {
          message: 'Order status updated successfully',
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