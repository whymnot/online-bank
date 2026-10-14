import { http, HttpResponse, delay } from 'msw';
import { ACCOUNTS, generateTransactions } from '../lib/mockData';

const TOKEN = 'demo-token';
const transactions = generateTransactions(200);

const isAuthed = (req: Request) => req.headers.get('Authorization') === `Bearer ${TOKEN}`;
const unauthorized = () => HttpResponse.json({ message: 'Требуется вход' }, { status: 401 });

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    await delay(500);
    const { login, password } = (await request.json()) as { login: string; password: string };
    if (login === 'demo' && password === 'demo123') {
      return HttpResponse.json({ token: TOKEN, name: 'Демо-клиент' });
    }
    return HttpResponse.json({ message: 'Неверный логин или пароль' }, { status: 401 });
  }),

  http.get('/api/accounts', async ({ request }) => {
    await delay(300);
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(ACCOUNTS);
  }),

  http.get('/api/transactions', async ({ request }) => {
    await delay(400);
    if (!isAuthed(request)) return unauthorized();

    const url = new URL(request.url);
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    const category = url.searchParams.get('category') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 20);

    const filtered = transactions.filter(
      (t) => (!q || t.title.toLowerCase().includes(q)) && (!category || t.category === category),
    );
    const items = filtered.slice((page - 1) * limit, page * limit);
    return HttpResponse.json({ items, total: filtered.length });
  }),
];