import { handler } from '../../../../../src/order/useCases/create/handler';

describe('Create Order Lambda', () => {
  it('deve retornar 400 se não enviar body', async () => {
    const event = { body: null } as any;
    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Request body is required');
  });

  it('deve retornar 201 ao criar um pedido válido', async () => {
    const event = {
      body: JSON.stringify({
        items: [{ productId: 1, quantity: 2 }],
        total: 50.0,
        userId: 1,
      }),
    } as any;

    // Aqui você pode mockar o PrismaClient e o repositório, se quiser isolar o teste

    const result = await handler(event);
    expect(result.statusCode).toBe(201);
    // Você pode validar mais coisas dependendo do retorno esperado
  });
});
