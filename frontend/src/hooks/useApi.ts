import { useState, useCallback } from 'react';

export function useApi<T>(apiCall: (...args: []) => Promise<{ data: T }>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: []) => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiCall(...args);
            setData(res.data);
            return res.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(`An unexpected error occurred: ${error}`);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [apiCall]);

    return { data, loading, error, execute, setData };
}