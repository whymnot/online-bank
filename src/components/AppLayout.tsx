import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

const NAV = [
  { to: '/', label: 'Главная' },
  { to: '/operations', label: 'Операции' },
];

const IDLE_MS = 5 * 60 * 1000;
const WARNING_MS = 30 * 1000;

export function AppLayout() {
  const { session, signOut } = useAuth();
  const { secondsLeft, stay } = useIdleTimeout(IDLE_MS, WARNING_MS, () =>
    signOut('Вы вышли из-за бездействия. Войдите снова.'),
  );

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="mark" aria-hidden />
          Лазурит
        </div>
        <nav aria-label="Основная навигация">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="side-user">
          <div className="side-id">
            <span className="avatar" aria-hidden>{session?.name.charAt(0)}</span>
            {session?.name}
          </div>
          <button className="btn btn-quiet" onClick={() => signOut()}>Выйти</button>
        </div>
      </aside>

      <div className="content">
        <div className="topbar">
          <div className="brand">
            <span className="mark" aria-hidden />
            Лазурит
          </div>
          <button className="btn btn-quiet" onClick={() => signOut()}>Выйти</button>
        </div>
        <main>
          <Outlet />
        </main>
      </div>

      <nav className="tabbar" aria-label="Нижнее меню">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end className="nav-link">
            {item.label}
          </NavLink>
        ))}
      </nav>

      {secondsLeft !== null && (
        <div className="idle-overlay" role="alertdialog" aria-modal="true" aria-labelledby="idle-title">
          <div className="idle-dialog">
            <h2 id="idle-title">Сессия скоро завершится</h2>
            <p className="muted">Вы давно ничего не делали. Выход через {secondsLeft} с.</p>
            <div className="idle-actions">
              <button className="btn" onClick={stay} autoFocus>Остаться</button>
              <button className="btn btn-quiet" onClick={() => signOut()}>Выйти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}