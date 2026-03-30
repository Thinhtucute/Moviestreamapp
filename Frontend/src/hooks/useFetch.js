import { useState, useEffect } from 'react';

const fetchCache = new Map();

function useFetch(url) {
    const cachedData = url ? fetchCache.get(url) : null;
    const [data, setData] = useState(cachedData || null);
    const [loading, setLoading] = useState(!cachedData);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const cached = fetchCache.get(url);
        if (cached) {
            setData(cached);
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, { signal: controller.signal });
                const result = await response.json();
                fetchCache.set(url, result);
                setData(result);
            } catch (err) {
                if (err.name === 'AbortError') {
                    return;
                }
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url]);

    return { data, loading, error };
}

export default useFetch;
