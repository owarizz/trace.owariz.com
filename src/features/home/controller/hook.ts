import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MeResponse } from "./interface";

export function useMe() {
    const [data, setData] = useState<MeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get("https://api.trace.moe/me", {
                signal: controller.signal,
            });
            setData(response.data);
            return response.data;
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch user data.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [fetchData]);

    return { data, error, loading, refetch: fetchData };
}
