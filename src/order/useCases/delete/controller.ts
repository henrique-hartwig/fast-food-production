import { z } from 'zod';
import { OrderService } from '../../domain/service';


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
      ) as any;

      if (order.error) {
        throw Error(order.error);
      }

      return order;
    } catch (error: any) {
      throw error;
    }
  }
}