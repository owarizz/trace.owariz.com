export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="relative size-10">
                <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
                <div className="absolute inset-0 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-neutral-500 tracking-wide">Loading...</p>
        </div>
    );
}
