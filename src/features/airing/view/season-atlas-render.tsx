import {
    ArrowLeft,
    ArrowRight,
    ExternalLink,
    Layers3,
    Sparkles,
    Star,
    Tv,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_CONFIG } from "@/common/config/site";
import {
    buildSeasonHref,
    type SeasonArchiveYear,
    type SeasonalArchivePage,
    type SeasonName,
} from "../shared/seasonal";

function formatMemberCount(value: number | null) {
    if (!value) return "-";
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `${Math.round(value / 1_000)}K`;
    }
    return value.toLocaleString();
}

function seasonLabel(season: SeasonName) {
    return season.charAt(0).toUpperCase() + season.slice(1);
}

function seasonAccent(season: SeasonName) {
    const map: Record<SeasonName, string> = {
        winter: "from-sky-300/25 via-cyan-300/10 to-transparent",
        spring: "from-emerald-300/25 via-lime-300/10 to-transparent",
        summer: "from-amber-300/25 via-orange-300/10 to-transparent",
        fall: "from-rose-300/25 via-fuchsia-300/10 to-transparent",
    };

    return map[season];
}

interface SeasonAtlasRenderProps {
    archive: SeasonArchiveYear[];
    feed: SeasonalArchivePage;
}

export function SeasonAtlasRender({ archive, feed }: SeasonAtlasRenderProps) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-[25%] left-[10%] h-[42rem] w-[42rem] rounded-full bg-sky-400/8 blur-[140px]" />
                <div className="absolute right-[-10%] top-[20%] h-[36rem] w-[36rem] rounded-full bg-emerald-300/7 blur-[130px]" />
                <div className="absolute bottom-[-20%] left-[35%] h-[28rem] w-[28rem] rounded-full bg-amber-300/6 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:py-16">
                <nav className="mb-8 flex items-center justify-between gap-4 animate-fade-in">
                    <Link
                        href="/"
                        prefetch
                        className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) transition-colors hover:text-(--text-secondary)"
                    >
                        <ArrowLeft className="size-4" />
                        Back to search
                    </Link>

                    <a
                        href={APP_CONFIG.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-(--text-faint) transition-colors hover:text-(--text-secondary)"
                    >
                        {APP_CONFIG.github.repository}
                        <ExternalLink className="size-3.5" />
                    </a>
                </nav>

                <header className="mb-8 animate-fade-in">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--accent)/25 bg-(--accent-soft) px-3 py-1">
                        <Sparkles className="size-3 text-(--accent)" />
                        <span className="text-[11px] font-medium text-(--accent)">
                            Anime Atlas
                        </span>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                        <div className="relative overflow-hidden rounded-[2rem] border border-(--border-default) bg-(--bg-glass) p-6 backdrop-blur-md">
                            <div
                                className={`pointer-events-none absolute inset-0 rounded-[2rem] bg-linear-to-br ${seasonAccent(feed.selection.season)}`}
                            />
                            <div className="relative">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--text-muted)">
                                    Every season, one archive
                                </p>
                                <h1 className="mt-3 text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                                    {seasonLabel(feed.selection.season)}{" "}
                                    {feed.selection.year}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--text-secondary)">
                                    Browse anime across every available season
                                    without going through AniList. This page is
                                    backed by the same seasonal catalog used for
                                    home-page recommendations.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-glass) px-4 py-3">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-(--text-faint)">
                                    Catalog size
                                </p>
                                <p className="mt-1 text-lg font-semibold text-(--text-primary)">
                                    {feed.totalItems.toLocaleString()}
                                </p>
                                <p className="text-xs text-(--text-muted)">
                                    titles in this season
                                </p>
                            </div>

                            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-glass) px-4 py-3">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-(--text-faint)">
                                    Page
                                </p>
                                <p className="mt-1 text-lg font-semibold text-(--text-primary)">
                                    {feed.page}/{feed.totalPages}
                                </p>
                                <p className="text-xs text-(--text-muted)">
                                    {feed.itemsPerPage.toLocaleString()} per
                                    page
                                </p>
                            </div>

                            <div className="rounded-2xl border border-(--border-subtle) bg-(--bg-glass) px-4 py-3">
                                <p className="text-[10px] uppercase tracking-[0.16em] text-(--text-faint)">
                                    Archive years
                                </p>
                                <p className="mt-1 text-lg font-semibold text-(--text-primary)">
                                    {archive.length.toLocaleString()}
                                </p>
                                <p className="text-xs text-(--text-muted)">
                                    available year groups
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-[1.75rem] border border-(--border-default) bg-(--bg-glass) p-4 backdrop-blur-md">
                            <div className="mb-4 flex items-center gap-2">
                                <Layers3 className="size-4 text-(--text-muted)" />
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-(--text-muted)">
                                        Season Archive
                                    </p>
                                    <p className="mt-1 text-[11px] text-(--text-faint)">
                                        Jump across every year and quarter.
                                    </p>
                                </div>
                            </div>

                            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                                {archive.map((entry) => (
                                    <div
                                        key={entry.year}
                                        className="rounded-2xl border border-(--border-subtle) bg-(--bg-elevated) px-3 py-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-(--text-primary)">
                                                {entry.year}
                                            </span>
                                            <span className="text-[10px] text-(--text-faint)">
                                                {entry.seasons.length} seasons
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {entry.seasons.map((season) => {
                                                const isActive =
                                                    entry.year ===
                                                        feed.selection.year &&
                                                    season ===
                                                        feed.selection.season;

                                                return (
                                                    <Link
                                                        key={`${entry.year}-${season}`}
                                                        href={buildSeasonHref({
                                                            year: entry.year,
                                                            season,
                                                        })}
                                                        prefetch={false}
                                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                                                            isActive
                                                                ? "border-(--accent)/40 bg-(--accent-muted) text-(--accent)"
                                                                : "border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) hover:border-(--border-default) hover:text-(--text-secondary)"
                                                        }`}
                                                    >
                                                        {seasonLabel(season)}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="space-y-5">
                        {feed.error && (
                            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-sm text-amber-100">
                                {feed.error}
                            </div>
                        )}

                        {feed.anime.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {feed.anime.map((anime) => (
                                    <article
                                        key={anime.id}
                                        className="group overflow-hidden rounded-[1.75rem] border border-(--border-default) bg-(--bg-glass) transition-all duration-300 hover:-translate-y-1 hover:border-(--border-default) hover:shadow-[0_18px_42px_-16px_rgba(0,0,0,0.6)]"
                                    >
                                        <a
                                            href={anime.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden bg-(--bg-elevated)">
                                                {anime.largeImageUrl ? (
                                                    <Image
                                                        src={
                                                            anime.largeImageUrl
                                                        }
                                                        alt={
                                                            anime.titleEnglish ??
                                                            anime.title
                                                        }
                                                        fill
                                                        sizes="(max-width: 1280px) 50vw, 33vw"
                                                        unoptimized
                                                        referrerPolicy="no-referrer"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Tv className="size-10 text-(--text-faint)" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                                <div className="absolute right-3 bottom-3 left-3">
                                                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/75">
                                                        {anime.type && (
                                                            <span>
                                                                {anime.type}
                                                            </span>
                                                        )}
                                                        {anime.episodes && (
                                                            <span>
                                                                {anime.episodes}{" "}
                                                                ep
                                                            </span>
                                                        )}
                                                        {anime.score && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-white">
                                                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                                                {anime.score.toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-white">
                                                        {anime.titleEnglish ??
                                                            anime.title}
                                                    </h2>
                                                </div>
                                            </div>
                                        </a>

                                        <div className="space-y-4 p-4">
                                            {anime.titleJapanese && (
                                                <p className="text-xs text-(--text-faint)">
                                                    {anime.titleJapanese}
                                                </p>
                                            )}

                                            <p className="line-clamp-4 text-sm leading-relaxed text-(--text-secondary)">
                                                {anime.synopsis ??
                                                    anime.background ??
                                                    "No synopsis was returned for this title."}
                                            </p>

                                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) px-3 py-2">
                                                    <p className="text-(--text-faint)">
                                                        Members
                                                    </p>
                                                    <p className="mt-1 font-medium text-(--text-secondary)">
                                                        {formatMemberCount(
                                                            anime.members,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) px-3 py-2">
                                                    <p className="text-(--text-faint)">
                                                        Rank
                                                    </p>
                                                    <p className="mt-1 font-medium text-(--text-secondary)">
                                                        {anime.rank
                                                            ? `#${anime.rank}`
                                                            : "-"}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) px-3 py-2">
                                                    <p className="text-(--text-faint)">
                                                        Source
                                                    </p>
                                                    <p className="mt-1 font-medium text-(--text-secondary)">
                                                        {anime.source ?? "-"}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl border border-(--border-subtle) bg-(--bg-elevated) px-3 py-2">
                                                    <p className="text-(--text-faint)">
                                                        Status
                                                    </p>
                                                    <p className="mt-1 font-medium text-(--text-secondary)">
                                                        {anime.status ?? "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                {[
                                                    ...anime.genres,
                                                    ...anime.demographics,
                                                ]
                                                    .slice(0, 5)
                                                    .map((value) => (
                                                        <span
                                                            key={`${anime.id}-${value}`}
                                                            className="rounded-full border border-(--border-subtle) bg-(--bg-elevated) px-2.5 py-1 text-[10px] text-(--text-muted)"
                                                        >
                                                            {value}
                                                        </span>
                                                    ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-1">
                                                <div className="inline-flex items-center gap-1.5 text-[11px] text-(--text-faint)">
                                                    <Users className="size-3" />
                                                    {formatMemberCount(
                                                        anime.members,
                                                    )}{" "}
                                                    followers
                                                </div>
                                                <a
                                                    href={anime.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--bg-elevated) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary)"
                                                >
                                                    Open
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[1.75rem] border border-dashed border-(--border-default) bg-(--bg-glass) px-6 py-10 text-center">
                                <p className="text-base font-semibold text-(--text-primary)">
                                    No anime found for this view
                                </p>
                                <p className="mt-2 text-sm text-(--text-muted)">
                                    Try another year or season from the archive
                                    panel.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-(--border-default) bg-(--bg-glass) px-4 py-3">
                            <p className="text-sm text-(--text-secondary)">
                                Page {feed.page} of {feed.totalPages} for{" "}
                                {seasonLabel(feed.selection.season)}{" "}
                                {feed.selection.year}
                            </p>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={buildSeasonHref(
                                        feed.selection,
                                        Math.max(feed.page - 1, 1),
                                    )}
                                    prefetch={false}
                                    aria-disabled={feed.page <= 1}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${
                                        feed.page <= 1
                                            ? "pointer-events-none border-(--border-subtle) bg-(--bg-elevated) text-(--text-faint)"
                                            : "border-(--border-subtle) bg-(--bg-elevated) text-(--text-muted) hover:border-(--border-default) hover:text-(--text-secondary)"
                                    }`}
                                >
                                    <ArrowLeft className="size-3" />
                                    Previous
                                </Link>

                                <Link
                                    href={buildSeasonHref(
                                        feed.selection,
                                        feed.page + 1,
                                    )}
                                    prefetch={false}
                                    aria-disabled={!feed.hasNextPage}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${
                                        !feed.hasNextPage
                                            ? "pointer-events-none border-(--border-subtle) bg-(--bg-elevated) text-(--text-faint)"
                                            : "border-(--border-subtle) bg-(--bg-elevated) text-(--text-muted) hover:border-(--border-default) hover:text-(--text-secondary)"
                                    }`}
                                >
                                    Next
                                    <ArrowRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
