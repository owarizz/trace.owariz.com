import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "@/common/config/site";
import {
    isAbortError,
    requestJson,
    uploadFormDataJson,
} from "@/common/lib/http/browser";
import { useHistory } from "./history-hook";
import type { SearchResponse } from "./interface";

export interface SearchOptions {
    cutBorders?: boolean;
    anilistInfo?: boolean;
}

interface SearchState {
    data: SearchResponse | null;
    error: string | null;
    loading: boolean;
    uploadProgress: number | null;
}

const IDLE_SEARCH_STATE: SearchState = {
    data: null,
    error: null,
    loading: false,
    uploadProgress: null,
};

function buildSearchParams(options: SearchOptions) {
    const params = new URLSearchParams();

    if (options.cutBorders) {
        params.append("cutBorders", "");
    }

    if (options.anilistInfo !== false) {
        params.append("anilistInfo", "");
    }

    return params;
}

function getSearchErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Failed to search. Please try again.";
}

export function useSearch() {
    const [state, setState] = useState<SearchState>(IDLE_SEARCH_STATE);
    const abortRef = useRef<AbortController | null>(null);
    const {
        history,
        isLoaded: historyLoaded,
        addToHistory,
        clearHistory,
    } = useHistory();

    const reset = useCallback(() => {
        abortRef.current?.abort();
        setState(IDLE_SEARCH_STATE);
    }, []);

    const commitSearchResponse = useCallback(
        (responseData: SearchResponse) => {
            if (responseData.error) {
                setState({
                    data: null,
                    error: responseData.error,
                    loading: false,
                    uploadProgress: null,
                });
                return;
            }

            const [bestMatch] = responseData.result;
            if (bestMatch) {
                addToHistory(bestMatch);
            }

            setState({
                data: responseData,
                error: null,
                loading: false,
                uploadProgress: null,
            });
        },
        [addToHistory],
    );

    const searchByFile = useCallback(
        async (file: File, options: SearchOptions = {}) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setState({
                data: null,
                error: null,
                loading: true,
                uploadProgress: 0,
            });

            try {
                const formData = new FormData();
                formData.append("image", file);

                const params = buildSearchParams(options);
                const response = await uploadFormDataJson<SearchResponse>(
                    `${APP_CONFIG.traceApiBaseUrl}/search?${params.toString()}`,
                    formData,
                    {
                        signal: controller.signal,
                        onUploadProgress: (percentCompleted) => {
                            setState((previousState) => ({
                                ...previousState,
                                uploadProgress: percentCompleted,
                            }));
                        },
                    },
                );

                if (abortRef.current === controller) {
                    commitSearchResponse(response);
                }
            } catch (error) {
                if (!isAbortError(error) && abortRef.current === controller) {
                    setState({
                        data: null,
                        error: getSearchErrorMessage(error),
                        loading: false,
                        uploadProgress: null,
                    });
                }
            }
        },
        [commitSearchResponse],
    );

    const searchByUrl = useCallback(
        async (imageUrl: string, options: SearchOptions = {}) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setState({
                data: null,
                error: null,
                loading: true,
                uploadProgress: null,
            });

            try {
                const params = buildSearchParams(options);
                params.append("url", imageUrl);

                const response = await requestJson<SearchResponse>(
                    `${APP_CONFIG.traceApiBaseUrl}/search?${params.toString()}`,
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    },
                );

                if (abortRef.current === controller) {
                    commitSearchResponse(response);
                }
            } catch (error) {
                if (!isAbortError(error) && abortRef.current === controller) {
                    setState({
                        data: null,
                        error: getSearchErrorMessage(error),
                        loading: false,
                        uploadProgress: null,
                    });
                }
            }
        },
        [commitSearchResponse],
    );

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
        };
    }, []);

    return {
        ...state,
        searchByFile,
        searchByUrl,
        reset,
        history,
        historyLoaded,
        clearHistory,
    };
}
