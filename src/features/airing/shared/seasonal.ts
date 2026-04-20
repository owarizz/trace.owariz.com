export type SeasonName = "winter" | "spring" | "summer" | "fall";

export interface SeasonSelection {
    year: number;
    season: SeasonName;
}

export interface SeasonalAnime {
    id: number;
    url: string;
    title: string;
    titleEnglish: string | null;
    titleJapanese: string | null;
    titleSynonyms: string[];
    imageUrl: string | null;
    largeImageUrl: string | null;
    type: string | null;
    source: string | null;
    episodes: number | null;
    status: string | null;
    airing: boolean;
    airedFrom: string | null;
    airedTo: string | null;
    airedLabel: string | null;
    duration: string | null;
    rating: string | null;
    score: number | null;
    scoredBy: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    background: string | null;
    season: SeasonName | null;
    year: number | null;
    studios: string[];
    genres: string[];
    themes: string[];
    demographics: string[];
}

export interface SeasonArchiveYear {
    year: number;
    seasons: SeasonName[];
}

export interface SeasonalFeed {
    selection: SeasonSelection;
    anime: SeasonalAnime[];
    error: string | null;
}

export interface SeasonalArchivePage extends SeasonalFeed {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    totalItems: number;
    itemsPerPage: number;
}

export function buildSeasonHref(
    selection: SeasonSelection,
    page = 1,
): `/anime?${string}` {
    const params = new URLSearchParams({
        year: String(selection.year),
        season: selection.season,
    });

    if (page > 1) {
        params.set("page", String(page));
    }

    return `/anime?${params.toString()}`;
}
