import type { Account, Category, Transaction } from './types';

export const ACCOUNTS: Account[] = [
  { id: 'acc-1', name: 'Основной счёт', cardLast4: '1234', balance: 8_500_000 },
  { id: 'acc-2', name: 'Накопительный', cardLast4: '5678', balance: 24_000_000 },
];

const TITLES: Record<Category, string[]> = {
  food: ['Korzinka', 'Evos', 'Oqtepa Lavash'],
  transport: ['Yandex Go', 'Metro', 'Заправка'],
  shopping: ['Uzum Market', 'Mediapark'],
  salary: ['Зарплата'],
  bills: ['Электричество', 'Интернет', 'Мобильная связь'],
  other: ['Перевод', 'Подарок'],
};

const CATEGORIES = Object.keys(TITLES) as Category[];

// детерминированный генератор: одинаковый результат при каждом запуске
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function generateTransactions(count = 200): Transaction[] {
  const rand = rng(42);
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const titles = TITLES[category];
    const base = Math.round((rand() * 500_000 + 10_000) / 1000) * 1000;
    return {
      id: `tx-${i}`,
      date: new Date(now - i * 1000 * 60 * 60 * (6 + rand() * 20)).toISOString(),
      title: titles[Math.floor(rand() * titles.length)],
      category,
      amount: category === 'salary' ? base * 8 : -base,
    };
  });
}