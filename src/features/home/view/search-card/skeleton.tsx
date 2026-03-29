export function SearchSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={`search-skeleton-${i}`}
                    className="glass-card overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${i * 0.08}s` }}
                >
                    <div className="flex flex-col sm:flex-row">
                        {/* Thumbnail skeleton */}
                        <div className="shrink-0 sm:w-48 h-36 animate-shimmer" />

                        {/* Info skeleton */}
                        <div className="flex-1 px-5 py-4 space-y-3">
                            <div className="h-4 w-48 rounded-md animate-shimmer" />
                            <div className="h-3 w-32 rounded animate-shimmer" />
                            <div className="flex gap-4 mt-2">
                                <div className="h-3 w-16 rounded animate-shimmer" />
                                <div className="h-3 w-24 rounded animate-shimmer" />
                            </div>
                            <div className="h-7 w-20 rounded-lg animate-shimmer mt-2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
