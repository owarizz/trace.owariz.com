"use client";

import {
    Bookmark,
    BookmarkCheck,
    Check,
    Clock,
    Copy,
    Info,
    Percent,
    Play,
    Star,
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

function getSimilarityColor(similarity: number) {
    if (similarity >= 0.9) {
        return "text-emerald-400";
    }

    if (similarity >= 0.8) {
        return "text-amber-400";
    }

    return "text-red-400";
}

function getSimilarityBg(similarity: number) {
    if (similarity >= 0.9) {
        return "bg-emerald-400/10";
    }

    if (similarity >= 0.8) {
        return "bg-amber-400/10";
    }

    return "bg-red-400/10";
}

function getSimilarityLabel(similarity: number) {
    if (similarity >= 0.95) {
        return "Excellent match";
    }

    if (similarity >= 0.9) {
        return "Great match";
    }

    if (similarity >= 0.8) {
        return "Good match";
    }

    return "Low confidence";
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
            `Scene: ${formatSceneTime(result.from)} - ${formatSceneTime(result.to)}`,
            result.filename ? `Source: ${result.filename}` : null,
        ].join("\n");

        try {
            await navigator.clipboard.writeText(shareText);
            setIsCopied(true);
            toast.success("Result copied to clipboard.");
            window.setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error("Could not copy the result.");
        }
    };

    const nativeTitle = animeInfo?.title.native ?? null;

    return (
        <div
            className={`glass-card noise group relative overflow-hidden animate-fade-in-up ${
                isBestMatch ? "ring-1 ring-(--accent)/30" : ""
            }`}
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            {isBestMatch && (
                <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-lg bg-(--accent) px-2.5 py-1">
                    <Star className="size-3 fill-white text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        Best Match
                    </span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row">
                <div className="relative h-40 shrink-0 overflow-hidden bg-(--bg-elevated) sm:h-48 sm:w-52">
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
                                    onClick={() =>
                                        setIsMuted((muted) => !muted)
                                    }
                                    className="flex size-7 items-center justify-center rounded-md bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
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
                                    className="flex items-center justify-center rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm transition-colors hover:text-white"
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
                            <button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                aria-label="Play preview"
                            >
                                <div className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-sm transition-transform group-hover:scale-110">
                                    <Play className="ml-0.5 size-4.5 text-white" />
                                </div>
                            </button>
                        </>
                    )}

                    <div
                        className={`absolute top-2 left-2 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold tabular-nums backdrop-blur-md ${getSimilarityBg(result.similarity)} ${getSimilarityColor(result.similarity)}`}
                    >
                        <Percent className="size-2.5" />
                        {similarityPercent}
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between px-5 py-4">
                    <div>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-(--text-primary)">
                            {title}
                        </h3>

                        {nativeTitle && (
                            <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                                {nativeTitle}
                            </p>
                        )}

                        <p
                            className={`mt-1.5 text-[10px] font-medium ${getSimilarityColor(result.similarity)}`}
                        >
                            {getSimilarityLabel(result.similarity)}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            {result.episode !== null && (
                                <span className="inline-flex items-center rounded-md bg-(--bg-elevated) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                                    EP {result.episode}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-(--text-muted)">
                                <Clock className="size-3" />
                                {formatSceneTime(result.from)} -{" "}
                                {formatSceneTime(result.to)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {!showVideo && (
                            <button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                        >
                            <Info className="size-3" />
                            Details
                        </button>
                        <div className="ml-auto flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleBookmark}
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                                    bookmarked
                                        ? "border-(--accent)/30 bg-(--accent-muted) text-(--accent) hover:bg-(--accent-muted)"
                                        : "border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary)"
                                }`}
                                aria-label={
                                    bookmarked
                                        ? "Remove bookmark"
                                        : "Bookmark scene"
                                }
                            >
                                {bookmarked ? (
                                    <BookmarkCheck className="size-3" />
                                ) : (
                                    <Bookmark className="size-3" />
                                )}
                                {bookmarked ? "Saved" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                            >
                                {isCopied ? (
                                    <Check className="size-3 text-emerald-500" />
                                ) : (
                                    <Copy className="size-3" />
                                )}
                                {isCopied ? "Copied" : "Share"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
