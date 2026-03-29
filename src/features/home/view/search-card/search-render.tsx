"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Link, Scissors, X, Search, ArrowUp } from "lucide-react";
import { useSearch } from "../../controller";
import { ResultList } from "./result-list";
import { UploadZone } from "./upload-zone";
import { UrlForm } from "./url-form";
import { FileErrorBanner, LoadingView, ErrorView, EmptyView } from "./status-views";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function SearchRender() {
    const { data, error, loading, uploadProgress, searchByFile, searchByUrl, reset } =
        useSearch();

    const [mode, setMode] = useState<"upload" | "url">("upload");
    const [urlInput, setUrlInput] = useState("");
    const [cutBorders, setCutBorders] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const dropZoneRef = useRef<any>(null);

    const handleFile = useCallback(
        (file: File) => {
            setFileError(null);

            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {
                setFileError("Unsupported file type. Use images or videos.");
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setFileError(
                    `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 25MB.`,
                );
                return;
            }

            // Show preview for images
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => setPreview(e.target?.result as string);
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }

            searchByFile(file, { cutBorders, anilistInfo: true });
        },
        [searchByFile, cutBorders],
    );

    // Auto-scroll to results when they appear
    useEffect(() => {
        if ((data || error) && !loading && resultsRef.current) {
            resultsRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [data, error, loading]);

    // Global paste handler (Ctrl+V)
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleFile(file);
                    return;
                }
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [handleFile]);

    // Global drag-and-drop layout
    useEffect(() => {
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer?.types.includes("Files")) {
                setMode("upload");
                setIsDragging(true);
            }
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            // Prevents flicker when dragging over child elements
            if (e.relatedTarget === null || e.clientX === 0 || e.clientY === 0) {
                setIsDragging(false);
            }
        };

        const handleDropGlobal = (e: DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer?.files?.[0];
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

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile],
    );

    const handleUrlSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!urlInput.trim()) return;
            setPreview(urlInput.trim());
            setFileError(null);
            searchByUrl(urlInput.trim(), { cutBorders, anilistInfo: true });
        },
        [searchByUrl, urlInput, cutBorders],
    );

    const handleClear = useCallback(() => {
        reset();
        setPreview(null);
        setUrlInput("");
        setFileError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [reset]);

    const handleNewSearch = useCallback(() => {
        reset();
        setPreview(null);
        setUrlInput("");
        setFileError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
            dropZoneRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 50);
    }, [reset]);

    const hasResults = data && data.result.length > 0;
    const showUploadZone = !loading && !hasResults && !error;

    return (
        <div className="space-y-6">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            {showUploadZone && (
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1 rounded-xl bg-(--bg-glass) border border-(--border-subtle) p-1">
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

                    <label className="inline-flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={cutBorders}
                                onChange={(e) =>
                                    setCutBorders(e.target.checked)
                                }
                                className="peer sr-only"
                            />
                            <div className="size-4 rounded border border-(--border-default) bg-(--bg-glass) transition-all peer-checked:bg-(--accent) peer-checked:border-(--accent)" />
                            <Scissors className="absolute inset-0 m-auto size-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs text-(--text-muted) group-hover:text-(--text-secondary) transition-colors">
                            Cut borders
                        </span>
                    </label>
                </div>
            )}

            {showUploadZone && mode === "upload" && (
                <UploadZone
                    isDragging={isDragging}
                    dropZoneRef={dropZoneRef}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                />
            )}

            {showUploadZone && mode === "url" && (
                <UrlForm
                    urlInput={urlInput}
                    setUrlInput={setUrlInput}
                    onSubmit={handleUrlSubmit}
                    dropZoneRef={dropZoneRef}
                />
            )}

            {fileError && (
                <FileErrorBanner
                    error={fileError}
                    onClear={() => setFileError(null)}
                />
            )}

            {loading && <LoadingView preview={preview} uploadProgress={uploadProgress} />}

            {error && !loading && (
                <ErrorView
                    error={error}
                    resultsRef={resultsRef}
                    onRetry={handleNewSearch}
                />
            )}

            {hasResults && !loading && (
                <div ref={resultsRef} className="space-y-5 animate-fade-in-up">
                    <div className="glass-card overflow-hidden">
                        <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Searched image"
                                        referrerPolicy="no-referrer"
                                        className="size-9 rounded-lg object-cover border border-(--border-subtle)"
                                    />
                                )}
                                <div>
                                    <span className="text-xs font-semibold text-(--text-primary)">
                                        {data.result.length} result
                                        {data.result.length !== 1 ? "s" : ""}
                                    </span>
                                    <span className="text-[10px] text-(--text-faint) ml-2 tabular-nums">
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
