import { z } from 'zod';
import { OrderService } from '../../domain/service';

const OrderItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const UpdateOrderSchema = z.object({
  id: z.number().int().positive(),
  items: z.object({
    items: z.array(OrderItemSchema).nonempty()
  }),
  total: z.number().positive(),
  userId: z.number().int().positive().optional()
});

export type UpdateOrderRequest = z.infer<typeof UpdateOrderSchema>;

export class UpdateOrderController {
  constructor(private orderService: OrderService) {}

  async handle(request: UpdateOrderRequest) {
    try {
      const validatedData = UpdateOrderSchema.parse(request);

      const order = await this.orderService.updateOrder(
        validatedData.id,
        { items: validatedData.items },
        validatedData.total,
        validatedData.userId
      ) as any;

      if (order.error) {
        throw order.error;
      }
      return order;
    } catch (error: any) {
      throw error;
    }
  }
}