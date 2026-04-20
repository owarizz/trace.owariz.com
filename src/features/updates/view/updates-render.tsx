import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    ArrowUpRight,
    GitCommitHorizontal,
    GitFork,
    Star,
    Tag,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { UpdatesCommit, UpdatesFeed } from "../server/github";

// ── Conventional-commit type parser ──────────────────────────────────────────

const COMMIT_TYPES: Record<string, { label: string; className: string }> = {
    feat: {
        label: "feat",
        className:
            "bg-(--accent-muted) text-(--accent) border-[rgba(129,140,248,0.25)]",
    },
    fix: {
        label: "fix",
        className: "bg-rose-400/10 text-rose-300 border-rose-400/20",
    },
    refactor: {
        label: "refactor",
        className: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    },
    perf: {
        label: "perf",
        className: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    },
    docs: {
        label: "docs",
        className: "bg-sky-400/10 text-sky-300 border-sky-400/20",
    },
    chore: {
        label: "chore",
        className:
            "bg-(--bg-elevated) text-(--text-faint) border-(--border-subtle)",
    },
    style: {
        label: "style",
        className: "bg-pink-400/10 text-pink-300 border-pink-400/20",
    },
    test: {
        label: "test",
        className: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
    },
    ci: {
        label: "ci",
        className: "bg-violet-400/10 text-violet-300 border-violet-400/20",
    },
    build: {
        label: "build",
        className: "bg-orange-400/10 text-orange-300 border-orange-400/20",
    },
    revert: {
        label: "revert",
        className: "bg-red-400/10 text-red-300 border-red-400/20",
    },
};

