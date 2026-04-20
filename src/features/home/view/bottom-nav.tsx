"use client";

import { Bookmark, Layers3, Search, User, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookmarkStore } from "../controller/bookmark-store";

const BookmarksPanel = dynamic(
    () => import("./bookmarks-panel").then((mod) => mod.BookmarksPanel),
    { ssr: false },
);

const AnimeDetailModal = dynamic(
    () => import("./anime-detail-modal").then((mod) => mod.AnimeDetailModal),
    { ssr: false },
);

const NAV_LINKS = [
    { href: "/", icon: Search, label: "Search" },
    { href: "/anime", icon: Layers3, label: "Atlas" },
    { href: "/updates", icon: Zap, label: "Updates" },
    { href: "/profile", icon: User, label: "Profile" },
] as const;

export function BottomNav() {
    const pathname = usePathname();
    const count = useBookmarkStore((state) => state.bookmarks.length);
    const isOpen = useBookmarkStore((state) => state.isOpen);
    const selectedDetail = useBookmarkStore((state) => state.selectedDetail);
    const togglePanel = useBookmarkStore((state) => state.togglePanel);

    return (
        <>
            <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
                <div className="flex items-center gap-1 rounded-2xl border border-(--border-default) bg-(--bg-elevated)/90 px-2 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">
                    {NAV_LINKS.map(({ href, icon: Icon, label }) => {
                        const isActive =
                            href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                prefetch
                                className={`group relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200 ${
                                    isActive
                                        ? "bg-(--accent-soft) text-(--accent)"
                                        : "text-(--text-faint) hover:bg-(--bg-glass) hover:text-(--text-muted)"
                                }`}
                            >
                                <Icon
                                    className={`size-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}
                                />
                                <span
                                    className={`text-[10px] font-medium leading-none transition-colors ${
                                        isActive
                                            ? "text-(--accent)"
                                            : "text-(--text-faint)"
                                    }`}
                                >
                                    {label}
                                </span>
                                {isActive && (
                                    <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-(--accent) opacity-60" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="mx-1 h-8 w-px bg-(--border-subtle)" />

                    <button
                        type="button"
                        onClick={togglePanel}
                        className={`group relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200 ${
                            isOpen
                                ? "bg-(--accent-soft) text-(--accent)"
                                : "text-(--text-faint) hover:bg-(--bg-glass) hover:text-(--text-muted)"
                        }`}
                        aria-label="Bookmarks"
                    >
                        <div className="relative">
                            <Bookmark
                                className={`size-5 transition-transform duration-200 ${isOpen ? "" : "group-hover:scale-110"}`}
                            />
                            {count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-(--accent) text-[9px] font-bold text-white shadow-sm">
                                    {count > 9 ? "9+" : count}
                                </span>
                            )}
                        </div>
                        <span
                            className={`text-[10px] font-medium leading-none transition-colors ${
                                isOpen ? "text-(--accent)" : "text-(--text-faint)"
                            }`}
                        >
                            Saved
                        </span>
                        {isOpen && (
                            <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-(--accent) opacity-60" />
                        )}
                    </button>
                </div>
            </nav>

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
