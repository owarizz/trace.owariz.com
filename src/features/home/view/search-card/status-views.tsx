import { ImageIcon, Loader2, Search, X } from "lucide-react";
import { SearchSkeleton } from "./skeleton";

export function LoadingView({
    preview,
    uploadProgress = null,
}: {
    preview: string | null;
    uploadProgress?: number | null;
}) {
    return (
        <div className="space-y-4">
            <div className="glass-card overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        {preview && (
                            <>
                                {/* biome-ignore lint/performance/noImgElement: Arbitrary preview URLs include object URLs and user-provided remotes. */}
                                <img
                                    src={preview}
                                    alt="Search preview"
                                    referrerPolicy="no-referrer"
                                    className="size-10 rounded-lg border border-(--border-subtle) object-cover"
                                />
                            </>
                        )}
                        <div className="flex items-center gap-2.5">
                            <Loader2 className="size-4 animate-spin text-(--accent)" />
                            <span className="text-sm font-medium text-(--text-secondary)">
                                {uploadProgress !== null && uploadProgress < 100
                                    ? `Uploading image... ${uploadProgress}%`
                                    : "Searching across database..."}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative h-0.5 w-full overflow-hidden bg-(--bg-elevated)">
                    {uploadProgress !== null ? (
                        <div
                            className="h-full bg-(--accent) transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    ) : (
                        <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-(--accent)" />
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
            className="glass-card overflow-hidden border-(--error-muted) animate-fade-in"
        >
            <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-(--error-muted)">
                        <X className="size-4 text-(--error)" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-(--text-primary)">
                            Search failed
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-(--text-muted)">
                            {error}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg border border-(--border-default) bg-(--bg-glass) px-3 py-1.5 text-xs font-medium text-(--text-secondary) transition-all hover:bg-(--bg-glass-hover) active:scale-95"
                >
                    Try again
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
            className="glass-card overflow-hidden animate-fade-in"
        >
            <div className="px-6 py-10 text-center">
                <ImageIcon className="mx-auto mb-3 size-8 text-(--text-faint)" />
                <p className="mb-1 text-sm font-semibold text-(--text-primary)">
                    No matches found
                </p>
                <p className="mb-5 text-xs text-(--text-muted)">
                    Try a different screenshot or a higher quality image
                </p>
                <button
                    type="button"
                    onClick={onNewSearch}
                    className="inline-flex items-center gap-2 rounded-xl bg-(--accent) px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                >
                    <Search className="size-3.5" />
                    Search again
                </button>
            </div>
        </div>
    );
}
