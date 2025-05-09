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
      ) as any;

      if(order.error) {
        throw new Error(order.error);
      }

      return order;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}