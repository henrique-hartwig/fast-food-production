import { z } from 'zod';
import { OrderService } from '../../domain/service';

const OrderItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  items: z.record(z.string(), z.array(OrderItemSchema).nonempty()),
  total: z.number().positive(),
  userId: z.number().int().positive().optional()
});

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;

export class CreateOrderController {
  constructor(private orderService: OrderService) { }

  async handle(request: CreateOrderRequest) {
    try {
      const validatedData = CreateOrderSchema.parse(request);

      const order = await this.orderService.createOrder(
        { items: validatedData.items },
        validatedData.total,
        validatedData.userId,
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