import { AlertTriangle, RefreshCw } from "lucide-react";

interface MeCardErrorProps {
    message: string;
    onRetry?: () => void;
}

export function MeCardError({ message, onRetry }: MeCardErrorProps) {
    return (
        <div className="glass-card relative overflow-hidden border-(--error-muted)">
            <div className="px-6 py-6 flex flex-col items-center text-center gap-4">
                {/* Error icon */}
                <div className="flex items-center justify-center size-12 rounded-full bg-(--error-muted)">
                    <AlertTriangle className="size-5 text-(--error)" />
                </div>

                {/* Message */}
                <div>
                    <p className="text-sm font-semibold text-(--text-primary) mb-1">
                        Something went wrong
                    </p>
                    <p className="text-xs text-(--text-muted) font-mono">
                        {message}
                    </p>
                </div>

                {/* Retry button */}
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 rounded-lg border border-(--border-default) bg-(--bg-glass) px-4 py-2 text-xs font-medium text-(--text-secondary) transition-all hover:border-(--border-strong) hover:bg-(--bg-glass-hover) hover:text-(--text-primary) active:scale-95"
                    >
                        <RefreshCw className="size-3" />
                        Try again
                    </button>
                )}
            </div>
        </div>
    );
}
