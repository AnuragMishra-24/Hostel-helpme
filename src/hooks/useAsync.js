import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function (normally a service call) and tracks its state.
 * Re-runs when `deps` change; `reload` retries manually. Stale responses are ignored.
 */
export function useAsync(asyncFn, deps = []) {
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;
  const requestId = useRef(0);
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  const run = useCallback(async () => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const data = await fnRef.current();
      if (id === requestId.current) setState({ status: 'success', data, error: null });
    } catch (error) {
      if (id === requestId.current) setState({ status: 'error', data: null, error });
    }
  }, []);

  useEffect(() => {
    run();
    return () => {
      requestId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data: state.data, error: state.error, loading: state.status === 'loading', reload: run };
}
