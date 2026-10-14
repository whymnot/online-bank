import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { greeting, money } from '../lib/format';
import { TransactionRow } from '../components/TransactionRow';
import type { Account, Transaction } from '../lib/types';

const MASK = '••• •••';

export function DashboardPage() {
  const { session } = useAuth();
  const token = session?.token ?? '';
  const [hidden, setHidden] = useState(false);

  const accounts = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api<Account[]>('/api/accounts', { token }),
  });
  const recent = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => api<{ items: Transaction[]; total: number }>('/api/transactions?limit=6', { token }),
  });

  const total = accounts.data?.reduce((sum, a) => sum + a.balance, 0) ?? 0;

  return (
    <>
      <header className="page-head">
        <div>
          <h1 className="greet">{greeting()}, {session?.name}</h1>
          {accounts.isLoading ? (
            <span className="skeleton" style={{ width: 280, height: 48, marginTop: 8 }} />
          ) : (
            <p className="total">
              {hidden ? MASK : money(total)}
              <span className="cur">сум</span>
            </p>
          )}
          <p className="muted">Всего на счетах</p>
        </div>
        <button className="btn btn-quiet" aria-pressed={hidden} onClick={() => setHidden((h) => !h)}>
          {hidden ? 'Показать суммы' : 'Скрыть суммы'}
        </button>
      </header>

      <section className="cards" aria-label="Счета">
        {accounts.isLoading && (
          <>
            <span className="skeleton card-skel" />
            <span className="skeleton card-skel" />
          </>
        )}
        {accounts.error && (
          <p className="error" role="alert">
            Не удалось загрузить счета: {accounts.error.message}. Обновите страницу.
          </p>
        )}
        {accounts.data?.map((a, i) => (
          <article className="bank-card" data-tone={i % 2 ? 'teal' : 'lapis'} key={a.id}>
            <div className="card-top">
              <span>{a.name}</span>
              <span className="chip" aria-hidden />
            </div>
            <div>
              <div className="card-balance">
                {hidden ? MASK : money(a.balance)}
                <small>сум</small>
              </div>
              <div className="card-num">•••• {a.cardLast4}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="panel" aria-labelledby="recent-title">
        <div className="panel-head">
          <h2 id="recent-title">Последние операции</h2>
          <Link className="link" to="/operations">Все операции</Link>
        </div>

        {recent.isLoading &&
          Array.from({ length: 4 }, (_, i) => (
            <div className="tx" key={i}>
              <span className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
              <span className="skeleton" style={{ width: 160, height: 18 }} />
              <span className="skeleton" style={{ width: 80, height: 18 }} />
            </div>
          ))}

        {recent.error && (
          <p className="error" role="alert">
            Не удалось загрузить операции: {recent.error.message}. Обновите страницу.
          </p>
        )}

        {recent.data && (
          <ul className="tx-list">
            {recent.data.items.map((t) => (
              <TransactionRow key={t.id} t={t} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}