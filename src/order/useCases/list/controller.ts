import { z } from 'zod';
import { OrderService } from '../../domain/service';


const ListOrdersSchema = z.object({
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative()
});

export type ListOrdersRequest = z.infer<typeof ListOrdersSchema>;

export class ListOrdersController {
  constructor(private orderService: OrderService) {}

  async handle(request: ListOrdersRequest) {
    try {
      const validatedData = ListOrdersSchema.parse(request);

      const orders = await this.orderService.listOrders(
        validatedData.limit,
        validatedData.offset
      ) as any;

      if (orders.error) {
        throw Error(orders.error);
      }

      return orders;
    } catch (error: any) {
      throw error;
    }
  }
}