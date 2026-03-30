import { Link } from "lucide-react";

interface UrlFormProps {
    urlInput: string;
    setUrlInput: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function UrlForm({ urlInput, setUrlInput, onSubmit }: UrlFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Link className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--text-muted)" />
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(event) => setUrlInput(event.target.value)}
                        placeholder="Paste image URL..."
                        className="w-full rounded-xl border border-(--border-default) bg-(--bg-glass) py-3 pr-4 pl-11 text-sm text-(--text-primary) outline-none transition-all placeholder:text-(--text-faint) focus:border-(--accent) focus:ring-1 focus:ring-(--accent-muted)"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="rounded-xl bg-(--accent) px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
