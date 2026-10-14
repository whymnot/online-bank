import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setUnauthorizedHandler } from '../lib/api';

type Session = { token: string; name: string };
type AuthValue = {
  session: Session | null;
  notice: string;
  signIn: (s: Session) => void;
  signOut: (reason?: string) => void;
};

const AuthContext = createContext<AuthValue | null>(null);
const KEY = 'bank-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState('');
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  });

  const signIn = (s: Session) => {
    sessionStorage.setItem(KEY, JSON.stringify(s));
    setNotice('');
    setSession(s);
  };

  const signOut = useCallback(
    (reason = '') => {
      sessionStorage.removeItem(KEY);
      queryClient.clear(); // чтобы следующий пользователь не увидел чужие данные
      setNotice(reason);
      setSession(null);
    },
    [queryClient],
  );

  useEffect(() => {
    setUnauthorizedHandler(() => signOut('Сессия истекла. Войдите снова.'));
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ session, notice, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нужно вызывать внутри AuthProvider');
  return ctx;
}