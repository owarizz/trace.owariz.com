import { Calendar, Star, Tv } from "lucide-react";
import Image from "next/image";
import type { AiringAnime } from "../server/anilist";

function formatCountdown(seconds: number): string {
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

function getAnimeTitle(anime: AiringAnime): string {
    return anime.title.english ?? anime.title.romaji ?? `AniList #${anime.id}`;
}

function formatLabel(format: string | null): string {
    if (!format) return "";
    const map: Record<string, string> = {
        TV: "TV",
        TV_SHORT: "TV Short",
        MOVIE: "Movie",
        OVA: "OVA",
        ONA: "ONA",
        SPECIAL: "Special",
    };
    return map[format] ?? format;
}

interface AiringAnimeCardProps {
    anime: AiringAnime;
    index: number;
}

function AiringAnimeCard({ anime, index }: AiringAnimeCardProps) {
    const title = getAnimeTitle(anime);
    const countdown = anime.nextAiringEpisode
        ? formatCountdown(anime.nextAiringEpisode.timeUntilAiring)
        : null;

    return (
        <a
            href={`https://anilist.co/anime/${anime.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-44 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Cover image */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-(--border-subtle) bg-(--bg-elevated) transition-all duration-300 group-hover:-translate-y-1 group-hover:border-(--border-default) group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]">
                {anime.coverImage.large ? (
                    <Image
                        src={anime.coverImage.large}
                        alt={title}
                        referrerPolicy="no-referrer"
                        fill
                        sizes="176px"
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Tv className="size-8 text-(--text-faint)" />
                    </div>
                )}

                {/* Score badge */}
                {anime.meanScore && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/65 px-2 py-1 backdrop-blur-sm">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-white tabular-nums">
                            {(anime.meanScore / 10).toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Next episode countdown */}
                {countdown && anime.nextAiringEpisode && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2.5 pt-6 pb-2">
                        <p className="text-xs font-semibold text-white">
                            EP {anime.nextAiringEpisode.episode}
                        </p>
                        <p className="text-[10px] text-white/65">
                            in {countdown}
                        </p>
                    </div>
                )}
            </div>

            {/* Title + meta */}
            <div className="mt-2.5 space-y-0.5 px-0.5">
                <p className="line-clamp-2 text-xs font-semibold leading-snug text-(--text-secondary) transition-colors group-hover:text-(--accent)">
                    {title}
                </p>
                {anime.format && (
                    <p className="text-[11px] text-(--text-faint)">
                        {formatLabel(anime.format)}
                        {anime.episodes ? ` · ${anime.episodes} ep` : ""}
                    </p>
                )}
            </div>
        </a>
    );
}

interface AiringSectionProps {
    anime: AiringAnime[];
}

export function AiringSection({ anime }: AiringSectionProps) {
    if (anime.length === 0) return null;

    return (
        <section
            className="animate-fade-in"
            style={{ animationDelay: "0.25s" }}
        >
            <div className="mb-4 flex items-center gap-2.5">
                <Calendar className="size-4 text-(--text-muted)" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                    Airing This Season
                </span>
                <div className="h-px flex-1 bg-(--border-subtle)" />
                <a
                    href="https://anilist.co/search/anime/this-season"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-(--text-faint) transition-colors hover:text-(--accent)"
                >
                    See all
                </a>
            </div>

            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide scroll-smooth">
                    {anime.map((item, i) => (
                        <AiringAnimeCard key={item.id} anime={item} index={i} />
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-(--bg-primary) to-transparent" />
            </div>
        </section>
    );
}
