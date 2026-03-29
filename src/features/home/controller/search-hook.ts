import axios from "axios";
import { useCallback, useRef, useState } from "react";
import type { SearchResponse } from "./interface";

export interface SearchOptions {
    cutBorders?: boolean;
    anilistInfo?: boolean;
}

interface SearchState {
    data: SearchResponse | null;
    error: string | null;
    loading: boolean;
    uploadProgress: number | null; // 0 to 100
}

export function useSearch() {
    const [state, setState] = useState<SearchState>({
        data: null,
        error: null,
        loading: false,
        uploadProgress: null,
    });
    const abortRef = useRef<AbortController | null>(null);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        setState({ data: null, error: null, loading: false, uploadProgress: null });
    }, []);

    const buildParams = (opts: SearchOptions) => {
        const params = new URLSearchParams();
        if (opts.cutBorders) params.append("cutBorders", "");
        if (opts.anilistInfo !== false) params.append("anilistInfo", "");
        return params;
    };

    const searchByFile = useCallback(
        async (file: File, opts: SearchOptions = {}) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setState({ data: null, error: null, loading: true, uploadProgress: 0 });

            try {
                const formData = new FormData();
                formData.append("image", file);

                const params = buildParams(opts);
                const url = `https://api.trace.moe/search?${params.toString()}`;

                const response = await axios.post<SearchResponse>(
                    url,
                    formData,
                    {
                        signal: controller.signal,
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                const percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total
                                );
                                setState((prev) => ({ ...prev, uploadProgress: percentCompleted }));
                            }
                        },
                    },
                );

                if (response.data.error) {
                    setState({
                        data: null,
                        error: response.data.error,
                        loading: false,
                        uploadProgress: null,
                    });
                    return;
                }

                setState({ data: response.data, error: null, loading: false, uploadProgress: null });
            } catch (err) {
                if (!axios.isCancel(err)) {
                    const msg =
                        axios.isAxiosError(err) && err.response?.data?.error
                            ? err.response.data.error
                            : "Failed to search. Please try again.";
                    setState({ data: null, error: msg, loading: false, uploadProgress: null });
                }
            }
        },
        [],
    );

    const searchByUrl = useCallback(
        async (imageUrl: string, opts: SearchOptions = {}) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setState({ data: null, error: null, loading: true, uploadProgress: null });

            try {
                const params = buildParams(opts);
                params.append("url", imageUrl);
                const url = `https://api.trace.moe/search?${params.toString()}`;

                const response = await axios.get<SearchResponse>(url, {
                    signal: controller.signal,
                });

                if (response.data.error) {
                    setState({
                        data: null,
                        error: response.data.error,
                        loading: false,
                        uploadProgress: null,
                    });
                    return;
                }

                setState({ data: response.data, error: null, loading: false, uploadProgress: null });
            } catch (err) {
                if (!axios.isCancel(err)) {
                    const msg =
                        axios.isAxiosError(err) && err.response?.data?.error
                            ? err.response.data.error
                            : "Failed to search. Please try again.";
                    setState({ data: null, error: msg, loading: false, uploadProgress: null });
                }
            }
        },
        [],
    );

    return {
        ...state,
        searchByFile,
        searchByUrl,
        reset,
    };
}
