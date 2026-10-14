import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { session, signIn, notice } = useAuth();
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api<{ token: string; name: string }>('/api/login', {
        method: 'POST',
        body: { login, password },
      });
      signIn(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <section className="login-hero">
        <div className="brand">
          <span className="mark" aria-hidden />
          Лазурит
        </div>
        <div>
          <h2 className="hero-title">Ваши счета и переводы в одном месте</h2>
          <p className="hero-text">Войдите, чтобы увидеть баланс и последние операции.</p>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-form" onSubmit={submit}>
          <div>
            <h1>Вход</h1>
            <p className="muted">Это демо-версия, настоящих данных здесь нет.</p>
          </div>
          {notice && <p className="notice" role="status">{notice}</p>}
          <label>
            Логин
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={loading || !login || !password}>
            {loading ? 'Входим…' : 'Войти'}
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setLogin('demo');
              setPassword('demo123');
            }}
          >
            Заполнить демо-данными
          </button>
        </form>
      </section>
    </div>
  );
}