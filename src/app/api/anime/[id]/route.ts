import { NextResponse } from "next/server";

const DETAIL_QUERY = `
query AnimeDetail($id: Int!) {
  Media(id: $id, type: ANIME) {
    id
    title { romaji english native }
    bannerImage
    coverImage { extraLarge large color }
    description(asHtml: false)
    genres
    tags(sort: RANK_DESC) { name rank }
    episodes
    duration
    status
    season
    seasonYear
    format
    averageScore
    meanScore
    popularity
    studios(isMain: true) { nodes { id name } }
    nextAiringEpisode { episode timeUntilAiring }
    siteUrl
    trailer { id site }
    characters(role: MAIN, perPage: 6, sort: ROLE) {
      nodes { id name { full } image { medium } }
    }
    relations {
      edges {
        relationType(version: 2)
        node {
          id
          title { romaji english }
          coverImage { medium }
          format
          type
        }
      }
    }
  }
}
`;

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const animeId = Number.parseInt(id, 10);

    if (Number.isNaN(animeId)) {
        return NextResponse.json(
            { error: "Invalid anime ID" },
            { status: 400 },
        );
    }

    try {
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: DETAIL_QUERY,
                variables: { id: animeId },
            }),
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch anime details" },
                { status: 502 },
            );
        }

        const json = await response.json();
        const media = json?.data?.Media;

        if (!media) {
            return NextResponse.json(
                { error: "Anime not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(media);
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
