import { Loader2, X, AlertCircle, ImageIcon, Search } from "lucide-react";
import { SearchSkeleton } from "./skeleton";

export function FileErrorBanner({
    error,
    onClear,
}: {
    error: string;
    onClear: () => void;
}) {
    return (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 animate-fade-in">
            <AlertCircle className="size-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">{error}</p>
            <button
                type="button"
                onClick={onClear}
                className="ml-auto text-amber-400/60 hover:text-amber-400 transition-colors"
            >
                <X className="size-3.5" />
            </button>
        </div>
    );
}

export function LoadingView({ preview }: { preview: string | null }) {
    return (
        <div className="space-y-4">
            <div className="glass-card overflow-hidden animate-fade-in">
                <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {preview && (
                            <img
                                src={preview}
                                alt="Search preview"
                                referrerPolicy="no-referrer"
                                className="size-10 rounded-lg object-cover border border-(--border-subtle)"
                            />
                        )}
                        <div className="flex items-center gap-2.5">
                            <Loader2 className="size-4 text-(--accent) animate-spin" />
                            <span className="text-sm font-medium text-(--text-secondary)">
                                Searching across database...
                            </span>
                        </div>
                    </div>
                </div>
                <div className="h-0.5 w-full bg-(--bg-elevated) overflow-hidden">
                    <div className="h-full w-1/3 bg-(--accent) animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full" />
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
            <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-9 rounded-full bg-(--error-muted)">
                        <X className="size-4 text-(--error)" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-(--text-primary)">
                            Search failed
                        </p>
                        <p className="text-xs text-(--text-muted) font-mono mt-0.5">
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
                <ImageIcon className="size-8 mx-auto mb-3 text-(--text-faint)" />
                <p className="text-sm font-semibold text-(--text-primary) mb-1">
                    No matches found
                </p>
                <p className="text-xs text-(--text-muted) mb-5">
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
