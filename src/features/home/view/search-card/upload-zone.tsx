import { Clipboard, ImageIcon } from "lucide-react";

interface UploadZoneProps {
    isDragging: boolean;
    onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void;
    onDragLeave: () => void;
    onDrop: (event: React.DragEvent<HTMLButtonElement>) => void;
    onClick: () => void;
}

export function UploadZone({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
}: UploadZoneProps) {
    return (
        <button
            type="button"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onClick}
            className={`relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all duration-300 ${
                isDragging
                    ? "border-(--accent) bg-(--accent-soft) shadow-[0_0_40px_-10px_rgba(129,140,248,0.3)]"
                    : "border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) hover:bg-(--bg-glass-hover)"
            }`}
        >
            <div
                className={`flex size-14 items-center justify-center rounded-2xl transition-colors ${
                    isDragging
                        ? "bg-(--accent-muted) text-(--accent)"
                        : "bg-(--bg-elevated) text-(--text-muted)"
                }`}
            >
                <ImageIcon className="size-6" />
            </div>
            <div>
                <p className="mb-1 text-sm font-semibold text-(--text-primary)">
                    {isDragging
                        ? "Drop your image here"
                        : "Drop an anime screenshot"}
                </p>
                <p className="text-xs leading-relaxed text-(--text-muted)">
                    or click to browse - max 25MB
                </p>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
                <Clipboard className="size-3 text-(--text-faint)" />
                <span className="text-[10px] text-(--text-faint)">
                    Ctrl+V to paste from clipboard
                </span>
            </div>
        </button>
    );
}
