import type { AnilistInfo, SearchResult } from "./interface";

export interface AnimeSceneSnapshot {
    anilistId: number;
    animeInfo: AnilistInfo | null;
    title: string;
    nativeTitle: string | null;
    episode: number | string | null;
    similarity: number;
    from: number;
    to: number;
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
        `Anime #${animeId}`
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

export function formatSceneTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
