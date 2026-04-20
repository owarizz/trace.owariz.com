"use client";

import { Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
import { useBookmarkStore } from "../controller/bookmark-store";

const BookmarksPanel = dynamic(
    () => import("./bookmarks-panel").then((mod) => mod.BookmarksPanel),
    {
        ssr: false,
    },
);

const AnimeDetailModal = dynamic(
    () => import("./anime-detail-modal").then((mod) => mod.AnimeDetailModal),
    {
        ssr: false,
    },
);

export function BookmarkBar() {
    const count = useBookmarkStore((state) => state.bookmarks.length);
    const isOpen = useBookmarkStore((state) => state.isOpen);
    const selectedDetail = useBookmarkStore((state) => state.selectedDetail);
    const togglePanel = useBookmarkStore((state) => state.togglePanel);

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

            {isOpen ? <BookmarksPanel /> : null}
            {selectedDetail ? (
                <AnimeDetailModal
                    key={[
                        selectedDetail.source,
                        selectedDetail.anilistId,
                        selectedDetail.savedAt ?? "",
                        selectedDetail.timestamp ?? "",
                        selectedDetail.from,
                    ].join(":")}
                />
            ) : null}
        </>
    );
}
