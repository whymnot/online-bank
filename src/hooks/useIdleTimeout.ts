import { useCallback, useEffect, useRef, useState } from 'react';

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const;

export function useIdleTimeout(timeoutMs: number, warningMs: number, onTimeout: () => void) {
  const lastActivity = useRef(Date.now());
  const onTimeoutRef = useRef(onTimeout);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    // пока показано предупреждение, движение мыши его не скрывает: нужен явный клик «Остаться»
    const onActivity = () => {
      if (Date.now() - lastActivity.current < timeoutMs - warningMs) {
        lastActivity.current = Date.now();
      }
    };
    EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const id = window.setInterval(() => {
      const idle = Date.now() - lastActivity.current;
      if (idle >= timeoutMs) {
        onTimeoutRef.current();
        return;
      }
      setSecondsLeft(idle >= timeoutMs - warningMs ? Math.ceil((timeoutMs - idle) / 1000) : null);
    }, 1000);

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(id);
    };
  }, [timeoutMs, warningMs]);

  const stay = useCallback(() => {
    lastActivity.current = Date.now();
    setSecondsLeft(null);
  }, []);

  return { secondsLeft, stay };
}