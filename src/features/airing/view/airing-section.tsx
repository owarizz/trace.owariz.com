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
        TV_SHORT: "Short",
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
            className="group shrink-0 w-28 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-(--border-subtle) bg-(--bg-elevated) transition-all duration-300 group-hover:-translate-y-1 group-hover:border-(--border-default) group-hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)]">
                {anime.coverImage.large ? (
                    <Image
                        src={anime.coverImage.large}
                        alt={title}
                        referrerPolicy="no-referrer"
                        fill
                        sizes="112px"
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Tv className="size-6 text-(--text-faint)" />
                    </div>
                )}

                {anime.meanScore && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
                        <Star className="size-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[9px] font-bold text-white tabular-nums">
                            {(anime.meanScore / 10).toFixed(1)}
                        </span>
                    </div>
                )}

                {countdown && anime.nextAiringEpisode && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1.5">
                        <p className="text-[9px] font-medium text-white/90">
                            EP {anime.nextAiringEpisode.episode}{" "}
                            <span className="text-white/60">
                                in {countdown}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-2 space-y-0.5 px-0.5">
                <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-(--text-secondary) transition-colors group-hover:text-(--accent)">
                    {title}
                </p>
                {anime.format && (
                    <p className="text-[10px] text-(--text-faint)">
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
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                    {anime.map((item, i) => (
                        <div key={item.id} className="snap-start">
                            <AiringAnimeCard anime={item} index={i} />
                        </div>
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-(--bg-primary) to-transparent" />
            </div>
        </section>
    );
}
