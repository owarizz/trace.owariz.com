import { getAiringAnime } from "@/features/airing";
import { HomeRender } from "@/features/home";

interface HomePageProps {
    searchParams: Promise<{ url?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
    const [{ url: initialUrl }, airingAnime] = await Promise.all([
        searchParams,
        getAiringAnime(),
    ]);

    return <HomeRender initialUrl={initialUrl} airingAnime={airingAnime} />;
}
