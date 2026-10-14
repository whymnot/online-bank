import { describe, it, expect } from 'vitest';
import { formatDay, greeting, money, signed } from './format';

describe('greeting', () => {
  it('утром желает доброго утра', () => {
    expect(greeting(new Date(2026, 0, 1, 9))).toBe('Доброе утро');
  });

  it('днём, вечером и ночью приветствие меняется', () => {
    expect(greeting(new Date(2026, 0, 1, 15))).toBe('Добрый день');
    expect(greeting(new Date(2026, 0, 1, 20))).toBe('Добрый вечер');
    expect(greeting(new Date(2026, 0, 1, 3))).toBe('Доброй ночи');
  });
});

describe('signed', () => {
  it('у пополнения стоит плюс', () => {
    expect(signed(4_000_000).startsWith('+')).toBe(true);
  });

  it('у расхода стоит настоящий минус (U+2212), а не дефис', () => {
    expect(signed(-5000).startsWith('\u2212')).toBe(true);
  });
});

describe('money', () => {
  it('убирает знак, потому что он выводится отдельно', () => {
    expect(money(-5000)).toBe(money(5000));
  });
});

describe('formatDay', () => {
  it('сегодняшняя дата показывается как «Сегодня»', () => {
    expect(formatDay(new Date().toISOString())).toBe('Сегодня');
  });

  it('вчерашняя дата показывается как «Вчера»', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatDay(yesterday.toISOString())).toBe('Вчера');
  });
});