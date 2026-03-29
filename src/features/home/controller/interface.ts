export interface MeResponse {
    id: string;
    priority: number;
    concurrency: number;
    quota: number;
    quotaUsed: number;
}

// ─── Search API ───

export interface AnilistInfo {
    id: number;
    idMal: number | null;
    title: {
        native: string | null;
        romaji: string | null;
        english: string | null;
    };
    synonyms: string[];
    isAdult: boolean;
}

export interface SearchResult {
    anilist: number | AnilistInfo;
    filename: string;
    episode: number | null;
    duration: number;
    from: number;
    to: number;
    at: number;
    similarity: number;
    video: string;
    image: string;
}

export interface SearchResponse {
    frameCount: number;
    error: string;
    result: SearchResult[];
}
