"use client";

import {
    BookmarkCheck,
    Calendar,
    ExternalLink,
    History,
    Star,
    Tv,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useBookmarkStore } from "@/features/home/controller/bookmark-store";
import { useHistory } from "@/features/home/controller/history-hook";
import {
    buildSeasonHref,
    type SeasonalAnime,
    type SeasonSelection,
} from "../shared/seasonal";

function formatMemberCount(value: number | null) {
    if (!value) return null;
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `${Math.round(value / 1_000)}K`;
    }
    return value.toLocaleString();
}

function normalizeTitle(value: string | null | undefined) {
    return value
        ?.toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function getTrackingState(
    anime: SeasonalAnime,
    trackedMalIds: Set<number>,
    trackedTitles: Set<string>,
) {
    if (trackedMalIds.has(anime.id)) {
        return {
            label: "Saved",
            icon: BookmarkCheck,
            className:
                "border-emerald-400/25 bg-emerald-400/12 text-emerald-300",
        };
    }

    const titles = [
        anime.title,
        anime.titleEnglish,
        anime.titleJapanese,
        ...anime.titleSynonyms,
    ]
        .map((value) => normalizeTitle(value))
        .filter((value): value is string => Boolean(value));

    if (titles.some((value) => trackedTitles.has(value))) {
        return {
            label: "Seen in search",
            icon: History,
            className: "border-sky-400/20 bg-sky-400/10 text-sky-300",
        };
    }

    return null;
}

function sortAnime(
    anime: SeasonalAnime[],
    trackedMalIds: Set<number>,
    trackedTitles: Set<string>,
) {
    return [...anime].sort((left, right) => {
        const leftTracked = getTrackingState(left, trackedMalIds, trackedTitles)
            ? 1
            : 0;
        const rightTracked = getTrackingState(
            right,
            trackedMalIds,
            trackedTitles,
        )
            ? 1
            : 0;

        if (leftTracked !== rightTracked) {
            return rightTracked - leftTracked;
        }

        return (right.score ?? 0) - (left.score ?? 0);
    });
}

interface AiringAnimeCardProps {
    anime: SeasonalAnime;
    index: number;
    trackedMalIds: Set<number>;
    trackedTitles: Set<string>;
}

function AiringAnimeCard({
    anime,
    index,
    trackedMalIds,
    trackedTitles,
}: AiringAnimeCardProps) {
    const tracking = getTrackingState(anime, trackedMalIds, trackedTitles);
    const TrackingIcon = tracking?.icon;
    const memberCount = formatMemberCount(anime.members);

    return (
        <a
            href={anime.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-48 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--bg-elevated) transition-all duration-300 group-hover:-translate-y-1 group-hover:border-(--border-default) group-hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.65)]">
                {anime.largeImageUrl ? (
                    <Image
                        src={anime.largeImageUrl}
                        alt={anime.titleEnglish ?? anime.title}
                        fill
                        sizes="192px"
                        loading="lazy"
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Tv className="size-9 text-(--text-faint)" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                {anime.score && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-md">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-white">
                            {anime.score.toFixed(2)}
                        </span>
                    </div>
                )}

                {tracking && TrackingIcon && (
                    <div
                        className={`absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${tracking.className}`}
                    >
                        <TrackingIcon className="size-3" />
                        {tracking.label}
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                        {anime.titleEnglish ?? anime.title}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/75">
                        {anime.type && <span>{anime.type}</span>}
                        {anime.episodes && <span>{anime.episodes} ep</span>}
                        {memberCount && (
                            <span className="inline-flex items-center gap-1">
                                <Users className="size-3" />
                                {memberCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 space-y-1 px-0.5">
                {anime.titleJapanese && (
                    <p className="truncate text-[11px] text-(--text-faint)">
                        {anime.titleJapanese}
                    </p>
                )}
                <p className="line-clamp-2 text-xs leading-relaxed text-(--text-muted)">
                    {anime.synopsis ??
                        anime.background ??
                        "Seasonal pick from the current anime archive."}
                </p>
            </div>
        </a>
    );
}

interface AiringSectionProps {
    anime: SeasonalAnime[];
    selection: SeasonSelection;
    error?: string | null;
}

export function AiringSection({
    anime,
    selection,
    error = null,
}: AiringSectionProps) {
    const bookmarks = useBookmarkStore((state) => state.bookmarks);
    const { history, isLoaded } = useHistory();

    const trackedMalIds = new Set<number>();
    const trackedTitles = new Set<string>();

    for (const item of bookmarks) {
        if (item.animeInfo?.idMal) {
            trackedMalIds.add(item.animeInfo.idMal);
        }

        for (const value of [
            item.title,
            item.nativeTitle,
            item.animeInfo?.title.romaji,
            item.animeInfo?.title.english,
            item.animeInfo?.title.native,
            ...(item.animeInfo?.synonyms ?? []),
        ]) {
            const normalized = normalizeTitle(value);
            if (normalized) trackedTitles.add(normalized);
        }
    }

    if (isLoaded) {
        for (const item of history) {
            if (item.animeInfo?.idMal) {
                trackedMalIds.add(item.animeInfo.idMal);
            }

            for (const value of [
                item.title,
                item.nativeTitle,
                item.animeInfo?.title.romaji,
                item.animeInfo?.title.english,
                item.animeInfo?.title.native,
                ...(item.animeInfo?.synonyms ?? []),
            ]) {
                const normalized = normalizeTitle(value);
                if (normalized) trackedTitles.add(normalized);
            }
        }
    }

    const displayAnime = sortAnime(anime, trackedMalIds, trackedTitles);

    if (displayAnime.length === 0 && !error) {
        return null;
    }

    return (
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="mb-4 flex items-center gap-2.5">
                <Calendar className="size-4 text-(--text-muted)" />
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                        Recommended This Season
                    </p>
                    <p className="mt-1 text-[11px] text-(--text-faint)">
                        Badges reflect your bookmarks and search history.
                    </p>
                </div>
                <div className="h-px flex-1 bg-(--border-subtle)" />
                <Link
                    href={buildSeasonHref(selection)}
                    prefetch
                    className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary)"
                >
                    Browse all
                    <ExternalLink className="size-3" />
                </Link>
            </div>

            {error && (
                <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-xs text-amber-100">
                    {error}
                </div>
            )}

            {displayAnime.length > 0 && (
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-(--bg-primary) to-transparent" />
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide scroll-smooth">
                        {displayAnime.map((item, index) => (
                            <AiringAnimeCard
                                key={item.id}
                                anime={item}
                                index={index}
                                trackedMalIds={trackedMalIds}
                                trackedTitles={trackedTitles}
                            />
                        ))}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-(--bg-primary) to-transparent" />
                </div>
            )}
        </section>
    );
}
