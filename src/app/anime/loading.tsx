export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <div className="mb-8 h-6 w-32 animate-pulse rounded-full bg-white/8" />

            <div className="mb-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="h-48 animate-pulse rounded-[2rem] bg-white/6" />
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="h-24 animate-pulse rounded-2xl bg-white/6" />
                    <div className="h-24 animate-pulse rounded-2xl bg-white/6" />
                    <div className="h-24 animate-pulse rounded-2xl bg-white/6" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
                <div className="h-[32rem] animate-pulse rounded-[1.75rem] bg-white/6" />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from(
                        { length: 6 },
                        (_, index) => `card-${index + 1}`,
                    ).map((key) => (
                        <div
                            key={key}
                            className="overflow-hidden rounded-[1.75rem] bg-white/6"
                        >
                            <div className="aspect-[16/10] animate-pulse bg-white/8" />
                            <div className="space-y-3 p-4">
                                <div className="h-5 w-3/4 animate-pulse rounded bg-white/8" />
                                <div className="h-16 animate-pulse rounded bg-white/6" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-14 animate-pulse rounded-xl bg-white/8" />
                                    <div className="h-14 animate-pulse rounded-xl bg-white/8" />
                                    <div className="h-14 animate-pulse rounded-xl bg-white/8" />
                                    <div className="h-14 animate-pulse rounded-xl bg-white/8" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
