"use client";

import {
    AlertCircle,
    Calendar,
    ExternalLink,
    Film,
    Loader2,
    Star,
    Users,
    X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBookmarkStore } from "../controller/bookmark-store";

interface AnimeCharacter {
    id: number;
    name: { full: string };
    image: { medium: string | null };
}

interface AnimeRelationNode {
    id: number;
    title: { romaji: string | null; english: string | null };
    coverImage: { medium: string | null };
    format: string | null;
    type: string | null;
}

interface AnimeRelationEdge {
    relationType: string;
    node: AnimeRelationNode;
}

interface AnimeDetail {
    id: number;
    title: {
        romaji: string | null;
        english: string | null;
        native: string | null;
    };
    bannerImage: string | null;
    coverImage: {
        extraLarge: string | null;
        large: string | null;
        color: string | null;
    };
    description: string | null;
    genres: string[];
    tags: Array<{ name: string; rank: number }>;
    episodes: number | null;
    duration: number | null;
    status: string | null;
    season: string | null;
    seasonYear: number | null;
    format: string | null;
    averageScore: number | null;
    meanScore: number | null;
    popularity: number | null;
    studios: { nodes: Array<{ id: number; name: string }> };
    nextAiringEpisode: { episode: number; timeUntilAiring: number } | null;
    siteUrl: string | null;
    trailer: { id: string; site: string } | null;
    characters: { nodes: AnimeCharacter[] };
    relations: { edges: AnimeRelationEdge[] };
}

const STATUS_MAP: Record<string, string> = {
    FINISHED: "Finished",
    RELEASING: "Airing",
    NOT_YET_RELEASED: "Upcoming",
    CANCELLED: "Cancelled",
    HIATUS: "On Hiatus",
};

const FORMAT_MAP: Record<string, string> = {
    TV: "TV Series",
    TV_SHORT: "TV Short",
    MOVIE: "Movie",
    OVA: "OVA",
    ONA: "ONA",
    SPECIAL: "Special",
    MUSIC: "Music",
};

const SEASON_MAP: Record<string, string> = {
    WINTER: "Winter",
    SPRING: "Spring",
    SUMMER: "Summer",
    FALL: "Fall",
};

const KEEP_RELATIONS = ["SEQUEL", "PREQUEL", "SIDE_STORY", "PARENT"];

function formatCountdown(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `in ${days}d ${hours}h`;
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
}

