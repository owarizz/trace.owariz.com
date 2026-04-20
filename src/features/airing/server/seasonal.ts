import "server-only";
import { fetchJikan } from "@/common/server/jikan";
import type {
    SeasonArchiveYear,
    SeasonalAnime,
    SeasonalArchivePage,
    SeasonalFeed,
    SeasonName,
    SeasonSelection,
} from "../shared/seasonal";

export type {
    SeasonArchiveYear,
    SeasonalAnime,
    SeasonalArchivePage,
    SeasonalFeed,
    SeasonName,
    SeasonSelection,
} from "../shared/seasonal";

interface JikanPagination {
    last_visible_page: number;
    has_next_page: boolean;
    current_page?: number;
    items?: {
        count: number;
        total: number;
        per_page: number;
    };
}

interface JikanImageVariant {
    image_url: string | null;
    small_image_url: string | null;
    large_image_url: string | null;
}

interface JikanImages {
    jpg?: JikanImageVariant | null;
    webp?: JikanImageVariant | null;
}

interface JikanNamedResource {
    mal_id: number;
    name: string;
}

interface JikanSeasonAnime {
    mal_id: number;
    url: string;
    images?: JikanImages | null;
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    title_synonyms: string[];
    type: string | null;
    source: string | null;
    episodes: number | null;
    status: string | null;
    airing: boolean;
    aired?: {
        from: string | null;
        to: string | null;
        string: string | null;
    } | null;
    duration: string | null;
    rating: string | null;
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    background: string | null;
    season: SeasonName | null;
    year: number | null;
    studios: JikanNamedResource[];
    genres: JikanNamedResource[];
    themes: JikanNamedResource[];
    demographics: JikanNamedResource[];
}

interface JikanSeasonArchiveYear {
    year: number;
    seasons: string[];
}

interface JikanSeasonArchiveResponse {
    data: JikanSeasonArchiveYear[];
}

interface JikanSeasonAnimeResponse {
    pagination: JikanPagination;
    data: JikanSeasonAnime[];
}

const SEASONS: SeasonName[] = ["winter", "spring", "summer", "fall"];

function normalizeSeasonName(value?: string | null): SeasonName | null {
    if (!value) return null;
    const normalized = value.toLowerCase();
    return SEASONS.includes(normalized as SeasonName)
        ? (normalized as SeasonName)
        : null;
}

function mapSeasonalAnime(item: JikanSeasonAnime): SeasonalAnime {
    return {
        id: item.mal_id,
        url: item.url,
        title: item.title,
        titleEnglish: item.title_english,
        titleJapanese: item.title_japanese,
        titleSynonyms: item.title_synonyms ?? [],
        imageUrl:
            item.images?.webp?.image_url ?? item.images?.jpg?.image_url ?? null,
        largeImageUrl:
            item.images?.webp?.large_image_url ??
            item.images?.jpg?.large_image_url ??
            item.images?.webp?.image_url ??
            item.images?.jpg?.image_url ??
            null,
        type: item.type,
        source: item.source,
        episodes: item.episodes,
        status: item.status,
        airing: item.airing,
        airedFrom: item.aired?.from ?? null,
        airedTo: item.aired?.to ?? null,
        airedLabel: item.aired?.string ?? null,
        duration: item.duration,
        rating: item.rating,
        score: item.score,
        scoredBy: item.scored_by,
        rank: item.rank,
        popularity: item.popularity,
        members: item.members,
        favorites: item.favorites,
        synopsis: item.synopsis,
        background: item.background,
        season: normalizeSeasonName(item.season),
        year: item.year,
        studios: item.studios.map((entry) => entry.name),
        genres: item.genres.map((entry) => entry.name),
        themes: item.themes.map((entry) => entry.name),
        demographics: item.demographics.map((entry) => entry.name),
    };
}

export function getCurrentSeason(date = new Date()): SeasonSelection {
    const month = date.getMonth() + 1;
    const season =
        month <= 3
            ? "winter"
            : month <= 6
              ? "spring"
              : month <= 9
                ? "summer"
                : "fall";

    return {
        year: date.getFullYear(),
        season,
    };
}

export function isSeasonSelectionValid(
    archive: SeasonArchiveYear[],
    selection: SeasonSelection,
) {
    return archive.some(
        (entry) =>
            entry.year === selection.year &&
            entry.seasons.includes(selection.season),
    );
}

export async function getSeasonArchive(): Promise<SeasonArchiveYear[]> {
    try {
        const response = await fetchJikan<JikanSeasonArchiveResponse>(
            "/seasons",
            {},
            { revalidate: 86400 },
        );

        return response.data.map((entry) => ({
            year: entry.year,
            seasons: entry.seasons
                .map((season) => normalizeSeasonName(season))
                .filter((season): season is SeasonName => season !== null),
        }));
    } catch {
        return [];
    }
}

export async function getCurrentSeasonAnime(limit = 12): Promise<SeasonalFeed> {
    const fallbackSelection = getCurrentSeason();

    try {
        const response = await fetchJikan<JikanSeasonAnimeResponse>(
            "/seasons/now",
            { sfw: true },
            { revalidate: 21600 },
        );
        const [firstAnime] = response.data;
        const selection =
            firstAnime?.year && firstAnime?.season
                ? {
                      year: firstAnime.year,
                      season: firstAnime.season,
                  }
                : fallbackSelection;

        return {
            selection,
            anime: response.data.map(mapSeasonalAnime).slice(0, limit),
            error: null,
        };
    } catch {
        return {
            selection: fallbackSelection,
            anime: [],
            error: "Could not load this season's recommendations right now.",
        };
    }
}

export async function getSeasonArchivePage(
    selection: SeasonSelection,
    page = 1,
): Promise<SeasonalArchivePage> {
    try {
        const response = await fetchJikan<JikanSeasonAnimeResponse>(
            `/seasons/${selection.year}/${selection.season}`,
            {
                page,
                sfw: true,
            },
            { revalidate: 21600 },
        );

        return {
            selection,
            page: response.pagination.current_page ?? page,
            totalPages: response.pagination.last_visible_page,
            hasNextPage: response.pagination.has_next_page,
            totalItems:
                response.pagination.items?.total ?? response.data.length,
            itemsPerPage:
                response.pagination.items?.per_page ?? response.data.length,
            anime: response.data.map(mapSeasonalAnime),
            error: null,
        };
    } catch {
        return {
            selection,
            page,
            totalPages: 1,
            hasNextPage: false,
            totalItems: 0,
            itemsPerPage: 0,
            anime: [],
            error: "Could not load anime for this season right now.",
        };
    }
}
