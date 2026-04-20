import "server-only";

const JIKAN_ENDPOINT = "https://api.jikan.moe/v4";

interface FetchJikanOptions {
    revalidate?: number;
}

export class JikanRequestError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "JikanRequestError";
        this.status = status;
    }
}

export async function fetchJikan<TResponse>(
    path: string,
    query: Record<string, boolean | number | string | null | undefined> = {},
    options: FetchJikanOptions = {},
) {
    const url = new URL(
        path.startsWith("/") ? path.slice(1) : path,
        `${JIKAN_ENDPOINT}/`,
    );

    for (const [key, value] of Object.entries(query)) {
        if (value === null || value === undefined || value === false) {
            continue;
        }

        url.searchParams.set(key, value === true ? "true" : String(value));
    }

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
        next: {
            revalidate: options.revalidate ?? 21600,
        },
    });

    if (!response.ok) {
        throw new JikanRequestError(
            `Jikan request failed with status ${response.status}.`,
            response.status,
        );
    }

    return (await response.json()) as TResponse;
}
