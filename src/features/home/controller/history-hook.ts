import { useCallback, useEffect, useState } from "react";
import {
    type AnimeSceneSnapshot,
    createSceneSnapshot,
    getAnimeCoverImage,
} from "./anime-scene";
import type { SearchResult } from "./interface";

export interface HistoryItem extends AnimeSceneSnapshot {
    id: string;
    timestamp: number;
    coverImage: string | null;
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
            const snapshot = createSceneSnapshot(bestMatch);

            const newItem: HistoryItem = {
                id: `${snapshot.anilistId}-${Date.now()}`,
                timestamp: Date.now(),
                coverImage:
                    getAnimeCoverImage(snapshot.animeInfo) ?? snapshot.image,
                ...snapshot,
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
