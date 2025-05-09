import { z } from 'zod';
import { OrderService } from '../../domain/service';

const GetOrderSchema = z.object({
  id: z.number().int().positive()
});

export type GetOrderRequest = z.infer<typeof GetOrderSchema>;

export class GetOrderController {
  constructor(private orderService: OrderService) { }

  async handle(request: GetOrderRequest) {
    try {
      const validatedData = GetOrderSchema.parse(request);

      const order = await this.orderService.getOrderById(
        validatedData.id
      ) as any;

      if (order.error) {
        throw Error(order.error);
      }

      return order;
    } catch (error) {
      throw error;
    }
  }
}