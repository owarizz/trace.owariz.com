import { HomeRender } from "@/features/home/view/home-render";

interface HomePageProps {
    searchParams: Promise<{ url?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
    const { url: initialUrl } = await searchParams;

    return <HomeRender initialUrl={initialUrl} />;
}
