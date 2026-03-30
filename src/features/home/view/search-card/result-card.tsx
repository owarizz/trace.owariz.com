"use client";

import { useState, useRef, useEffect } from "react";
import {
    ExternalLink,
    Play,
    Clock,
    Percent,
    Star,
    Volume2,
    VolumeX,
    Copy,
    Check,
} from "lucide-react";
import { toast } from "sonner";
import type { SearchResult, AnilistInfo } from "../../controller";

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function getAnimeTitle(anilist: SearchResult["anilist"]): string {
    if (typeof anilist === "number") return `Anilist #${anilist}`;
    const info = anilist as AnilistInfo;
    return (
        info.title.english ??
        info.title.romaji ??
        info.title.native ??
        `Anilist #${info.id}`
    );
}

function getAnilistId(anilist: SearchResult["anilist"]): number {
    return typeof anilist === "number" ? anilist : (anilist as AnilistInfo).id;
}

function getSimilarityColor(sim: number): string {
    if (sim >= 0.9) return "text-emerald-400";
    if (sim >= 0.8) return "text-amber-400";
    return "text-red-400";
}

function getSimilarityBg(sim: number): string {
    if (sim >= 0.9) return "bg-emerald-400/10";
    if (sim >= 0.8) return "bg-amber-400/10";
    return "bg-red-400/10";
}

function getSimilarityLabel(sim: number): string {
    if (sim >= 0.95) return "Excellent match";
    if (sim >= 0.9) return "Great match";
    if (sim >= 0.8) return "Good match";
    return "Low confidence";
}

interface ResultCardProps {
    result: SearchResult;
    index: number;
    isBestMatch?: boolean;
}

export function ResultCard({ result, index, isBestMatch }: ResultCardProps) {
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const title = getAnimeTitle(result.anilist);
    const anilistId = getAnilistId(result.anilist);
    const simPct = Math.round(result.similarity * 100);

    const handleCopy = () => {
        const text = `🎯 Found: ${title}${result.episode ? ` [Ep. ${result.episode}]` : ""}
Confidence: ${(result.similarity * 100).toFixed(1)}%
Match it at: https://anilist.co/anime/${anilistId}`;

        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            toast.success("Result copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div
            className={`glass-card noise relative overflow-hidden animate-fade-in-up group ${
                isBestMatch ? "ring-1 ring-(--accent)/30" : ""
            }`}
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            {/* Best match ribbon */}
            {isBestMatch && (
                <div className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-bl-lg bg-(--accent) px-2.5 py-1">
                    <Star className="size-3 text-white fill-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        Best Match
                    </span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row">
                {/* Preview thumbnail / video */}
                <div className="relative shrink-0 sm:w-52 h-40 sm:h-auto overflow-hidden bg-(--bg-elevated)">
                    {showVideo ? (
                        <>
                            <video
                                src={`${result.video}?size=l${isMuted ? "&mute" : ""}`}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                // @ts-expect-error — referrerPolicy is valid on <video> but missing from React's type definitions
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={() => setShowVideo(false)}
                            />
                            {/* Video controls overlay */}
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="flex items-center justify-center size-7 rounded-md bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? (
                                        <VolumeX className="size-3.5" />
                                    ) : (
                                        <Volume2 className="size-3.5" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowVideo(false)}
                                    className="flex items-center justify-center rounded-md bg-black/50 backdrop-blur-sm px-2 py-1 text-[10px] text-white/80 font-medium hover:text-white transition-colors"
                                >
                                    Image
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <img
                                src={`${result.image}?size=l`}
                                alt={title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading={index < 3 ? "eager" : "lazy"}
                            />
                            {/* Play overlay */}
                            <button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                aria-label="Play preview"
                            >
                                <div className="flex items-center justify-center size-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 transition-transform group-hover:scale-110">
                                    <Play className="size-4.5 text-white ml-0.5" />
                                </div>
                            </button>
                        </>
                    )}

                    {/* Similarity badge */}
                    <div
                        className={`absolute top-2 left-2 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold tabular-nums backdrop-blur-md ${getSimilarityBg(result.similarity)} ${getSimilarityColor(result.similarity)}`}
                    >
                        <Percent className="size-2.5" />
                        {simPct}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
                    <div>
                        {/* Title */}
                        <h3 className="text-sm font-semibold text-(--text-primary) leading-snug line-clamp-2">
                            {title}
                        </h3>

                        {/* Native title if available */}
                        {typeof result.anilist !== "number" &&
                            (result.anilist as AnilistInfo).title.native && (
                                <p className="text-xs text-(--text-muted) mt-0.5 truncate">
                                    {
                                        (result.anilist as AnilistInfo).title
                                            .native
                                    }
                                </p>
                            )}

                        {/* Similarity label */}
                        <p
                            className={`text-[10px] font-medium mt-1.5 ${getSimilarityColor(result.similarity)}`}
                        >
                            {getSimilarityLabel(result.similarity)}
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                            {result.episode !== null && (
                                <span className="inline-flex items-center rounded-md bg-(--bg-elevated) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                                    EP {result.episode}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-(--text-muted)">
                                <Clock className="size-3" />
                                {formatTime(result.from)} –{" "}
                                {formatTime(result.to)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                        <a
                            href={`https://anilist.co/anime/${anilistId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                        >
                            <ExternalLink className="size-3" />
                            AniList
                        </a>
                        {!showVideo && (
                            <button
                                type="button"
                                onClick={() => setShowVideo(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                            >
                                <Play className="size-3" />
                                Preview
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95 ml-auto"
                        >
                            {isCopied ? (
                                <Check className="size-3 text-emerald-500" />
                            ) : (
                                <Copy className="size-3" />
                            )}
                            {isCopied ? "Copied" : "Share"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
