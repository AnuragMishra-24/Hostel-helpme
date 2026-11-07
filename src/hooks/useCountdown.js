import { useEffect, useState } from 'react';

/** Counts down once per second from `initialSeconds`. `restart(n)` begins a new countdown. */
export function useCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  return { seconds, restart: setSeconds };
}
