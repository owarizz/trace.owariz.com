"use client";

import {
    Bookmark,
    BookmarkCheck,
    Check,
    Clock,
    Copy,
    Info,
    Play,
    Volume2,
    VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
    createDetailStateFromSearch,
    formatSceneTime,
    getAnimeId,
    getAnimeInfo,
    getAnimeTitle,
} from "../../controller/anime-scene";
import {
    makeBookmarkId,
    useBookmarkStore,
} from "../../controller/bookmark-store";
import type { SearchResult } from "../../controller/interface";

function similarityConfig(similarity: number) {
    if (similarity >= 0.95)
        return {
            label: "Excellent",
            color: "text-emerald-400",
            bg: "bg-emerald-400/12 border-emerald-400/25",
            bar: "from-emerald-500 to-emerald-400",
        };
    if (similarity >= 0.9)
        return {
            label: "Great",
            color: "text-emerald-400",
            bg: "bg-emerald-400/10 border-emerald-400/20",
            bar: "from-emerald-500 to-teal-400",
        };
    if (similarity >= 0.8)
        return {
            label: "Good",
            color: "text-amber-400",
            bg: "bg-amber-400/10 border-amber-400/20",
            bar: "from-amber-500 to-amber-400",
        };
    return {
        label: "Low",
        color: "text-rose-400",
        bg: "bg-rose-400/10 border-rose-400/20",
        bar: "from-rose-500 to-rose-400",
    };
}

interface ResultCardProps {
    result: SearchResult;
    index: number;
    isBestMatch?: boolean;
}

export function ResultCard({
    result,
    index,
    isBestMatch = false,
}: ResultCardProps) {
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const animeInfo = getAnimeInfo(result.anilist);
    const title = getAnimeTitle(animeInfo, getAnimeId(result.anilist));
    const similarityPercent = Math.round(result.similarity * 100);
    const sim = similarityConfig(result.similarity);
    const nativeTitle = animeInfo?.title.native ?? null;

    const bookmarkId = makeBookmarkId(result);
    const addBookmark = useBookmarkStore((state) => state.addBookmark);
    const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
    const openDetail = useBookmarkStore((state) => state.openDetail);
    const bookmarked = useBookmarkStore((state) =>
        state.bookmarks.some((item) => item.id === bookmarkId),
    );

    const handleBookmark = () => {
        if (bookmarked) {
            removeBookmark(bookmarkId);
        } else {
            addBookmark(result);
            toast.success("Scene bookmarked!");
        }
    };

    const handleCopy = async () => {
        const shareText = [
            `Found: ${title}${result.episode ? ` [Ep. ${result.episode}]` : ""}`,
            `Confidence: ${(result.similarity * 100).toFixed(1)}%`,
            `Scene: ${formatSceneTime(result.from)} – ${formatSceneTime(result.to)}`,
            result.filename ? `Source: ${result.filename}` : null,
        ]
            .filter(Boolean)
            .join("\n");

        try {
            await navigator.clipboard.writeText(shareText);
            setIsCopied(true);
            toast.success("Copied to clipboard.");
            window.setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error("Could not copy.");
        }
    };

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border bg-(--bg-glass) transition-all duration-300 animate-fade-in-up ${
                isBestMatch
                    ? "border-(--accent)/35 shadow-[0_0_48px_-12px_rgba(129,140,248,0.3)] hover:shadow-[0_0_64px_-12px_rgba(129,140,248,0.4)]"
                    : "border-(--border-subtle) hover:border-(--border-default) hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
            }`}
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            {/* Best match gradient top line */}
            {isBestMatch && (
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--accent) to-transparent" />
            )}

            {/* Best match label */}
            {isBestMatch && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-(--accent)/30 bg-(--accent-soft) px-2.5 py-1 text-[10px] font-semibold text-(--accent) backdrop-blur-sm">
                    ✦ Best Match
                </div>
            )}

            <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative h-44 shrink-0 overflow-hidden rounded-t-2xl bg-(--bg-elevated) sm:h-auto sm:w-52 sm:rounded-t-none sm:rounded-l-2xl">
                    {showVideo ? (
                        <>
                            <video
                                src={`${result.video}?size=l${isMuted ? "&mute" : ""}`}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                className="h-full w-full object-cover"
                                onError={() => setShowVideo(false)}
                            />
                            <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setIsMuted((m) => !m)}
                                    className="flex size-7 items-center justify-center rounded-lg bg-black/60 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? (
                                        <VolumeX className="size-3.5" />
                                    ) : (
                                        <Volume2 className="size-3.5" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowVideo(false)}
                                    className="flex items-center justify-center rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm transition-colors hover:text-white"
                                >
                                    Image
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Image
                                src={`${result.image}?size=l`}
                                alt={title}
                                referrerPolicy="no-referrer"
                                fill
                                sizes="(max-width: 640px) 100vw, 208px"
                                loading={index < 3 ? "eager" : "lazy"}
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Play overlay */}
                            <button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 transition-all duration-200 group-hover:opacity-100"
                                aria-label="Play preview"
                            >
                                <div className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                                    <Play className="ml-0.5 size-5 text-white" />
                                </div>
                            </button>
                        </>
                    )}

                    {/* Similarity badge */}
                    <div
                        className={`absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums backdrop-blur-md ${sim.bg} ${sim.color}`}
                    >
                        {similarityPercent}%
                    </div>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col justify-between px-5 py-4">
                    <div className="space-y-2">
                        <div>
                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-(--text-primary)">
                                {title}
                            </h3>
                            {nativeTitle && (
                                <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                                    {nativeTitle}
                                </p>
                            )}
                        </div>

                        {/* Similarity bar */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-semibold ${sim.color}`}>
                                    {sim.label} match
                                </span>
                                <span className={`font-mono text-[10px] tabular-nums ${sim.color}`}>
                                    {(result.similarity * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-(--bg-elevated)">
                                <div
                                    className={`h-full rounded-full bg-linear-to-r ${sim.bar} transition-all duration-700 ease-out`}
                                    style={{ width: `${similarityPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {result.episode !== null && (
                                <span className="rounded-md border border-(--border-subtle) bg-(--bg-elevated) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                                    EP {result.episode}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-(--text-muted)">
                                <Clock className="size-3" />
                                {formatSceneTime(result.from)}
                                {" – "}
                                {formatSceneTime(result.to)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {!showVideo && (
                            <button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary) active:scale-95"
                            >
                                <Play className="size-3" />
                                Preview
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() =>
                                openDetail(createDetailStateFromSearch(result))
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary) active:scale-95"
                        >
                            <Info className="size-3" />
                            Details
                        </button>

                        <div className="ml-auto flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary) active:scale-95"
                            >
                                {isCopied ? (
                                    <Check className="size-3 text-emerald-400" />
                                ) : (
                                    <Copy className="size-3" />
                                )}
                                {isCopied ? "Copied" : "Share"}
                            </button>
                            <button
                                type="button"
                                onClick={handleBookmark}
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                                    bookmarked
                                        ? "border-(--accent)/30 bg-(--accent-muted) text-(--accent)"
                                        : "border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) hover:border-(--border-default) hover:text-(--text-secondary)"
                                }`}
                            >
                                {bookmarked ? (
                                    <BookmarkCheck className="size-3" />
                                ) : (
                                    <Bookmark className="size-3" />
                                )}
                                {bookmarked ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
