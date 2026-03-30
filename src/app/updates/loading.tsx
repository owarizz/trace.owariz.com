export default function Loading() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute top-[-18%] left-[8%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/7 blur-[120px]" />
                <div className="absolute top-[12%] right-[-8%] h-[30rem] w-[30rem] rounded-full bg-amber-400/8 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-16">
                <div className="mb-8 h-8 w-32 rounded-full animate-shimmer" />
                <div className="mb-4 h-14 max-w-3xl rounded-2xl animate-shimmer" />
                <div className="mb-10 h-5 max-w-2xl rounded-xl animate-shimmer" />

                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    {["stats-1", "stats-2", "stats-3"].map((key) => (
                        <div key={key} className="glass-card p-5">
                            <div className="mb-3 h-3 w-20 rounded animate-shimmer" />
                            <div className="h-8 w-24 rounded animate-shimmer" />
                            <div className="mt-2 h-3 w-40 rounded animate-shimmer" />
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    {["commit-1", "commit-2", "commit-3"].map((key) => (
                        <div key={key} className="glass-card p-5">
                            <div className="mb-4 flex items-center gap-4">
                                <div className="size-10 rounded-full animate-shimmer" />
                                <div className="space-y-2">
                                    <div className="h-3 w-20 rounded animate-shimmer" />
                                    <div className="h-5 w-72 rounded animate-shimmer" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded animate-shimmer" />
                                <div className="h-3 w-5/6 rounded animate-shimmer" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
