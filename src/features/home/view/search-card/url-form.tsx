import { Link } from "lucide-react";

interface UrlFormProps {
    urlInput: string;
    setUrlInput: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    dropZoneRef: any;
}

export function UrlForm({
    urlInput,
    setUrlInput,
    onSubmit,
    dropZoneRef,
}: UrlFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-3" ref={dropZoneRef}>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-(--text-muted)" />
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Paste image URL..."
                        className="w-full rounded-xl border border-(--border-default) bg-(--bg-glass) pl-11 pr-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-faint) outline-none transition-all focus:border-(--accent) focus:ring-1 focus:ring-(--accent-muted)"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="rounded-xl bg-(--accent) px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
