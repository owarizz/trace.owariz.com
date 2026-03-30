import { useCallback, useEffect, useState } from "react";
import type { SearchResult } from "./interface";

export interface HistoryItem {
    id: string;
    timestamp: number;
    title: string;
    coverImage: string | null;
    similarity: number;
    episode: number | string | null;
    anilistId: number;
}

const HISTORY_KEY = "trace_history";
const MAX_HISTORY = 5;

export function useHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to parse history", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addToHistory = useCallback((bestMatch: SearchResult) => {
        setHistory((previousHistory) => {
            const anilistInfo =
                typeof bestMatch.anilist === "object"
                    ? bestMatch.anilist
                    : null;
            const anilistId = anilistInfo
                ? anilistInfo.id
                : (bestMatch.anilist as number);

            const newItem: HistoryItem = {
                id: `${anilistId}-${Date.now()}`,
                timestamp: Date.now(),
                title:
                    anilistInfo?.title?.romaji ||
                    anilistInfo?.title?.native ||
                    "Unknown Anime",
                coverImage: anilistInfo?.coverImage?.medium || bestMatch.image,
                similarity: bestMatch.similarity,
                episode: bestMatch.episode,
                anilistId,
            };

            if (
                previousHistory.length > 0 &&
                previousHistory[0].anilistId === newItem.anilistId &&
                previousHistory[0].episode === newItem.episode
            ) {
                return previousHistory;
            }

            const updatedHistory = [newItem, ...previousHistory].slice(
                0,
                MAX_HISTORY,
            );

            try {
                localStorage.setItem(
                    HISTORY_KEY,
                    JSON.stringify(updatedHistory),
                );
            } catch {
                return previousHistory;
            }

            return updatedHistory;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    }, []);

    return { history, isLoaded, addToHistory, clearHistory };
}
