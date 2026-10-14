import { describe, it, expect } from 'vitest';
import { generateTransactions } from './mockData';

describe('generateTransactions', () => {
  it('возвращает запрошенное количество операций', () => {
    const list = generateTransactions(50);
    expect(list.length).toBe(50);
  });

  it('зарплата всегда положительная', () => {
    const salaries = generateTransactions(200).filter((t) => t.category === 'salary');
    expect(salaries.length).toBeGreaterThan(0);
    expect(salaries.every((t) => t.amount > 0)).toBe(true);
  });
});