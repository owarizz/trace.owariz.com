"use client";

import { Bookmark, Clock, Info, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { AnimeDetailState } from "../controller/anime-scene";
import {
    type BookmarkItem,
    useBookmarkStore,
} from "../controller/bookmark-store";

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function getSimilarityStyle(sim: number) {
    if (sim >= 0.9)
        return {
            text: "text-emerald-400",
            bg: "bg-emerald-400/10",
        };
    if (sim >= 0.8)
        return {
            text: "text-amber-400",
            bg: "bg-amber-400/10",
        };
    return { text: "text-red-400", bg: "bg-red-400/10" };
}

interface BookmarkCardProps {
    item: BookmarkItem;
    onOpenDetail: (detail: AnimeDetailState) => void;
    onRemoveBookmark: (id: string) => void;
}

function BookmarkCard({
    item,
    onOpenDetail,
    onRemoveBookmark,
}: BookmarkCardProps) {
    const { text, bg } = getSimilarityStyle(item.similarity);

    return (
        <div className="glass-card noise group relative flex gap-3 overflow-hidden p-3">
            <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg border border-(--border-subtle) bg-(--bg-elevated)">
                <Image
                    src={`${item.image}?size=s`}
                    alt={item.title}
                    fill
                    sizes="44px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                />
                <div
                    className={`absolute top-1 left-1 rounded px-1 py-0.5 text-[9px] font-bold tabular-nums backdrop-blur-md ${bg} ${text}`}
                >
                    {Math.round(item.similarity * 100)}%
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                    <p className="truncate text-xs font-medium text-(--text-primary)">
                        {item.title}
                    </p>
                    {item.nativeTitle && (
                        <p className="truncate text-[10px] text-(--text-faint)">
                            {item.nativeTitle}
                        </p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                        {item.episode !== null && (
                            <span className="text-[10px] font-medium text-(--text-secondary)">
                                EP {item.episode}
                            </span>
                        )}
                        <span className="flex items-center gap-0.5 text-[10px] text-(--text-faint)">
                            <Clock className="size-2.5" />
                            {formatTime(item.from)}
                        </span>
                    </div>
                </div>

                <div className="mt-1.5 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() =>
                            onOpenDetail({
                                source: "bookmark",
                                ...item,
                            })
                        }
                        className="flex items-center gap-1 rounded-md border border-(--border-subtle) bg-(--bg-glass) px-1.5 py-0.5 text-[10px] text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary) active:scale-95"
                    >
                        <Info className="size-2.5" />
                        Details
                    </button>
                    <button
                        type="button"
                        onClick={() => onRemoveBookmark(item.id)}
                        className="ml-auto flex size-5 items-center justify-center rounded text-(--text-faint) transition-all hover:text-(--error)"
                        aria-label="Remove bookmark"
                    >
                        <Trash2 className="size-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function BookmarksPanel() {
    const bookmarks = useBookmarkStore((state) => state.bookmarks);
    const isOpen = useBookmarkStore((state) => state.isOpen);
    const togglePanel = useBookmarkStore((state) => state.togglePanel);
    const clearBookmarks = useBookmarkStore((state) => state.clearBookmarks);
    const openDetail = useBookmarkStore((state) => state.openDetail);
    const removeBookmark = useBookmarkStore((state) => state.removeBookmark);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") togglePanel();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, togglePanel]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-40 flex justify-end">
            <button
                type="button"
                aria-label="Close bookmarks"
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={togglePanel}
            />

            <div className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-(--border-default) bg-(--bg-secondary) shadow-2xl">
                <div className="flex items-center justify-between border-b border-(--border-subtle) px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Bookmark className="size-4 text-(--accent)" />
                        <span className="text-sm font-semibold text-(--text-primary)">
                            Bookmarks
                        </span>
                        {bookmarks.length > 0 && (
                            <span className="rounded-full bg-(--accent-muted) px-2 py-0.5 text-[11px] font-medium text-(--accent)">
                                {bookmarks.length}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {bookmarks.length > 0 && (
                            <button
                                type="button"
                                onClick={clearBookmarks}
                                className="flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-2.5 py-1.5 text-[11px] text-(--text-muted) transition-all hover:border-red-500/30 hover:text-red-400 active:scale-95"
                            >
                                <Trash2 className="size-3" />
                                Clear all
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={togglePanel}
                            className="flex size-8 items-center justify-center rounded-lg border border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-primary) active:scale-95"
                            aria-label="Close bookmarks"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                    {bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                            <div className="flex size-14 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-elevated)">
                                <Bookmark className="size-6 text-(--text-faint)" />
                            </div>
                            <p className="text-sm font-medium text-(--text-secondary)">
                                No bookmarks yet
                            </p>
                            <p className="max-w-[200px] text-xs leading-relaxed text-(--text-faint)">
                                Save scenes from search results to find them
                                here
                            </p>
                            <kbd className="mt-1 rounded border border-(--border-default) bg-(--bg-elevated) px-2 py-0.5 text-[10px] font-mono text-(--text-faint)">
                                B
                            </kbd>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {bookmarks.map((item) => (
                                <BookmarkCard
                                    key={item.id}
                                    item={item}
                                    onOpenDetail={openDetail}
                                    onRemoveBookmark={removeBookmark}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {bookmarks.length > 0 && (
                    <div className="border-t border-(--border-subtle) px-5 py-3 text-center">
                        <p className="text-[10px] text-(--text-faint)">
                            Press{" "}
                            <kbd className="rounded border border-(--border-default) bg-(--bg-elevated) px-1 py-0.5 text-[9px] font-mono">
                                B
                            </kbd>{" "}
                            to toggle - {bookmarks.length}/50 saved
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}
