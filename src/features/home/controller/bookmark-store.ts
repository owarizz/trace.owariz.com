import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchResult } from "./interface";

export interface BookmarkItem {
    id: string;
    anilistId: number;
    title: string;
    nativeTitle: string | null;
    episode: number | null;
    similarity: number;
    from: number;
    to: number;
    image: string;
    video: string;
    savedAt: number;
}

interface BookmarkStore {
    bookmarks: BookmarkItem[];
    isOpen: boolean;
    openDetailId: number | null;
    addBookmark: (result: SearchResult) => void;
    removeBookmark: (id: string) => void;
    isBookmarked: (id: string) => boolean;
    clearBookmarks: () => void;
    togglePanel: () => void;
    closePanel: () => void;
    openDetail: (anilistId: number) => void;
    closeDetail: () => void;
}

export function makeBookmarkId(result: SearchResult): string {
    const anilistId =
        typeof result.anilist === "object" ? result.anilist.id : result.anilist;
    return `bm-${anilistId}-${result.episode ?? 0}-${Math.floor(result.from)}`;
}

export const useBookmarkStore = create<BookmarkStore>()(
    persist(
        (set, get) => ({
            bookmarks: [],
            isOpen: false,
            openDetailId: null,

            addBookmark: (result) => {
                const id = makeBookmarkId(result);
                if (get().bookmarks.some((b) => b.id === id)) return;
                const anilistInfo =
                    typeof result.anilist === "object" ? result.anilist : null;
                const anilistId = anilistInfo?.id ?? (result.anilist as number);
                const item: BookmarkItem = {
                    id,
                    anilistId,
                    title:
                        anilistInfo?.title?.english ??
                        anilistInfo?.title?.romaji ??
                        anilistInfo?.title?.native ??
                        `AniList #${anilistId}`,
                    nativeTitle: anilistInfo?.title?.native ?? null,
                    episode: result.episode,
                    similarity: result.similarity,
                    from: result.from,
                    to: result.to,
                    image: result.image,
                    video: result.video,
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
                set((state) => ({ isOpen: !state.isOpen, openDetailId: null })),

            closePanel: () => set({ isOpen: false }),

            openDetail: (anilistId) =>
                set({ openDetailId: anilistId, isOpen: false }),

            closeDetail: () => set({ openDetailId: null }),
        }),
        {
            name: "trace_bookmarks",
            partialize: (state) => ({ bookmarks: state.bookmarks }),
        },
    ),
);
