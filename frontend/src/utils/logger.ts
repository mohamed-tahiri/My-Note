import { env } from '@/utils/env';

export const logger = {
  log: (...args: unknown[]) => { if (env.nodeEnv === 'dev') console.log(...args); },
  warn: (...args: unknown[]) => { if (env.nodeEnv === 'dev') console.warn(...args); },
  error: (...args: unknown[]) => { if (env.nodeEnv === 'dev') console.error(...args); },
};