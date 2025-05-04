import { z } from 'zod';
import { OrderService } from '../../domain/service';

const OrderItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).nonempty(),
  total: z.number().positive(),
  userId: z.number().int().positive().optional()
});

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;

export class CreateOrderController {
  constructor(private orderService: OrderService) {}

  async handle(request: CreateOrderRequest) {
    try {
      const validatedData = CreateOrderSchema.parse(request);

      const order = await this.orderService.createOrder(
        { items: validatedData.items },
        validatedData.total,
        validatedData.userId,
      );

      return {
        statusCode: 201,
        body: {
          message: 'Order created successfully',
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