import type { AnilistInfo, SearchResult } from "./interface";

export interface AnimeSceneSnapshot {
    anilistId: number;
    animeInfo: AnilistInfo | null;
    title: string;
    nativeTitle: string | null;
    episode: number | string | null;
    similarity: number;
    from: number | null;
    to: number | null;
    at: number | null;
    duration: number | null;
    image: string | null;
    video: string | null;
    filename: string | null;
}

export interface AnimeDetailState extends AnimeSceneSnapshot {
    source: "search" | "bookmark" | "history";
    savedAt?: number | null;
    timestamp?: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function parseFiniteNumber(value: unknown): number | null {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function parseText(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function parseEpisode(value: unknown): number | string | null {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }

    return null;
}

function parseAnimeInfo(value: unknown): AnilistInfo | null {
    if (!isRecord(value) || !isRecord(value.title)) {
        return null;
    }

    const id = parseFiniteNumber(value.id);

    if (id === null) {
        return null;
    }

    const coverImage = isRecord(value.coverImage)
        ? {
              medium: parseText(value.coverImage.medium) ?? undefined,
              large: parseText(value.coverImage.large) ?? undefined,
          }
        : undefined;

    return {
        id,
        idMal: parseFiniteNumber(value.idMal),
        title: {
            native: parseText(value.title.native),
            romaji: parseText(value.title.romaji),
            english: parseText(value.title.english),
        },
        synonyms: Array.isArray(value.synonyms)
            ? value.synonyms.filter(
                  (item): item is string =>
                      typeof item === "string" && item.trim().length > 0,
              )
            : [],
        isAdult: Boolean(value.isAdult),
        coverImage,
    };
}

export function getAnimeInfo(
    anilist: SearchResult["anilist"] | AnilistInfo | null | undefined,
): AnilistInfo | null {
    if (!anilist || typeof anilist === "number") {
        return null;
    }

    return anilist;
}

export function getAnimeId(
    anilist: SearchResult["anilist"] | AnilistInfo | number,
): number {
    return typeof anilist === "number" ? anilist : anilist.id;
}

export function getAnimeTitle(animeInfo: AnilistInfo | null, animeId: number) {
    return (
        animeInfo?.title.english ??
        animeInfo?.title.romaji ??
        animeInfo?.title.native ??
        (animeId > 0 ? `Anime #${animeId}` : "Unknown Anime")
    );
}

export function getAnimeNativeTitle(animeInfo: AnilistInfo | null) {
    return animeInfo?.title.native ?? null;
}

export function getAnimeCoverImage(animeInfo: AnilistInfo | null) {
    return (
        animeInfo?.coverImage?.large ?? animeInfo?.coverImage?.medium ?? null
    );
}

export function formatSceneTime(seconds?: number | null) {
    const normalizedSeconds = parseFiniteNumber(seconds);

    if (normalizedSeconds === null) {
        return "-";
    }

    const minutes = Math.floor(normalizedSeconds / 60);
    const remainingSeconds = Math.floor(normalizedSeconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function normalizeAnimeSceneSnapshot(
    value: unknown,
): AnimeSceneSnapshot | null {
    if (!isRecord(value)) {
        return null;
    }

    const animeInfo = parseAnimeInfo(value.animeInfo);
    const anilistId = parseFiniteNumber(value.anilistId) ?? animeInfo?.id ?? 0;
    const fallbackImage = parseText(value.coverImage);

    return {
        anilistId,
        animeInfo,
        title: parseText(value.title) ?? getAnimeTitle(animeInfo, anilistId),
        nativeTitle:
            parseText(value.nativeTitle) ?? getAnimeNativeTitle(animeInfo),
        episode: parseEpisode(value.episode),
        similarity: parseFiniteNumber(value.similarity) ?? 0,
        from: parseFiniteNumber(value.from),
        to: parseFiniteNumber(value.to),
        at: parseFiniteNumber(value.at),
        duration: parseFiniteNumber(value.duration),
        image: parseText(value.image) ?? fallbackImage,
        video: parseText(value.video),
        filename: parseText(value.filename),
    };
}

export function createSceneSnapshot(result: SearchResult): AnimeSceneSnapshot {
    const animeInfo = getAnimeInfo(result.anilist);
    const anilistId = getAnimeId(result.anilist);

    return {
        anilistId,
        animeInfo,
        title: getAnimeTitle(animeInfo, anilistId),
        nativeTitle: getAnimeNativeTitle(animeInfo),
        episode: result.episode,
        similarity: result.similarity,
        from: result.from,
        to: result.to,
        at: result.at,
        duration: result.duration,
        image: result.image,
        video: result.video,
        filename: result.filename,
    };
}

export function createDetailStateFromSearch(
    result: SearchResult,
): AnimeDetailState {
    return {
        source: "search",
        ...createSceneSnapshot(result),
    };
}
