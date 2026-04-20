"use client";

import { Bookmark } from "lucide-react";
import { useBookmarkStore } from "../controller/bookmark-store";
import { AnimeDetailModal } from "./anime-detail-modal";
import { BookmarksPanel } from "./bookmarks-panel";

export function BookmarkBar() {
    const { bookmarks, togglePanel } = useBookmarkStore();
    const count = bookmarks.length;

    return (
        <>
            <button
                type="button"
                onClick={togglePanel}
                className="relative inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                aria-label="Open bookmarks"
            >
                <Bookmark className="size-3" />
                Saved
                {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-(--accent) text-[9px] font-bold text-white">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </button>

            <BookmarksPanel />
            <AnimeDetailModal />
        </>
    );
}
