import { getCurrentSeasonAnime } from "@/features/airing/server/seasonal";
import { HomeRender } from "@/features/home/view/home-render";

interface HomePageProps {
    searchParams: Promise<{ url?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
    const [{ url: initialUrl }, recommendations] = await Promise.all([
        searchParams,
        getCurrentSeasonAnime(),
    ]);

    return (
        <HomeRender
            initialUrl={initialUrl}
            recommendationError={recommendations.error}
            recommendationSelection={recommendations.selection}
            recommendations={recommendations.anime}
        />
    );
}
