import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "@/common/config";
import type { MeResponse } from "./interface";

export function useMe() {
    const [data, setData] = useState<MeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<MeResponse>(
                `${APP_CONFIG.traceApiBaseUrl}/me`,
                {
                    signal: controller.signal,
                },
            );

            if (abortControllerRef.current !== controller) {
                return null;
            }

            setData(response.data);
            return response.data;
        } catch (error) {
            if (
                !axios.isCancel(error) &&
                abortControllerRef.current === controller
            ) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch user data.");
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setLoading(false);
            }
        }

        return null;
    }, []);

    useEffect(() => {
        fetchData();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [fetchData]);

    return { data, error, loading, refetch: fetchData };
}
