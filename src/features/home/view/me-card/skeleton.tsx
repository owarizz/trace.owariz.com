export function MeCardSkeleton() {
    const statSkeletonKeys = [
        "priority",
        "concurrency",
        "quota",
        "quota-used",
    ] as const;

    return (
        <div className="glass-card relative overflow-hidden">
            {/* Header skeleton */}
            <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3.5">
                    <div className="size-10 rounded-full animate-shimmer" />
                    <div className="space-y-2">
                        <div className="h-3.5 w-32 rounded-md animate-shimmer" />
                        <div className="h-2.5 w-16 rounded-md animate-shimmer" />
                    </div>
                </div>
                <div className="size-8 rounded-lg animate-shimmer" />
            </div>

            {/* Divider */}
            <div className="h-px bg-(--border-subtle)" />

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4">
                {statSkeletonKeys.map((key, index) => (
                    <div
                        key={key}
                        className={`px-6 py-5 ${
                            index < 3 ? "border-r border-(--border-subtle)" : ""
                        }`}
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <div className="size-3.5 rounded animate-shimmer" />
                            <div className="h-2.5 w-14 rounded animate-shimmer" />
                        </div>
                        <div className="h-6 w-10 rounded-md animate-shimmer" />
                    </div>
                ))}
            </div>

            {/* Quota bar skeleton */}
            <div className="h-px bg-(--border-subtle)" />
            <div className="px-6 py-4">
                <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-2.5 w-20 rounded animate-shimmer" />
                        <div className="h-2.5 w-14 rounded animate-shimmer" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-(--bg-elevated)" />
                </div>
            </div>
        </div>
    );
}
