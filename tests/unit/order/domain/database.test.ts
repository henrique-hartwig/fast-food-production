import { describe, it, expect } from '@jest/globals';
import { parseItems } from '../../../../src/order/domain/database';

describe('parseItems', () => {
  it('should return null if items is null', () => {
    expect(parseItems(null)).toBeNull();
    expect(parseItems(undefined)).toBeNull();
  });

  it('should return object if items is a valid JSON string', () => {
    const json = '{"items":[{"id":1,"quantity":2}]}';
    expect(parseItems(json)).toEqual({ items: [{ id: 1, quantity: 2 }] });
  });

  it('should return null if items is an invalid JSON string', () => {
    expect(parseItems('not a json')).toBeNull();
  });

  it('should return the same object if items is already an object', () => {
    const obj = { items: [{ id: 1, quantity: 2 }] };
    expect(parseItems(obj)).toBe(obj);
  });
});
