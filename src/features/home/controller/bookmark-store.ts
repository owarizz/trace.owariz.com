import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    type AnimeDetailState,
    type AnimeSceneSnapshot,
    createSceneSnapshot,
    getAnimeId,
    normalizeAnimeSceneSnapshot,
    parseFiniteNumber,
} from "./anime-scene";
import type { SearchResult } from "./interface";

export interface BookmarkItem extends AnimeSceneSnapshot {
    id: string;
    savedAt: number;
}

interface BookmarkStore {
    bookmarks: BookmarkItem[];
    isOpen: boolean;
    selectedDetail: AnimeDetailState | null;
    addBookmark: (result: SearchResult) => void;
    removeBookmark: (id: string) => void;
    isBookmarked: (id: string) => boolean;
    clearBookmarks: () => void;
    togglePanel: () => void;
    closePanel: () => void;
    openDetail: (detail: AnimeDetailState) => void;
    closeDetail: () => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeBookmarkItem(value: unknown): BookmarkItem | null {
    if (!isRecord(value)) {
        return null;
    }

    const snapshot = normalizeAnimeSceneSnapshot(value);

    if (!snapshot) {
        return null;
    }

    const savedAt = parseFiniteNumber(value.savedAt) ?? Date.now();
    const id =
        typeof value.id === "string" && value.id.trim().length > 0
            ? value.id
            : `bm-${snapshot.anilistId}-${snapshot.episode ?? 0}-${Math.floor(snapshot.from ?? 0)}`;

    return {
        id,
        savedAt,
        ...snapshot,
    };
}

function normalizeBookmarks(value: unknown): BookmarkItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(Boolean)
        .map(normalizeBookmarkItem)
        .filter((item): item is BookmarkItem => item !== null);
}

export function makeBookmarkId(result: SearchResult): string {
    const anilistId = getAnimeId(result.anilist);
    return `bm-${anilistId}-${result.episode ?? 0}-${Math.floor(result.from)}`;
}

export const useBookmarkStore = create<BookmarkStore>()(
    persist(
        (set, get) => ({
            bookmarks: [],
            isOpen: false,
            selectedDetail: null,

            addBookmark: (result) => {
                const id = makeBookmarkId(result);
                if (get().bookmarks.some((b) => b.id === id)) return;
                const item: BookmarkItem = {
                    id,
                    ...createSceneSnapshot(result),
                    savedAt: Date.now(),
                };
                set((state) => ({
                    bookmarks: [item, ...state.bookmarks].slice(0, 50),
                }));
            },

            removeBookmark: (id) =>
                set((state) => ({
                    bookmarks: state.bookmarks.filter((b) => b.id !== id),
                })),

            isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),

            clearBookmarks: () => set({ bookmarks: [] }),

            togglePanel: () =>
                set((state) => ({
                    isOpen: !state.isOpen,
                    selectedDetail: null,
                })),

            closePanel: () => set({ isOpen: false }),

            openDetail: (detail) =>
                set({ selectedDetail: detail, isOpen: false }),

            closeDetail: () => set({ selectedDetail: null }),
        }),
        {
            name: "trace_bookmarks",
            partialize: (state) => ({ bookmarks: state.bookmarks }),
            merge: (persistedState, currentState) => {
                const state = isRecord(persistedState)
                    ? (persistedState as Partial<BookmarkStore>)
                    : {};

                return {
                    ...currentState,
                    ...state,
                    bookmarks: normalizeBookmarks(state.bookmarks),
                };
            },
        },
    ),
);
