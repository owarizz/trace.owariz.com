const JSON_CONTENT_TYPE = "application/json";

export class BrowserRequestError extends Error {
    readonly status: number | null;

    constructor(message: string, status: number | null = null) {
        super(message);
        this.name = "BrowserRequestError";
        this.status = status;
    }
}

interface UploadJsonOptions {
    onUploadProgress?: (percent: number) => void;
    signal?: AbortSignal;
}

function withJsonAcceptHeader(headers?: HeadersInit) {
    const resolvedHeaders = new Headers(headers);

    if (!resolvedHeaders.has("Accept")) {
        resolvedHeaders.set("Accept", JSON_CONTENT_TYPE);
    }

    return resolvedHeaders;
}

function extractErrorMessage(payload: unknown) {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    if ("error" in payload && typeof payload.error === "string") {
        return payload.error;
    }

    if ("message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return null;
}

async function buildResponseError(response: Response) {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes(JSON_CONTENT_TYPE)) {
        const payload = await response.json().catch(() => null);
        const message =
            extractErrorMessage(payload) ??
            `Request failed with status ${response.status}.`;

        return new BrowserRequestError(message, response.status);
    }

    return new BrowserRequestError(
        `Request failed with status ${response.status}.`,
        response.status,
    );
}

export async function requestJson<T>(
    input: RequestInfo | URL,
    init?: RequestInit,
) {
    const response = await fetch(input, {
        ...init,
        headers: withJsonAcceptHeader(init?.headers),
    });

    if (!response.ok) {
        throw await buildResponseError(response);
    }

    return (await response.json()) as T;
}

function parseXhrResponse<T>(request: XMLHttpRequest) {
    if (request.response && typeof request.response === "object") {
        return request.response as T;
    }

    if (request.responseText) {
        return JSON.parse(request.responseText) as T;
    }

    return null;
}

export function uploadFormDataJson<T>(
    url: string,
    formData: FormData,
    options: UploadJsonOptions = {},
) {
    return new Promise<T>((resolve, reject) => {
        const request = new XMLHttpRequest();

        const cleanup = () => {
            options.signal?.removeEventListener("abort", handleAbort);
        };

        const handleAbort = () => {
            request.abort();
        };

        if (options.signal?.aborted) {
            reject(new DOMException("The request was aborted.", "AbortError"));
            return;
        }

        request.open("POST", url);
        request.responseType = "json";
        request.setRequestHeader("Accept", JSON_CONTENT_TYPE);

        request.upload.onprogress = (event) => {
            if (!event.lengthComputable || event.total <= 0) {
                return;
            }

            options.onUploadProgress?.(
                Math.round((event.loaded * 100) / event.total),
            );
        };

        request.onload = () => {
            cleanup();

            try {
                const payload = parseXhrResponse<T | Record<string, unknown>>(
                    request,
                );

                if (request.status >= 200 && request.status < 300 && payload) {
                    resolve(payload as T);
                    return;
                }

                reject(
                    new BrowserRequestError(
                        extractErrorMessage(payload) ??
                            `Request failed with status ${request.status}.`,
                        request.status,
                    ),
                );
            } catch {
                reject(
                    new BrowserRequestError(
                        "Received an invalid JSON response.",
                        request.status,
                    ),
                );
            }
        };

        request.onerror = () => {
            cleanup();
            reject(new BrowserRequestError("Network request failed."));
        };

        request.onabort = () => {
            cleanup();
            reject(new DOMException("The request was aborted.", "AbortError"));
        };

        options.signal?.addEventListener("abort", handleAbort, { once: true });
        request.send(formData);
    });
}

export function isAbortError(error: unknown): error is DOMException {
    return error instanceof DOMException && error.name === "AbortError";
}
