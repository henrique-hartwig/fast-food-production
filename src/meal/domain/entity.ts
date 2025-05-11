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
