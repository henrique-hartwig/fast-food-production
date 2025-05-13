export enum MealStatus {
  PENDING = "pending",
  IN_PREPARATION = "in_preparation",
  READY = "ready",
  FINISHED = "finished",
  CANCELLED = "cancelled",
}

export interface MealItem {
  id: number;
  quantity: number;
}

export class Meal {
  constructor(
    public id: number,
    public items: MealItem[]
  ) {}
}
