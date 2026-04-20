import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Layers3,
    Sparkles,
    Star,
    Tv,
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
    if (!value) return null;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
    return value.toLocaleString();
}

function seasonLabel(season: SeasonName) {
    return season.charAt(0).toUpperCase() + season.slice(1);
}

function seasonGradient(season: SeasonName) {
    const map: Record<SeasonName, string> = {
        winter: "from-white via-sky-200 to-cyan-300",
        spring: "from-white via-emerald-200 to-lime-300",
        summer: "from-white via-amber-200 to-orange-300",
        fall: "from-white via-rose-200 to-fuchsia-300",
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
                <div className="absolute -top-[30%] -left-[10%] h-[60vh] w-[50vw] rounded-full bg-sky-500/5 blur-[120px]" />
                <div className="absolute -right-[15%] top-[10%] h-[50vh] w-[40vw] rounded-full bg-violet-500/4 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 sm:py-16">
                {/* ── Nav ── */}
                <nav className="mb-10 flex items-center justify-between animate-fade-in">
                    <Link
                        href="/"
                        prefetch
                        className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) transition-colors hover:text-(--text-secondary)"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                    <a
                        href={APP_CONFIG.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-(--text-faint) transition-colors hover:text-(--text-secondary)"
                    >
                        {APP_CONFIG.github.repository}
                        <ArrowUpRight className="size-3.5" />
                    </a>
                </nav>

                {/* ── Header ── */}
                <header
                    className="mb-8 animate-fade-in"
                    style={{ animationDelay: "0.05s" }}
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--accent)/20 bg-(--accent-soft) px-3 py-1">
                        <Sparkles className="size-3 text-(--accent)" />
                        <span className="text-[11px] font-medium text-(--accent)">
                            Anime Atlas
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                        <span
                            className={`inline-block bg-linear-to-r ${seasonGradient(feed.selection.season)} bg-clip-text text-transparent animate-gradient`}
                        >
                            {seasonLabel(feed.selection.season)}{" "}
                            {feed.selection.year}
                        </span>
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-(--text-muted)">
                        <span>
                            <strong className="font-semibold text-(--text-secondary)">
                                {feed.totalItems.toLocaleString()}
                            </strong>{" "}
                            titles
                        </span>
                        <span className="text-(--border-default)">·</span>
                        <span>
                            page{" "}
                            <strong className="font-semibold text-(--text-secondary)">
                                {feed.page}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-semibold text-(--text-secondary)">
                                {feed.totalPages}
                            </strong>
                        </span>
                        <span className="text-(--border-default)">·</span>
                        <span>
                            <strong className="font-semibold text-(--text-secondary)">
                                {archive.length}
                            </strong>{" "}
                            year groups
                        </span>
                    </div>
                </header>

                {/* ── Error banner ── */}
                {feed.error && (
                    <div className="mb-6 rounded-xl border border-amber-300/15 bg-amber-300/6 px-4 py-3 text-xs text-amber-200 animate-fade-in">
                        {feed.error}
                    </div>
                )}

                {/* ── Season archive ── */}
                <section
                    className="mb-8 animate-fade-in"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="mb-3 flex items-center gap-2.5">
                        <Layers3 className="size-3.5 text-(--text-muted)" />
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            Season Archive
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                        <span className="text-[10px] text-(--text-faint)">
                            {archive.length} years
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-(--border-subtle)">
                        {archive.map((entry, i) => (
                            <div
                                key={entry.year}
                                className={`flex items-center gap-3 px-4 py-2.5 ${i < archive.length - 1 ? "border-b border-(--border-subtle)" : ""}`}
                            >
                                <span className="w-10 shrink-0 text-sm font-semibold text-(--text-secondary)">
                                    {entry.year}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {entry.seasons.map((season) => {
                                        const isActive =
                                            entry.year ===
                                                feed.selection.year &&
                                            season === feed.selection.season;

                                        return (
                                            <Link
                                                key={`${entry.year}-${season}`}
                                                href={buildSeasonHref({
                                                    year: entry.year,
                                                    season,
                                                })}
                                                prefetch={false}
                                                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                                                    isActive
                                                        ? "border-(--accent)/40 bg-(--accent-muted) text-(--accent)"
                                                        : "border-(--border-subtle) text-(--text-faint) hover:border-(--border-default) hover:text-(--text-secondary)"
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
                </section>

                {/* ── Anime list ── */}
                <section
                    className="animate-fade-in"
                    style={{ animationDelay: "0.15s" }}
                >
                    <div className="mb-1 flex items-center gap-2.5">
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            {seasonLabel(feed.selection.season)}{" "}
                            {feed.selection.year}
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                        <span className="text-[10px] text-(--text-faint)">
                            {feed.anime.length}
                        </span>
                    </div>

                    {feed.anime.length > 0 ? (
                        <div className="mt-1 overflow-hidden rounded-xl border border-(--border-subtle)">
                            {feed.anime.map((anime, i) => (
                                <a
                                    key={anime.id}
                                    href={anime.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-(--bg-glass) ${i < feed.anime.length - 1 ? "border-b border-(--border-subtle)" : ""}`}
                                >
                                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-(--border-subtle) bg-(--bg-elevated)">
                                        {anime.largeImageUrl ? (
                                            <Image
                                                src={anime.largeImageUrl}
                                                alt={
                                                    anime.titleEnglish ??
                                                    anime.title
                                                }
                                                fill
                                                sizes="40px"
                                                unoptimized
                                                referrerPolicy="no-referrer"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Tv className="size-4 text-(--text-faint)" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
                                            {anime.titleEnglish ?? anime.title}
                                        </p>
                                        {anime.titleJapanese && (
                                            <p className="truncate text-[11px] text-(--text-faint)">
                                                {anime.titleJapanese}
                                            </p>
                                        )}
                                    </div>

                                    <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                                        {anime.type && (
                                            <span className="text-[11px] text-(--text-faint)">
                                                {anime.type}
                                            </span>
                                        )}
                                        {anime.episodes && (
                                            <span className="text-[11px] text-(--text-faint)">
                                                · {anime.episodes} ep
                                            </span>
                                        )}
                                    </div>

                                    {anime.score ? (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-(--border-subtle) bg-(--bg-elevated) px-2 py-0.5 text-[11px] font-semibold text-(--text-secondary)">
                                            <Star className="size-3 fill-amber-400 text-amber-400" />
                                            {anime.score.toFixed(2)}
                                        </span>
                                    ) : (
                                        <span className="hidden shrink-0 text-[11px] text-(--text-faint) sm:inline">
                                            —
                                        </span>
                                    )}

                                    <ArrowUpRight className="size-3.5 shrink-0 text-(--text-faint) opacity-0 transition-opacity group-hover:opacity-100" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 rounded-xl border border-dashed border-(--border-default) px-6 py-10 text-center">
                            <p className="text-sm font-semibold text-(--text-primary)">
                                No anime found for this season
                            </p>
                            <p className="mt-2 text-xs text-(--text-muted)">
                                Try another year or season from the archive
                                above.
                            </p>
                        </div>
                    )}
                </section>

                {/* ── Pagination ── */}
                <div
                    className="mt-6 flex items-center justify-between animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                >
                    <p className="text-xs text-(--text-faint)">
                        Page {feed.page} of {feed.totalPages}
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
                                    ? "pointer-events-none border-(--border-subtle) text-(--text-faint)"
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
                                    ? "pointer-events-none border-(--border-subtle) text-(--text-faint)"
                                    : "border-(--border-subtle) bg-(--bg-elevated) text-(--text-muted) hover:border-(--border-default) hover:text-(--text-secondary)"
                            }`}
                        >
                            Next
                            <ArrowRight className="size-3" />
                        </Link>
                    </div>
                </div>

                <footer
                    className="mt-16 text-center animate-fade-in"
                    style={{ animationDelay: "0.25s" }}
                >
                    <p className="text-xs text-(--text-faint)">
                        Backed by the Jikan API — seasonal catalog.
                    </p>
                </footer>
            </div>
        </div>
    );
}
