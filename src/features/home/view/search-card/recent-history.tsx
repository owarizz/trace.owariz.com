"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useBookmarkStore } from "../../controller/bookmark-store";
import type { HistoryItem } from "../../controller/history-hook";

function similarityBadgeClass(similarity: number) {
    if (similarity >= 0.87) return "bg-emerald-400/15 text-emerald-300 border-emerald-400/20";
    if (similarity >= 0.70) return "bg-amber-400/15 text-amber-300 border-amber-400/20";
    return "bg-rose-400/15 text-rose-300 border-rose-400/20";
}

interface RecentHistoryProps {
    history: HistoryItem[];
    onClear: () => void;
}

export function RecentHistory({ history, onClear }: RecentHistoryProps) {
    const openDetail = useBookmarkStore((state) => state.openDetail);

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 animate-fade-in-up">
            <div className="mb-3 flex items-center gap-2.5">
                <Clock className="size-3.5 text-(--text-muted)" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                    Recent Searches
                </span>
                <div className="h-px flex-1 bg-(--border-subtle)" />
                <button
                    type="button"
                    onClick={onClear}
                    className="group inline-flex items-center gap-1 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-2.5 py-1 text-[10px] font-medium text-(--text-faint) transition-all hover:border-rose-400/30 hover:text-(--error)"
                >
                    <Trash2 className="size-3" />
                    Clear
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {history.map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                            openDetail({
                                source: "history",
                                ...item,
                            })
                        }
                        className="group flex flex-col gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-glass) p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-(--border-default) hover:bg-(--bg-glass-hover)"
                    >
                        <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-(--bg-elevated)">
                            {item.coverImage ? (
                                <Image
                                    src={item.coverImage}
                                    alt={item.title}
                                    referrerPolicy="no-referrer"
                                    fill
                                    sizes="(max-width: 640px) 33vw, 20vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <ImageIcon className="size-6 text-(--text-faint)" />
                                </div>
                            )}
                            <div className={`absolute top-1.5 left-1.5 rounded-md border px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-md ${similarityBadgeClass(item.similarity)}`}>
                                {(item.similarity * 100).toFixed(0)}%
                            </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="line-clamp-2 text-xs font-semibold leading-tight text-(--text-primary)">
                                {item.title}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-(--text-faint)">
                                {item.episode !== null && (
                                    <span className="rounded border border-(--border-subtle) bg-(--bg-elevated) px-1.5 py-0.5 font-medium text-(--text-secondary)">
                                        EP {item.episode}
                                    </span>
                                )}
                                <span>
                                    {formatDistanceToNow(item.timestamp, {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
