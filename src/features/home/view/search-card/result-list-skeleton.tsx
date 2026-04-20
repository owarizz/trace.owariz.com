const SKELETON_ITEMS = ["result-1", "result-2", "result-3"] as const;

export function ResultListSkeleton() {
    return (
        <div className="space-y-4">
            {SKELETON_ITEMS.map((key) => (
                <div
                    key={key}
                    className="glass-card overflow-hidden border-(--border-subtle)"
                >
                    <div className="flex flex-col sm:flex-row">
                        <div className="h-40 shrink-0 animate-shimmer sm:h-48 sm:w-52" />
                        <div className="flex flex-1 flex-col gap-4 px-5 py-4">
                            <div className="space-y-2">
                                <div className="h-4 w-2/3 rounded-md animate-shimmer" />
                                <div className="h-3 w-1/3 rounded-md animate-shimmer" />
                                <div className="h-3 w-24 rounded-md animate-shimmer" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-7 w-20 rounded-lg animate-shimmer" />
                                <div className="h-7 w-20 rounded-lg animate-shimmer" />
                                <div className="h-7 w-20 rounded-lg animate-shimmer" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
