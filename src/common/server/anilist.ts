import "server-only";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";
const ANILIST_HEADERS = {
    "Content-Type": "application/json",
    Accept: "application/json",
} as const;

interface AniListResponse<TData> {
    data?: TData;
    errors?: Array<{ message: string }>;
}

interface FetchAniListOptions {
    revalidate?: number;
}

export class AniListRequestError extends Error {
    readonly status: number;

    constructor(message: string, status = 502) {
        super(message);
        this.name = "AniListRequestError";
        this.status = status;
    }
}

export async function fetchAniList<
    TData,
    TVariables extends Record<string, unknown>,
>(query: string, variables: TVariables, options: FetchAniListOptions = {}) {
    const response = await fetch(ANILIST_ENDPOINT, {
        method: "POST",
        headers: ANILIST_HEADERS,
        body: JSON.stringify({ query, variables }),
        next: options.revalidate
            ? { revalidate: options.revalidate }
            : undefined,
    });

    if (!response.ok) {
        throw new AniListRequestError(
            `AniList request failed with status ${response.status}.`,
            response.status,
        );
    }

    const payload = (await response.json()) as AniListResponse<TData>;
    const [firstError] = payload.errors ?? [];

    if (firstError) {
        throw new AniListRequestError(firstError.message);
    }

    if (!payload.data) {
        throw new AniListRequestError("AniList returned no data.");
    }

    return payload.data;
}
