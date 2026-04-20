import { Clipboard, ImageIcon } from "lucide-react";
import type { RefObject } from "react";

interface UploadZoneProps {
    isDragging: boolean;
    zoneRef?: RefObject<HTMLButtonElement | null>;
    onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void;
    onDragLeave: () => void;
    onDrop: (event: React.DragEvent<HTMLButtonElement>) => void;
    onClick: () => void;
}

export function UploadZone({
    isDragging,
    zoneRef,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
}: UploadZoneProps) {
    return (
        <button
            ref={zoneRef}
            type="button"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onClick}
            className={`group relative flex w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border-2 border-dashed px-8 py-16 text-center transition-all duration-300 ${
                isDragging
                    ? "border-(--accent)/60 bg-(--accent-soft) shadow-[0_0_60px_-15px_rgba(129,140,248,0.4)]"
                    : "border-(--border-default) bg-(--bg-glass) hover:border-(--accent)/30 hover:bg-(--bg-glass-hover) hover:shadow-[0_0_40px_-15px_rgba(129,140,248,0.15)]"
            }`}
        >
            {isDragging && (
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-(--accent)/8 via-transparent to-violet-500/8" />
            )}

            <div
                className={`relative flex size-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                    isDragging
                        ? "scale-110 bg-(--accent-muted) shadow-[0_0_24px_rgba(129,140,248,0.4)]"
                        : "bg-(--bg-elevated) group-hover:scale-105 group-hover:bg-(--bg-elevated)"
                }`}
            >
                <ImageIcon
                    className={`size-7 transition-colors duration-300 ${
                        isDragging
                            ? "text-(--accent)"
                            : "text-(--text-muted) group-hover:text-(--text-secondary)"
                    }`}
                />
            </div>

            <div className="space-y-1.5">
                <p className="text-sm font-semibold text-(--text-primary)">
                    {isDragging
                        ? "Release to identify"
                        : "Drop an anime screenshot"}
                </p>
                <p className="text-xs leading-relaxed text-(--text-muted)">
                    or <span className="text-(--accent)">click to browse</span>{" "}
                    — images & video, up to 25 MB
                </p>
            </div>

            <div className="flex items-center gap-4 text-[10px] text-(--text-faint)">
                <span className="flex items-center gap-1.5">
                    <Clipboard className="size-3" />
                    Ctrl+V to paste
                </span>
                <span className="h-3 w-px bg-(--border-subtle)" />
                <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-(--border-subtle) bg-(--bg-elevated) px-1 py-0.5 font-mono text-[9px]">
                        /
                    </kbd>
                    search by URL
                </span>
            </div>
        </button>
    );
}
