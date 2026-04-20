"use client";

import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    Bookmark,
    Clock,
    Film,
    ImageIcon,
    Percent,
    Play,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatSceneTime, getAnimeCoverImage } from "../controller/anime-scene";
import { useBookmarkStore } from "../controller/bookmark-store";

const SOURCE_LABELS = {
    search: "Search result",
    bookmark: "Saved bookmark",
    history: "Recent search",
} as const;

function formatRelativeTime(value?: number | null) {
    if (!value) return null;
    return formatDistanceToNow(value, { addSuffix: true });
}

function formatOptionalSceneTime(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "-";
    }

    return formatSceneTime(value);
}

function unique(values: Array<string | null | undefined>) {
    return values.filter((value, index, array): value is string => {
        if (!value) return false;
        return array.indexOf(value) === index;
    });
}

export function AnimeDetailModal() {
    const selectedDetail = useBookmarkStore((state) => state.selectedDetail);
    const closeDetail = useBookmarkStore((state) => state.closeDetail);
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (!selectedDetail) return;

        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeDetail();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedDetail, closeDetail]);

    if (!selectedDetail) return null;

    const animeInfo = selectedDetail.animeInfo ?? null;
    const coverImage = getAnimeCoverImage(animeInfo) ?? selectedDetail.image;
    const extraTitles = unique([
        animeInfo?.title.romaji,
        animeInfo?.title.english,
        animeInfo?.title.native,
        selectedDetail.nativeTitle,
    ]).filter((value) => value !== selectedDetail.title);
    const synonyms = unique(animeInfo?.synonyms ?? []).filter(
        (value) =>
            !extraTitles.includes(value) && value !== selectedDetail.title,
    );
    const sceneDuration =
        selectedDetail.to > selectedDetail.from
            ? selectedDetail.to - selectedDetail.from
            : null;
    const sourceTime =
        selectedDetail.source === "bookmark"
            ? formatRelativeTime(selectedDetail.savedAt)
            : formatRelativeTime(selectedDetail.timestamp);
    const previewImage = selectedDetail.image;
    const previewVideo = selectedDetail.video;

    const infoItems = [
        {
            label: "Similarity",
            value: `${Math.round(selectedDetail.similarity * 100)}%`,
        },
        {
            label: "Episode",
            value:
                selectedDetail.episode !== null
                    ? `${selectedDetail.episode}`
                    : "-",
        },
        {
            label: "Scene",
            value: `${formatSceneTime(selectedDetail.from)} - ${formatSceneTime(selectedDetail.to)}`,
        },
        {
            label: "Matched at",
            value: formatOptionalSceneTime(selectedDetail.at),
        },
        {
            label: "Clip length",
            value: sceneDuration ? formatSceneTime(sceneDuration) : "-",
        },
        {
            label: "Anime ID",
            value: `#${selectedDetail.anilistId}`,
        },
    ];

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={closeDetail}
            />

            <div className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-(--border-default) bg-(--bg-secondary) shadow-2xl sm:rounded-2xl">
                <div className="flex items-center justify-between border-b border-(--border-subtle) px-5 py-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-(--accent)/30 bg-(--accent-soft) px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-(--accent)">
                                {SOURCE_LABELS[selectedDetail.source]}
                            </span>
                            {sourceTime && (
                                <span className="text-[11px] text-(--text-faint)">
                                    {sourceTime}
                                </span>
                            )}
                        </div>
                        <h2 className="mt-2 line-clamp-2 text-base font-bold leading-tight text-(--text-primary)">
                            {selectedDetail.title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={closeDetail}
                        className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-primary)"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8">
                    <div className="grid gap-4 pt-5 sm:grid-cols-[112px_1fr]">
                        <div
                            className="relative overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--bg-elevated)"
                            style={{ aspectRatio: "2 / 3" }}
                        >
                            {coverImage ? (
                                <Image
                                    src={coverImage}
                                    alt={selectedDetail.title}
                                    fill
                                    sizes="112px"
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <ImageIcon className="size-8 text-(--text-faint)" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            {extraTitles.length > 0 && (
                                <div className="space-y-1">
                                    {extraTitles.slice(0, 3).map((value) => (
                                        <p
                                            key={value}
                                            className="truncate text-xs text-(--text-muted)"
                                        >
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                                    <Percent className="size-3" />
                                    {(selectedDetail.similarity * 100).toFixed(
                                        1,
                                    )}
                                    % match
                                </span>
                                {selectedDetail.episode !== null && (
                                    <span className="rounded-full border border-(--border-subtle) bg-(--bg-glass) px-2.5 py-1 text-[11px] text-(--text-secondary)">
                                        Episode {selectedDetail.episode}
                                    </span>
                                )}
                                {animeInfo?.isAdult && (
                                    <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[11px] text-rose-300">
                                        Adult
                                    </span>
                                )}
                                {animeInfo?.idMal && (
                                    <span className="rounded-full border border-(--border-subtle) bg-(--bg-glass) px-2.5 py-1 text-[11px] text-(--text-secondary)">
                                        MAL #{animeInfo.idMal}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 rounded-2xl border border-(--border-subtle) bg-(--bg-glass) p-3">
                                <div className="flex items-center gap-2 text-[11px] text-(--text-faint)">
                                    <Film className="size-3.5" />
                                    Scene data from trace.moe
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-(--text-secondary)">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-3.5 text-(--text-faint)" />
                                        {formatSceneTime(selectedDetail.from)} -{" "}
                                        {formatSceneTime(selectedDetail.to)}
                                    </span>
                                    {selectedDetail.at !== null && (
                                        <span>
                                            Matched at{" "}
                                            {formatSceneTime(selectedDetail.at)}
                                        </span>
                                    )}
                                    {selectedDetail.savedAt && (
                                        <span className="flex items-center gap-1.5">
                                            <Bookmark className="size-3.5 text-(--text-faint)" />
                                            Saved{" "}
                                            {formatRelativeTime(
                                                selectedDetail.savedAt,
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--bg-elevated)">
                        <div className="flex items-center justify-between border-b border-(--border-subtle) px-4 py-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-(--text-faint)">
                                    Scene Preview
                                </p>
                                <p className="mt-1 text-[11px] text-(--text-muted)">
                                    Replay the matched shot from the API
                                    response.
                                </p>
                            </div>

                            {previewVideo && (
                                <div className="flex items-center gap-1.5">
                                    {showVideo && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsMuted((value) => !value)
                                            }
                                            className="flex size-8 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-primary)"
                                            aria-label={
                                                isMuted ? "Unmute" : "Mute"
                                            }
                                        >
                                            {isMuted ? (
                                                <VolumeX className="size-3.5" />
                                            ) : (
                                                <Volume2 className="size-3.5" />
                                            )}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowVideo((value) => !value)
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-primary)"
                                    >
                                        <Play className="size-3" />
                                        {showVideo ? "Frame" : "Video"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative aspect-video bg-black">
                            {showVideo && previewVideo ? (
                                <video
                                    src={`${previewVideo}?size=l${isMuted ? "&mute" : ""}`}
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    className="h-full w-full object-cover"
                                    onError={() => setShowVideo(false)}
                                />
                            ) : previewImage ? (
                                <Image
                                    src={`${previewImage}?size=l`}
                                    alt={`${selectedDetail.title} scene preview`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 720px"
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-(--text-faint)">
                                    <AlertCircle className="size-8" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {infoItems.map(({ label, value }) => (
                            <div
                                key={label}
                                className="rounded-xl border border-(--border-subtle) bg-(--bg-glass) px-3 py-2"
                            >
                                <p className="text-[10px] text-(--text-faint)">
                                    {label}
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-(--text-secondary)">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {synonyms.length > 0 && (
                        <div className="mt-5">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-(--text-faint)">
                                Synonyms
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {synonyms.slice(0, 8).map((value) => (
                                    <span
                                        key={value}
                                        className="rounded-full border border-(--border-default) bg-(--bg-elevated) px-2.5 py-0.5 text-[11px] text-(--text-secondary)"
                                    >
                                        {value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedDetail.filename && (
                        <div className="mt-5">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-(--text-faint)">
                                Source File
                            </p>
                            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-glass) px-3 py-2.5 font-mono text-[11px] leading-relaxed break-all text-(--text-secondary)">
                                {selectedDetail.filename}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
