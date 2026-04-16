"use client";

import { ArrowUp, Link, Scissors, Search, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSearch } from "../../controller";
import { RecentHistory } from "./recent-history";
import { ResultList } from "./result-list";
import { EmptyView, ErrorView, LoadingView } from "./status-views";
import { UploadZone } from "./upload-zone";
import { UrlForm } from "./url-form";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

interface SearchRenderProps {
    initialUrl?: string;
}

export function SearchRender({ initialUrl }: SearchRenderProps) {
    const {
        data,
        error,
        loading,
        uploadProgress,
        history,
        historyLoaded,
        clearHistory,
        searchByFile,
        searchByUrl,
        reset,
    } = useSearch();

    const [mode, setMode] = useState<"upload" | "url">("upload");
    const [urlInput, setUrlInput] = useState("");
    const [cutBorders, setCutBorders] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [pendingUrlFocus, setPendingUrlFocus] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const urlInputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const dropZoneRef = useRef<HTMLButtonElement>(null);
    const urlModeRef = useRef<HTMLDivElement>(null);
    const objectUrlRef = useRef<string | null>(null);
    const initialUrlFiredRef = useRef(false);

    const clearPreviewUrl = useCallback(() => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
    }, []);

    const resetLocalUi = useCallback(() => {
        clearPreviewUrl();
        setPreview(null);
        setUrlInput("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [clearPreviewUrl]);

    // ── Handlers (defined before useEffects that depend on them) ──────────

    const handleNewSearch = useCallback(() => {
        reset();
        resetLocalUi();
        window.history.replaceState(null, "", window.location.pathname);
        window.setTimeout(() => {
            const el = dropZoneRef.current ?? urlModeRef.current;
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
    }, [reset, resetLocalUi]);

    const handleClear = useCallback(() => {
        reset();
        resetLocalUi();
    }, [reset, resetLocalUi]);

    const handleFile = useCallback(
        (file: File) => {
            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {
                toast.error("Unsupported file type. Use images or videos.");
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast.error(
                    `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 25MB.`,
                );
                return;
            }
            clearPreviewUrl();
            if (file.type.startsWith("image/")) {
                const objectUrl = URL.createObjectURL(file);
                objectUrlRef.current = objectUrl;
                setPreview(objectUrl);
            } else {
                setPreview(null);
            }
            searchByFile(file, { cutBorders, anilistInfo: true });
        },
        [clearPreviewUrl, cutBorders, searchByFile],
    );

    const handleDrop = useCallback(
        (event: React.DragEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleUrlSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const nextUrl = urlInput.trim();
            if (!nextUrl) return;
            clearPreviewUrl();
            setPreview(nextUrl);
            searchByUrl(nextUrl, { cutBorders, anilistInfo: true });
            // Update browser URL for shareability via ?url=
            window.history.replaceState(
                null,
                "",
                `?${new URLSearchParams({ url: nextUrl }).toString()}`,
            );
        },
        [clearPreviewUrl, cutBorders, searchByUrl, urlInput],
    );

    // ── Effects ───────────────────────────────────────────────────────────

    // Auto-search from ?url= query param (shareable links)
    // biome-ignore lint/correctness/useExhaustiveDependencies: fires once on mount only
    useEffect(() => {
        if (initialUrl && !initialUrlFiredRef.current) {
            initialUrlFiredRef.current = true;
            setMode("url");
            setUrlInput(initialUrl);
            setPreview(initialUrl);
            searchByUrl(initialUrl, { cutBorders: false, anilistInfo: true });
        }
    }, []);

    // Focus URL input after switching to URL mode via keyboard shortcut
    useEffect(() => {
        if (pendingUrlFocus && mode === "url") {
            urlInputRef.current?.focus();
            setPendingUrlFocus(false);
        }
    }, [mode, pendingUrlFocus]);

    // Scroll to results when they appear
    useEffect(() => {
        if ((data || error) && !loading && resultsRef.current) {
            resultsRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [data, error, loading]);

    // Global paste handler
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleFile(file);
                    return;
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [handleFile]);

    // Global drag-and-drop handler
    useEffect(() => {
        const handleDragOver = (event: DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer?.types.includes("Files")) {
                setMode("upload");
                setIsDragging(true);
            }
        };
        const handleDragLeave = (event: DragEvent) => {
            event.preventDefault();
            if (
                event.relatedTarget === null ||
                event.clientX === 0 ||
                event.clientY === 0
            ) {
                setIsDragging(false);
            }
        };
        const handleDropGlobal = (event: DragEvent) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer?.files?.[0];
            if (file) handleFile(file);
        };
        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDropGlobal);
        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDropGlobal);
        };
    }, [handleFile]);

    // Keyboard shortcuts: "/" to URL search, "Escape" to reset
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const tag = (event.target as HTMLElement).tagName;
            const isInput =
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                (event.target as HTMLElement).isContentEditable;

            if (event.key === "/" && !isInput && !data && !error && !loading) {
                event.preventDefault();
                setMode("url");
                setPendingUrlFocus(true);
            }

            if (event.key === "Escape" && (data || error)) {
                handleNewSearch();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [data, error, loading, handleNewSearch]);

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            clearPreviewUrl();
        };
    }, [clearPreviewUrl]);

    // ── Render ────────────────────────────────────────────────────────────

    const hasResults = Boolean(data && data.result.length > 0);
    const showUploadZone = !loading && !hasResults && !error;

    return (
        <div className="space-y-6">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            {showUploadZone && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-xl border border-(--border-subtle) bg-(--bg-glass) p-1">
                        <button
                            type="button"
                            onClick={() => setMode("upload")}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                                mode === "upload"
                                    ? "bg-(--accent-muted) text-(--accent) shadow-sm"
                                    : "text-(--text-muted) hover:text-(--text-secondary)"
                            }`}
                        >
                            <Upload className="size-3.5" />
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("url")}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                                mode === "url"
                                    ? "bg-(--accent-muted) text-(--accent) shadow-sm"
                                    : "text-(--text-muted) hover:text-(--text-secondary)"
                            }`}
                        >
                            <Link className="size-3.5" />
                            URL
                        </button>
                    </div>

                    <label className="group inline-flex cursor-pointer items-center gap-2">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={cutBorders}
                                onChange={(event) =>
                                    setCutBorders(event.target.checked)
                                }
                                className="peer sr-only"
                            />
                            <div className="size-4 rounded border border-(--border-default) bg-(--bg-glass) transition-all peer-checked:border-(--accent) peer-checked:bg-(--accent)" />
                            <Scissors className="absolute inset-0 m-auto size-2.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <span className="text-xs text-(--text-muted) transition-colors group-hover:text-(--text-secondary)">
                            Cut borders
                        </span>
                    </label>
                </div>
            )}

            {showUploadZone && mode === "upload" && (
                <UploadZone
                    zoneRef={dropZoneRef}
                    isDragging={isDragging}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                />
            )}

            {showUploadZone && mode === "url" && (
                <div ref={urlModeRef}>
                    <UrlForm
                        urlInput={urlInput}
                        inputRef={urlInputRef}
                        setUrlInput={setUrlInput}
                        onSubmit={handleUrlSubmit}
                    />
                </div>
            )}

            {showUploadZone && historyLoaded && history.length > 0 && (
                <RecentHistory history={history} onClear={clearHistory} />
            )}

            {loading && (
                <LoadingView
                    preview={preview}
                    uploadProgress={uploadProgress}
                />
            )}

            {error && !loading && (
                <ErrorView
                    error={error}
                    resultsRef={resultsRef}
                    onRetry={handleNewSearch}
                />
            )}

            {hasResults && data && !loading && (
                <div ref={resultsRef} className="space-y-5 animate-fade-in-up">
                    <div className="glass-card overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                            <div className="flex items-center gap-3">
                                {preview && (
                                    <>
                                        {/* biome-ignore lint/performance/noImgElement: preview can be object URL or arbitrary remote URL */}
                                        <img
                                            src={preview}
                                            alt="Search preview"
                                            referrerPolicy="no-referrer"
                                            className="size-9 rounded-lg border border-(--border-subtle) object-cover"
                                        />
                                    </>
                                )}
                                <div>
                                    <span className="text-xs font-semibold text-(--text-primary)">
                                        {data.result.length} result
                                        {data.result.length !== 1 ? "s" : ""}
                                    </span>
                                    <span className="ml-2 text-[10px] tabular-nums text-(--text-faint)">
                                        {data.frameCount.toLocaleString()}{" "}
                                        frames
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-(--accent) px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                                >
                                    <Search className="size-3" />
                                    New search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                                >
                                    <X className="size-3" />
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    <ResultList results={data.result} />

                    <div className="flex justify-center pt-2">
                        <button
                            type="button"
                            onClick={handleNewSearch}
                            className="inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-glass) px-5 py-2.5 text-xs font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                        >
                            <ArrowUp className="size-3.5" />
                            Search another image
                        </button>
                    </div>
                </div>
            )}

            {data && data.result.length === 0 && !loading && (
                <EmptyView
                    resultsRef={resultsRef}
                    onNewSearch={handleNewSearch}
                />
            )}
        </div>
    );
}
