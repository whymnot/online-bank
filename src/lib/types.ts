export type Category = 'food' | 'transport' | 'shopping' | 'salary' | 'bills' | 'other';

export type Transaction = {
  id: string;
  date: string; // ISO
  title: string;
  category: Category;
  amount: number; // плюс = пополнение, минус = расход
};

export type Account = {
  id: string;
  name: string;
  cardLast4: string;
  balance: number;
};