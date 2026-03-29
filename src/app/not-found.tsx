import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
            <div className="text-center space-y-1">
                <h1 className="text-7xl font-bold text-neutral-900 tabular-nums">
                    404
                </h1>
                <p className="text-sm text-neutral-500 tracking-wide">
                    Page not found
                </p>
            </div>

            <p className="text-sm text-neutral-400 max-w-sm text-center">
                The page you are looking for does not exist or has been moved.
            </p>

            <Link
                href="/"
                className="px-5 py-2.5 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
