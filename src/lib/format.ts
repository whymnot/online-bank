import type { Category } from './types';

export const CATEGORY_LABEL: Record<Category, string> = {
  food: 'Продукты и кафе',
  transport: 'Транспорт',
  shopping: 'Покупки',
  salary: 'Зарплата',
  bills: 'Коммунальные и связь',
  other: 'Другое',
};

export const money = (n: number) => Math.abs(n).toLocaleString('ru-RU');

export const signed = (n: number) => `${n > 0 ? '+' : '−'}${money(n)}`;

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export function formatDay(iso: string): string {
  const d = new Date(iso);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}