import { useState, useEffect, useCallback } from "react";
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
            const saved = localStorage.getItem(HISTORY_KEY);
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (err) {
            console.error("Failed to parse history", err);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addToHistory = useCallback((bestMatch: SearchResult) => {
        setHistory((prev) => {
            const anilistObj = typeof bestMatch.anilist === "object" ? bestMatch.anilist : null;
            const anilistSafeId = anilistObj ? anilistObj.id : (bestMatch.anilist as number);
            
            const newItem: HistoryItem = {
                id: `${anilistSafeId}-${Date.now()}`,
                timestamp: Date.now(),
                title: anilistObj?.title?.romaji || anilistObj?.title?.native || "Unknown Anime",
                coverImage: anilistObj?.coverImage?.medium || bestMatch.image,
                similarity: bestMatch.similarity,
                episode: bestMatch.episode,
                anilistId: anilistSafeId,
            };

            // Deduplicate consecutive identical episode searches
            if (
                prev.length > 0 &&
                prev[0].anilistId === newItem.anilistId &&
                prev[0].episode === newItem.episode
            ) {
                return prev;
            }

            const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
            try {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    }, []);

    return { history, isLoaded, addToHistory, clearHistory };
}
