import { env } from '@/utils/env';

export const logger = {
    debug: (...args: unknown[]) => {
        if (env.nodeEnv === 'dev') console.warn(...args);
    },
    warn: (...args: unknown[]) => {
        if (env.nodeEnv === 'dev') console.warn(...args);
    },
    error: (...args: unknown[]) => {
        if (env.nodeEnv === 'dev') console.error(...args);
    },
};
