import { CATEGORY_LABEL, formatDay, signed } from '../lib/format';
import type { Transaction } from '../lib/types';

export function TransactionRow({ t }: { t: Transaction }) {
  return (
    <li className="tx">
      <span className="tx-avatar" data-cat={t.category} aria-hidden>
        {t.title.charAt(0)}
      </span>
      <div>
        <div className="tx-title">{t.title}</div>
        <div className="tx-sub">{CATEGORY_LABEL[t.category]}</div>
      </div>
      <div className="tx-right">
        <div className={`tx-amount ${t.amount > 0 ? 'in' : ''}`}>{signed(t.amount)}</div>
        <div className="tx-sub">{formatDay(t.date)}</div>
      </div>
    </li>
  );
}