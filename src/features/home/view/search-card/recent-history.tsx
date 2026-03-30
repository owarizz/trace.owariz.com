import { formatDistanceToNow } from "date-fns";
import { Clock, ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import type { HistoryItem } from "../../controller/history-hook";

interface RecentHistoryProps {
    history: HistoryItem[];
    onClear: () => void;
}

export function RecentHistory({ history, onClear }: RecentHistoryProps) {
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 animate-fade-in-up">
            <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-(--text-muted)">
                    <Clock className="size-3.5" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                        Recent Searches
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onClear}
                    className="group flex items-center gap-1.5 text-[10px] font-medium text-(--text-faint) transition-colors hover:text-(--error)"
                >
                    <Trash2 className="size-3 transition-transform group-hover:scale-110" />
                    Clear
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {history.map((item) => (
                    <a
                        key={item.id}
                        href={`https://anilist.co/anime/${item.anilistId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-glass) p-2.5 transition-all hover:-translate-y-0.5 hover:border-(--border-default) hover:bg-(--bg-glass-hover)"
                    >
                        <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-(--bg-elevated)">
                            {item.coverImage ? (
                                <Image
                                    src={item.coverImage}
                                    alt={item.title}
                                    referrerPolicy="no-referrer"
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <ImageIcon className="size-6 text-(--text-faint)" />
                                </div>
                            )}
                            <div className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
                                {(item.similarity * 100).toFixed(0)}%
                            </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="line-clamp-2 text-xs font-semibold leading-tight text-(--text-primary) transition-colors group-hover:text-(--accent)">
                                {item.title}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-(--text-faint)">
                                {item.episode !== null && (
                                    <span className="rounded bg-(--bg-elevated) px-1 py-0.5 font-mono">
                                        EP: {item.episode}
                                    </span>
                                )}
                                <span>
                                    {formatDistanceToNow(item.timestamp, {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