function parseCommitType(title: string): {
    type: (typeof COMMIT_TYPES)[string] | null;
    rest: string;
} {
    const match = title.match(/^(\w+)(?:\([^)]*\))?!?:\s*/);
    if (!match) return { type: null, rest: title };
    const key = match[1].toLowerCase();
    const type = COMMIT_TYPES[key] ?? null;
    return { type, rest: title.slice(match[0].length) };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({
    url,
    name,
    size = 20,
}: {
    url: string | null;
    name: string;
    size?: number;
}) {
    if (url) {
        return (
            <Image
                src={url}
                alt={name}
                width={size}
                height={size}
                sizes={`${size}px`}
                className="rounded-full border border-(--border-subtle) shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-elevated) text-[9px] font-bold text-(--text-faint)"
            style={{ width: size, height: size }}
        >
            {name.slice(0, 1).toUpperCase()}
        </div>
    );
}

function CommitRow({ commit }: { commit: UpdatesCommit }) {
    const { type, rest } = parseCommitType(commit.title);
    const time = formatDistanceToNow(new Date(commit.date), {
        addSuffix: true,
    });

    return (
        <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-(--bg-glass)"
        >
            <Avatar url={commit.authorAvatarUrl} name={commit.authorName} />

            {type ? (
                <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${type.className}`}
                >
                    {type.label}
                </span>
            ) : null}

            <span className="min-w-0 flex-1 truncate text-sm text-(--text-secondary) group-hover:text-(--text-primary) transition-colors">
                {rest}
            </span>

            <span className="shrink-0 font-mono text-[10px] text-(--text-faint) tabular-nums">
                {commit.sha}
            </span>

            <span className="shrink-0 text-[11px] text-(--text-faint) tabular-nums w-20 text-right">
                {time}
            </span>

            <ArrowUpRight className="size-3.5 shrink-0 text-(--text-faint) opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
    );
}

// ── Main render ───────────────────────────────────────────────────────────────

export function UpdatesRender({ feed }: { feed: UpdatesFeed }) {
    const syncLabel = formatDistanceToNow(new Date(feed.fetchedAt), {
        addSuffix: true,
    });
    const lastPush = feed.repo.lastPushAt
        ? formatDistanceToNow(new Date(feed.repo.lastPushAt), {
              addSuffix: true,
          })
        : null;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-[30%] -left-[10%] h-[60vh] w-[50vw] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute -right-[15%] top-[10%] h-[50vh] w-[40vw] rounded-full bg-violet-500/4 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 sm:py-16">
                {/* ── Nav ── */}
                <nav className="mb-10 flex items-center justify-between animate-fade-in">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) transition-colors hover:text-(--text-secondary)"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                    <a
                        href={feed.repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-(--text-faint) transition-colors hover:text-(--text-secondary)"
                    >
                        {feed.repo.fullName}
                        <ArrowUpRight className="size-3.5" />
                    </a>
                </nav>

                {/* ── Header ── */}
                <header
                    className="mb-8 animate-fade-in"
                    style={{ animationDelay: "0.05s" }}
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--accent)/20 bg-(--accent-soft) px-3 py-1">
                        <Zap className="size-3 text-(--accent)" />
                        <span className="text-[11px] font-medium text-(--accent)">
                            Live from GitHub
                        </span>
                        <span className="text-[10px] text-(--text-faint)">
                            · synced {syncLabel}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                        <span className="inline-block bg-linear-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent animate-gradient">
                            Updates
                        </span>
                    </h1>

                    {/* ── Inline stats ── */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-(--text-muted)">
                        <span className="flex items-center gap-1.5">
                            <Star className="size-3.5" />
                            <strong className="font-semibold text-(--text-secondary)">
                                {feed.repo.stars.toLocaleString()}
                            </strong>{" "}
                            stars
                        </span>
                        <span className="text-(--border-default)">·</span>
                        <span className="flex items-center gap-1.5">
                            <GitFork className="size-3.5" />
                            <strong className="font-semibold text-(--text-secondary)">
                                {feed.repo.forks.toLocaleString()}
                            </strong>{" "}
                            forks
                        </span>
                        <span className="text-(--border-default)">·</span>
                        <span>
                            <strong className="font-semibold text-(--text-secondary)">
                                {feed.repo.issues}
                            </strong>{" "}
                            open issues
                        </span>
                        {lastPush && (
                            <>
                                <span className="text-(--border-default)">
                                    ·
                                </span>
                                <span>pushed {lastPush}</span>
                            </>
                        )}
                    </div>
                </header>

                {/* ── Error banner ── */}
                {feed.error && (
                    <div className="mb-6 rounded-xl border border-amber-300/15 bg-amber-300/6 px-4 py-3 text-xs text-amber-200 animate-fade-in">
                        {feed.error}
                    </div>
                )}

                {/* ── Latest release ── */}
                {feed.latestRelease && (
                    <section
                        className="mb-8 animate-fade-in"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <div className="mb-3 flex items-center gap-2.5">
                            <Tag className="size-3.5 text-(--text-muted)" />
                            <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                                Latest release
                            </span>
                            <div className="h-px flex-1 bg-(--border-subtle)" />
                        </div>

                        <a
                            href={feed.latestRelease.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-xl border border-(--border-subtle) bg-(--bg-glass) px-5 py-4 transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover)"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-300">
                                            {feed.latestRelease.tagName}
                                        </span>
                                        {feed.latestRelease.isPrerelease && (
                                            <span className="rounded-md border border-amber-400/20 bg-amber-400/8 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                                pre-release
                                            </span>
                                        )}
                                        <span className="text-sm font-semibold text-(--text-primary)">
                                            {feed.latestRelease.name}
                                        </span>
                                    </div>
                                    {feed.latestRelease.body && (
                                        <p className="mt-2 text-sm leading-relaxed text-(--text-muted) line-clamp-2">
                                            {feed.latestRelease.body}
                                        </p>
                                    )}
                                </div>
                                <ArrowUpRight className="size-4 shrink-0 text-(--text-faint) transition-colors group-hover:text-(--text-secondary)" />
                            </div>
                        </a>
                    </section>
                )}

                {/* ── Commits ── */}
                <section
                    className="animate-fade-in"
                    style={{ animationDelay: "0.15s" }}
                >
                    <div className="mb-1 flex items-center gap-2.5">
                        <GitCommitHorizontal className="size-3.5 text-(--text-muted)" />
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            Recent commits
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                        <span className="text-[10px] text-(--text-faint)">
                            {feed.commits.length}
                        </span>
                    </div>

                    {feed.commits.length > 0 ? (
                        <div className="mt-1 overflow-hidden rounded-xl border border-(--border-subtle)">
                            {feed.commits.map((commit, i) => (
                                <div
                                    key={commit.id}
                                    className={
                                        i < feed.commits.length - 1
                                            ? "border-b border-(--border-subtle)"
                                            : ""
                                    }
                                >
                                    <CommitRow commit={commit} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-(--text-faint)">
                            No commits available.
                        </p>
                    )}
                </section>

                <footer
                    className="mt-16 text-center animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                >
                    <p className="text-xs text-(--text-faint)">
                        Data refreshes every 15 minutes via ISR.
                    </p>
                </footer>
            </div>
        </div>
    );
}
