import { handler } from '../../../../../src/meal/useCases/update/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Update Meal Lambda', () => {
  let mockMealUpdate: jest.Mock;
  let mockMealFindUnique: jest.Mock;

  beforeEach(() => {
    mockMealUpdate = jest.fn();
    mockMealFindUnique = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      meal: {
        update: mockMealUpdate,
        findUnique: mockMealFindUnique,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should update the meal', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
      }),
    } as any;

    mockMealFindUnique.mockResolvedValue({
      id: 123,
      items: [{ id: 1, quantity: 1 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockMealUpdate.mockResolvedValue({
      id: 123,
      items: [{ id: 1, quantity: 1 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      id: 123,
      items: [{ id: 1, quantity: 1 }],
    });
  });

  it('should return 400 if body is not provided', async () => {
    const event = {
      pathParameters: { id: 123 }
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Meal ID and body are required');
    expect(mockMealUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if meal id is not provided in path', async () => {
    const event = {
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
      })
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Meal ID and body are required');
    expect(mockMealUpdate).not.toHaveBeenCalled();
  });

  it('should return 500 for generic errors', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
      }),
    } as any;

    mockMealUpdate.mockRejectedValueOnce(new Error('Generic error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
  });
});
