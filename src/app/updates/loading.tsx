export default function Loading() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-[30%] -left-[10%] h-[60vh] w-[50vw] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute -right-[15%] top-[10%] h-[50vh] w-[40vw] rounded-full bg-violet-500/4 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 sm:py-16">
                {/* Nav */}
                <div className="mb-10 flex items-center justify-between">
                    <div className="h-5 w-14 rounded-lg animate-shimmer" />
                    <div className="h-4 w-40 rounded-lg animate-shimmer" />
                </div>

                {/* Badge + title */}
                <div className="mb-2 h-6 w-48 rounded-full animate-shimmer" />
                <div className="mt-5 h-10 w-36 rounded-xl animate-shimmer" />

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="h-4 w-16 rounded animate-shimmer" />
                    <div className="h-4 w-16 rounded animate-shimmer" />
                    <div className="h-4 w-20 rounded animate-shimmer" />
                </div>

                {/* Release */}
                <div className="mt-8 mb-8">
                    <div className="mb-3 h-3 w-28 rounded animate-shimmer" />
                    <div className="rounded-xl border border-(--border-subtle) px-5 py-4">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-12 rounded-md animate-shimmer" />
                            <div className="h-5 w-32 rounded animate-shimmer" />
                        </div>
                        <div className="mt-2 h-4 w-full rounded animate-shimmer" />
                    </div>
                </div>

                {/* Commits */}
                <div className="mb-3 h-3 w-28 rounded animate-shimmer" />
                <div className="overflow-hidden rounded-xl border border-(--border-subtle)">
                    {["c1", "c2", "c3", "c4", "c5", "c6"].map((k, i, arr) => (
                        <div
                            key={k}
                            className={`flex items-center gap-3 px-3 py-2.5 ${i < arr.length - 1 ? "border-b border-(--border-subtle)" : ""}`}
                        >
                            <div className="size-5 rounded-full animate-shimmer shrink-0" />
                            <div className="h-4 w-10 rounded animate-shimmer shrink-0" />
                            <div
                                className="h-4 flex-1 rounded animate-shimmer"
                                style={{ maxWidth: `${60 + (i % 3) * 15}%` }}
                            />
                            <div className="h-3 w-12 rounded animate-shimmer shrink-0" />
                            <div className="h-3 w-16 rounded animate-shimmer shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
