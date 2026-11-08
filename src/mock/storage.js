// Tiny persisted collection used by the mock modules, so data created in the UI
// (complaints, room requests) survives a refresh. Falls back to memory if storage is blocked.
export function createCollection(key, seed) {
  let memory = null;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  return {
    read() {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        /* use defaults */
      }
      return memory ?? clone(seed);
    },
    write(items) {
      memory = items;
      try {
        window.localStorage.setItem(key, JSON.stringify(items));
      } catch {
        /* storage full or unavailable — memory only */
      }
    },
  };
}
