// Single access point for environment configuration.
// Nothing else in the app should read import.meta.env directly.
const env = import.meta.env;

export const API_BASE_URL = env.VITE_API_BASE_URL || '/api';
export const USE_MOCK = env.VITE_USE_MOCK === 'true';
export const MOCK_LATENCY_MS = Number(env.VITE_MOCK_LATENCY_MS ?? 400);
export const IS_DEV = Boolean(env.DEV);