function stripHtml(html: string | null): string {
    if (!html) return "";
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

const SYNOPSIS_LIMIT = 300;

export function AnimeDetailModal() {
    const { openDetailId, closeDetail } = useBookmarkStore();
    const [anime, setAnime] = useState<AnimeDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!openDetailId) {
            setAnime(null);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        setAnime(null);
        setExpanded(false);

        fetch(`/api/anime/${openDetailId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) throw new Error(data.error as string);
                setAnime(data as AnimeDetail);
            })
            .catch((e: Error) =>
                setError(e.message || "Failed to load anime details"),
            )
            .finally(() => setLoading(false));
    }, [openDetailId]);

    useEffect(() => {
        if (!openDetailId) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDetail();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [openDetailId, closeDetail]);

    if (!openDetailId) return null;

    const title =
        anime?.title?.english ??
        anime?.title?.romaji ??
        anime?.title?.native ??
        "Loading…";
    const mainStudio = anime?.studios?.nodes?.[0]?.name;
    const description = stripHtml(anime?.description ?? null);
    const shortDesc =
        description.length > SYNOPSIS_LIMIT
            ? `${description.slice(0, SYNOPSIS_LIMIT)}…`
            : description;
    const hasBanner = Boolean(anime?.bannerImage);

    const infoItems = [
        {
            label: "Status",
            value: anime?.status
                ? (STATUS_MAP[anime.status] ?? anime.status)
                : "—",
        },
        {
            label: "Format",
            value: anime?.format
                ? (FORMAT_MAP[anime.format] ?? anime.format)
                : "—",
        },
        {
            label: "Episodes",
            value: anime?.episodes ? `${anime.episodes} ep` : "—",
        },
        {
            label: "Duration",
            value: anime?.duration ? `${anime.duration} min` : "—",
        },
        {
            label: "Season",
            value:
                [
                    anime?.season
                        ? (SEASON_MAP[anime.season] ?? anime.season)
                        : null,
                    anime?.seasonYear,
                ]
                    .filter(Boolean)
                    .join(" ") || "—",
        },
        {
            label: "Popularity",
            value: anime?.popularity
                ? `#${anime.popularity.toLocaleString()}`
                : "—",
        },
    ];

    const relatedEdges = (anime?.relations?.edges ?? []).filter((e) =>
        KEEP_RELATIONS.includes(e.relationType),
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={closeDetail}
            />

            {/* Panel */}
            <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl border border-(--border-default) bg-(--bg-secondary) shadow-2xl max-h-[92dvh]">
                {/* Banner */}
                {hasBanner && (
                    <div className="relative h-28 w-full shrink-0 overflow-hidden">
                        <Image
                            src={anime?.bannerImage ?? ""}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-(--bg-secondary)" />
                        <button
                            type="button"
                            onClick={closeDetail}
                            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
                            aria-label="Close"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {!hasBanner && (
                    <div className="flex items-center justify-between px-5 pt-5 shrink-0">
                        <span className="text-xs font-medium uppercase tracking-wider text-(--text-faint)">
                            Anime Details
                        </span>
                        <button
                            type="button"
                            onClick={closeDetail}
                            className="flex size-8 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-primary)"
                            aria-label="Close"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-7 animate-spin text-(--accent)" />
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <AlertCircle className="size-8 text-(--error)" />
                            <p className="text-sm text-(--text-secondary)">
                                {error}
                            </p>
                        </div>
                    )}

                    {anime && (
                        <div className="px-5 pb-8">
                            {/* Cover + title */}
                            <div className="flex gap-4 pt-4">
                                {(anime.coverImage.large ||
                                    anime.coverImage.extraLarge) && (
                                    <div
                                        className="relative w-20 shrink-0 overflow-hidden rounded-xl border border-(--border-subtle)"
                                        style={{ aspectRatio: "2/3" }}
                                    >
                                        <Image
                                            src={
                                                anime.coverImage.extraLarge ??
                                                anime.coverImage.large ??
                                                ""
                                            }
                                            alt={title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1 pt-1">
                                    <h2 className="line-clamp-3 text-base font-bold leading-tight text-(--text-primary)">
                                        {title}
                                    </h2>
                                    {anime.title.native && (
                                        <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                                            {anime.title.native}
                                        </p>
                                    )}
                                    {mainStudio && (
                                        <p className="mt-1.5 text-xs text-(--text-secondary)">
                                            {mainStudio}
                                        </p>
                                    )}
                                    {(anime.averageScore ||
                                        anime.meanScore) && (
                                        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-400/10 px-2 py-0.5">
                                            <Star className="size-3 fill-amber-400 text-amber-400" />
                                            <span className="text-[11px] font-semibold text-amber-400">
                                                {anime.averageScore ??
                                                    anime.meanScore}
                                                %
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info grid */}
                            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
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

                            {/* Next episode */}
                            {anime.nextAiringEpisode && (
                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-(--accent)/20 bg-(--accent-soft) px-3 py-2">
                                    <Calendar className="size-3.5 shrink-0 text-(--accent)" />
                                    <span className="text-xs text-(--accent)">
                                        Episode{" "}
                                        {anime.nextAiringEpisode.episode}{" "}
                                        {formatCountdown(
                                            anime.nextAiringEpisode
                                                .timeUntilAiring,
                                        )}
                                    </span>
                                </div>
                            )}

                            {/* Synopsis */}
                            {description && (
                                <div className="mt-5">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-faint)">
                                        Synopsis
                                    </p>
                                    <p className="whitespace-pre-line text-sm leading-relaxed text-(--text-secondary)">
                                        {expanded ? description : shortDesc}
                                    </p>
                                    {description !== shortDesc && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpanded((v) => !v)
                                            }
                                            className="mt-1.5 text-xs font-medium text-(--accent) hover:underline"
                                        >
                                            {expanded
                                                ? "Show less"
                                                : "Read more"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Genres */}
                            {anime.genres.length > 0 && (
                                <div className="mt-5">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-(--text-faint)">
                                        Genres
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {anime.genres.map((genre) => (
                                            <span
                                                key={genre}
                                                className="rounded-full border border-(--border-default) bg-(--bg-elevated) px-2.5 py-0.5 text-[11px] text-(--text-secondary)"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Characters */}
                            {anime.characters?.nodes?.length > 0 && (
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center gap-1.5">
                                        <Users className="size-3 text-(--text-faint)" />
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-faint)">
                                            Main Characters
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                                        {anime.characters.nodes.map((char) => (
                                            <div
                                                key={char.id}
                                                className="flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-glass) px-2.5 py-2"
                                            >
                                                {char.image.medium && (
                                                    <div className="relative size-7 shrink-0 overflow-hidden rounded-full">
                                                        <Image
                                                            src={
                                                                char.image
                                                                    .medium
                                                            }
                                                            alt={char.name.full}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                )}
                                                <span className="truncate text-[11px] text-(--text-secondary)">
                                                    {char.name.full}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Related works */}
                            {relatedEdges.length > 0 && (
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center gap-1.5">
                                        <Film className="size-3 text-(--text-faint)" />
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-faint)">
                                            Related
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        {relatedEdges
                                            .slice(0, 4)
                                            .map((edge) => (
                                                <a
                                                    key={edge.node.id}
                                                    href={`https://anilist.co/anime/${edge.node.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2.5 rounded-xl border border-(--border-subtle) bg-(--bg-glass) px-3 py-2 transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover)"
                                                >
                                                    {edge.node.coverImage
                                                        .medium && (
                                                        <div className="relative h-8 w-6 shrink-0 overflow-hidden rounded">
                                                            <Image
                                                                src={
                                                                    edge.node
                                                                        .coverImage
                                                                        .medium
                                                                }
                                                                alt=""
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs text-(--text-secondary)">
                                                            {edge.node.title
                                                                .english ??
                                                                edge.node.title
                                                                    .romaji}
                                                        </p>
                                                        <p className="text-[10px] text-(--text-faint)">
                                                            {edge.relationType.replace(
                                                                /_/g,
                                                                " ",
                                                            )}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="size-3 shrink-0 text-(--text-faint)" />
                                                </a>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* AniList CTA */}
                            <div className="mt-6">
                                <a
                                    href={
                                        anime.siteUrl ??
                                        `https://anilist.co/anime/${anime.id}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent) py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                                >
                                    <ExternalLink className="size-4" />
                                    View on AniList
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
