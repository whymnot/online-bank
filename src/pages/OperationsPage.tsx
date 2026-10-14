import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { CATEGORY_LABEL } from '../lib/format';
import { TransactionRow } from '../components/TransactionRow';
import type { Transaction } from '../lib/types';

const LIMIT = 15;

export function OperationsPage() {
  const { session } = useAuth();
  const token = session?.token ?? '';
  const [params, setSearchParams] = useSearchParams();

  // значения берём из адресной строки
  const urlQ = params.get('q') ?? '';
  const rawCategory = params.get('category') ?? '';
  const category = rawCategory in CATEGORY_LABEL ? rawCategory : '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  // текст в поле хранится отдельно, чтобы буквы печатались без задержки
  const [search, setSearch] = useState(urlQ);
  const timer = useRef<number | undefined>(undefined);

  // если адрес изменился снаружи (кнопка «Назад» в браузере), обновляем поле
  useEffect(() => {
    setSearch((s) => (s.trim() === urlQ ? s : urlQ));
  }, [urlQ]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // пустое значение удаляет параметр из адреса
  const update = (changes: Record<string, string>, replace = false) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace },
    );
  };

  const onSearch = (value: string) => {
    setSearch(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => update({ q: value.trim(), page: '' }, true), 300);
  };

  const goTo = (p: number) => {
    update({ page: p > 1 ? String(p) : '' });
    window.scrollTo({ top: 0 });
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setSearch('');
    setSearchParams({});
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['transactions', { q: urlQ, category, page }],
    queryFn: () => {
      const query = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (urlQ) query.set('q', urlQ);
      if (category) query.set('category', category);
      return api<{ items: Transaction[]; total: number }>(`/api/transactions?${query}`, { token });
    },
    placeholderData: keepPreviousData,
  });

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <>
      <h1 className="page-title">Операции</h1>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Поиск по названию"
          aria-label="Поиск по названию"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <select
          aria-label="Категория"
          value={category}
          onChange={(e) => update({ category: e.target.value, page: '' })}
        >
          <option value="">Все категории</option>
          {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <section className="panel" aria-busy={isFetching}>
        <div className="panel-head">
          <h2>История</h2>
          {data && <span className="muted">Найдено: {total}</span>}
        </div>

        {isLoading &&
          Array.from({ length: 6 }, (_, i) => (
            <div className="tx" key={i}>
              <span className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
              <span className="skeleton" style={{ width: 160, height: 18 }} />
              <span className="skeleton" style={{ width: 80, height: 18 }} />
            </div>
          ))}

        {error && (
          <p className="error" role="alert">
            Не удалось загрузить операции: {error.message}. Обновите страницу.
          </p>
        )}

        {data && data.items.length === 0 && (
          <div className="empty">
            <strong>Ничего не найдено</strong>
            <span className="muted">Измените запрос или выберите другую категорию.</span>
            <button className="link-btn" onClick={reset}>Сбросить фильтры</button>
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            <ul className={`tx-list ${isFetching && !isLoading ? 'is-fetching' : ''}`}>
              {data.items.map((t) => (
                <TransactionRow key={t.id} t={t} />
              ))}
            </ul>
            <div className="pager">
              <button className="btn btn-quiet" disabled={page <= 1} onClick={() => goTo(page - 1)}>
                Назад
              </button>
              <span className="muted">Страница {page} из {pages}</span>
              <button className="btn btn-quiet" disabled={page >= pages} onClick={() => goTo(page + 1)}>
                Вперёд
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}