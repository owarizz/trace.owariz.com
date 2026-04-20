import { ImageIcon, RefreshCw, Search, X } from "lucide-react";
import { SearchSkeleton } from "./skeleton";

export function LoadingView({
    preview,
    uploadProgress = null,
}: {
    preview: string | null;
    uploadProgress?: number | null;
}) {
    const isUploading = uploadProgress !== null && uploadProgress < 100;

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--bg-glass) animate-fade-in">
                <div className="flex items-center gap-3 px-5 py-4">
                    {preview ? (
                        // biome-ignore lint/performance/noImgElement: preview can be object URL or arbitrary remote URL
                        <img
                            src={preview}
                            alt="Search preview"
                            referrerPolicy="no-referrer"
                            className="size-10 rounded-xl border border-(--border-subtle) object-cover"
                        />
                    ) : (
                        <div className="flex size-10 items-center justify-center rounded-xl bg-(--bg-elevated)">
                            <ImageIcon className="size-4 text-(--text-faint)" />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-(--text-primary)">
                            {isUploading
                                ? "Uploading image…"
                                : "Searching database…"}
                        </p>
                        <p className="mt-0.5 text-xs text-(--text-muted)">
                            {isUploading
                                ? `${uploadProgress}% complete`
                                : "Matching across millions of frames"}
                        </p>
                    </div>

                    <div className="size-5 shrink-0">
                        <div className="size-5 animate-spin rounded-full border-2 border-(--border-subtle) border-t-(--accent)" />
                    </div>
                </div>

                <div className="relative h-0.5 w-full overflow-hidden bg-(--bg-elevated)">
                    {isUploading ? (
                        <div
                            className="h-full bg-linear-to-r from-(--accent) to-violet-400 transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    ) : (
                        <div className="animate-scan h-full w-1/3 rounded-full bg-linear-to-r from-transparent via-(--accent) to-transparent" />
                    )}
                </div>
            </div>

            <SearchSkeleton />
        </div>
    );
}

export function ErrorView({
    error,
    resultsRef,
    onRetry,
}: {
    error: string;
    resultsRef: React.RefObject<HTMLDivElement | null>;
    onRetry: () => void;
}) {
    return (
        <div
            ref={resultsRef}
            className="overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 animate-fade-in"
        >
            <div className="flex items-center gap-4 px-5 py-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                    <X className="size-4.5 text-rose-400" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-(--text-primary)">
                        Search failed
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-(--text-muted)">
                        {error}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-xs font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary) active:scale-95"
                >
                    <RefreshCw className="size-3" />
                    Retry
                </button>
            </div>
        </div>
    );
}

export function EmptyView({
    resultsRef,
    onNewSearch,
}: {
    resultsRef: React.RefObject<HTMLDivElement | null>;
    onNewSearch: () => void;
}) {
    return (
        <div
            ref={resultsRef}
            className="overflow-hidden rounded-2xl border border-dashed border-(--border-default) bg-(--bg-glass) animate-fade-in"
        >
            <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-(--bg-elevated)">
                    <ImageIcon className="size-6 text-(--text-faint)" />
                </div>
                <p className="mb-1 text-sm font-semibold text-(--text-primary)">
                    No matches found
                </p>
                <p className="mb-6 max-w-xs text-xs leading-relaxed text-(--text-muted)">
                    Try a cleaner screenshot with a visible anime frame, or a
                    higher quality image
                </p>
                <button
                    type="button"
                    onClick={onNewSearch}
                    className="inline-flex items-center gap-2 rounded-xl bg-(--accent) px-5 py-2.5 text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                >
                    <Search className="size-3.5" />
                    Search another image
                </button>
            </div>
        </div>
    );
}
