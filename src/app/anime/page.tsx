import type { Metadata } from "next";
import {
    getCurrentSeason,
    getSeasonArchive,
    getSeasonArchivePage,
    isSeasonSelectionValid,
} from "@/features/airing/server/seasonal";
import type { SeasonName } from "@/features/airing/shared/seasonal";
import { SeasonAtlasRender } from "@/features/airing/view/season-atlas-render";

export const metadata: Metadata = {
    title: "Anime Atlas",
    description:
        "Browse anime across every available season from the seasonal archive.",
};

interface AnimeAtlasPageProps {
    searchParams: Promise<{
        page?: string;
        season?: string;
        year?: string;
    }>;
}

function normalizeSeason(value?: string): SeasonName | null {
    const normalized = value?.toLowerCase();

    return normalized === "winter" ||
        normalized === "spring" ||
        normalized === "summer" ||
        normalized === "fall"
        ? normalized
        : null;
}

export default async function AnimeAtlasPage({
    searchParams,
}: AnimeAtlasPageProps) {
    const [archive, params] = await Promise.all([
        getSeasonArchive(),
        searchParams,
    ]);

    const fallbackSelection = getCurrentSeason();
    const requestedSeason = normalizeSeason(params.season);
    const requestedYear = Number.parseInt(params.year ?? "", 10);
    const requestedPage = Number.parseInt(params.page ?? "1", 10);

    const selected =
        requestedSeason && Number.isFinite(requestedYear)
            ? {
                  year: requestedYear,
                  season: requestedSeason,
              }
            : fallbackSelection;

    const selection = isSeasonSelectionValid(archive, selected)
        ? selected
        : fallbackSelection;

    const page =
        Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const feed = await getSeasonArchivePage(selection, page);

    return <SeasonAtlasRender archive={archive} feed={feed} />;
}
