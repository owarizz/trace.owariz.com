import "server-only";
import { fetchAniList } from "@/common/server/anilist";

export interface AiringAnime {
    id: number;
    title: {
        english: string | null;
        romaji: string | null;
    };
    coverImage: {
        large: string | null;
        color: string | null;
    };
    episodes: number | null;
    nextAiringEpisode: {
        episode: number;
        timeUntilAiring: number;
    } | null;
    meanScore: number | null;
    format: string | null;
}

function getCurrentSeason(): "WINTER" | "SPRING" | "SUMMER" | "FALL" {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return "WINTER";
    if (month <= 6) return "SPRING";
    if (month <= 9) return "SUMMER";
    return "FALL";
}

const AIRING_QUERY = `
query ($season: MediaSeason, $seasonYear: Int) {
    Page(page: 1, perPage: 12) {
        media(
            season: $season
            seasonYear: $seasonYear
            type: ANIME
            status: RELEASING
            sort: POPULARITY_DESC
            isAdult: false
        ) {
            id
            title { english romaji }
            coverImage { large color }
            episodes
            nextAiringEpisode { episode timeUntilAiring }
            meanScore
            format
        }
    }
}
`;

interface AiringQueryResponse {
    Page: {
        media: AiringAnime[];
    };
}

export async function getAiringAnime(): Promise<AiringAnime[]> {
    const season = getCurrentSeason();
    const seasonYear = new Date().getFullYear();

    try {
        const data = await fetchAniList<
            AiringQueryResponse,
            { season: ReturnType<typeof getCurrentSeason>; seasonYear: number }
        >(AIRING_QUERY, { season, seasonYear }, { revalidate: 3600 });

        return data.Page.media ?? [];
    } catch {
        return [];
    }
}
