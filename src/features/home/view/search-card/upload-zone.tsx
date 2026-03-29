import { ImageIcon, Clipboard } from "lucide-react";

interface UploadZoneProps {
    isDragging: boolean;
    dropZoneRef: any;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
}

export function UploadZone({
    isDragging,
    dropZoneRef,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
}: UploadZoneProps) {
    return (
        <div
            ref={dropZoneRef}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick();
            }}
            role="button"
            tabIndex={0}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-14 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                    ? "border-(--accent) bg-(--accent-soft) shadow-[0_0_40px_-10px_rgba(129,140,248,0.3)]"
                    : "border-(--border-default) bg-(--bg-glass) hover:border-(--border-strong) hover:bg-(--bg-glass-hover)"
            }`}
        >
            <div
                className={`flex items-center justify-center size-14 rounded-2xl transition-colors ${
                    isDragging
                        ? "bg-(--accent-muted) text-(--accent)"
                        : "bg-(--bg-elevated) text-(--text-muted)"
                }`}
            >
                <ImageIcon className="size-6" />
            </div>
            <div>
                <p className="text-sm font-semibold text-(--text-primary) mb-1">
                    {isDragging
                        ? "Drop your image here"
                        : "Drop an anime screenshot"}
                </p>
                <p className="text-xs text-(--text-muted) leading-relaxed">
                    or click to browse · max 25MB
                </p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
                <Clipboard className="size-3 text-(--text-faint)" />
                <span className="text-[10px] text-(--text-faint)">
                    Ctrl+V to paste from clipboard
                </span>
            </div>
        </div>
    );
}
