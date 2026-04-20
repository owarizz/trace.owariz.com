import { ArrowRight, Link } from "lucide-react";
import type { RefObject } from "react";

interface UrlFormProps {
    urlInput: string;
    inputRef: RefObject<HTMLInputElement | null>;
    setUrlInput: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function UrlForm({
    urlInput,
    inputRef,
    setUrlInput,
    onSubmit,
}: UrlFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="relative flex items-center overflow-hidden rounded-2xl border border-(--border-default) bg-(--bg-glass) transition-all focus-within:border-(--accent)/60 focus-within:shadow-[0_0_0_3px_rgba(129,140,248,0.08)]">
                <Link className="ml-4 size-4 shrink-0 text-(--text-faint)" />
                <input
                    ref={inputRef}
                    type="url"
                    value={urlInput}
                    onChange={(event) => setUrlInput(event.target.value)}
                    placeholder="Paste an image URL to identify..."
                    className="flex-1 bg-transparent py-3.5 pr-2 pl-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-faint)"
                />
                <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="mr-2 flex items-center gap-1.5 rounded-xl bg-(--accent) px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
                >
                    Search
                    <ArrowRight className="size-3.5" />
                </button>
            </div>
        </form>
    );
}
