import { format, formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    ArrowUpRight,
    Clock3,
    GitBranch,
    GitCommitHorizontal,
    Sparkles,
    Star,
    Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { UpdatesFeed } from "../server/github";

function StatCard({
    icon: Icon,
    label,
    value,
    caption,
}: {
    icon: typeof Star;
    label: string;
    value: string;
    caption: string;
}) {
    return (
        <div className="glass-card relative overflow-hidden px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-(--text-muted)">
                <Icon className="size-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    {label}
                </span>
            </div>
            <p className="text-2xl font-bold text-(--text-primary)">{value}</p>
            <p className="mt-1 text-xs text-(--text-faint)">{caption}</p>
        </div>
    );
}

function AuthorAvatar({
    avatarUrl,
    authorName,
}: {
    avatarUrl: string | null;
    authorName: string;
}) {
    if (avatarUrl) {
        return (
            <Image
                src={avatarUrl}
                alt={authorName}
                width={40}
                height={40}
                className="size-10 rounded-full border border-(--border-subtle)"
            />
        );
    }

    return (
        <div className="flex size-10 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-elevated) text-xs font-semibold text-(--text-secondary)">
            {authorName.slice(0, 2).toUpperCase()}
        </div>
    );
}

export function UpdatesRender({ feed }: { feed: UpdatesFeed }) {
    const latestSyncLabel = formatDistanceToNow(new Date(feed.fetchedAt), {
        addSuffix: true,
    });

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute top-[-18%] left-[8%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/7 blur-[120px]" />
                <div className="absolute top-[12%] right-[-8%] h-[30rem] w-[30rem] rounded-full bg-amber-400/8 blur-[120px]" />
                <div className="absolute bottom-[-22%] left-[20%] h-[28rem] w-[36rem] rounded-full bg-emerald-400/6 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-16">
                <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary)"
                    >
                        <ArrowLeft className="size-3" />
                        Back to search
                    </Link>
                    <a
                        href={feed.repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary)"
                    >
                        <GitCommitHorizontal className="size-3.5" />
                        Open repository
                    </a>
                </div>

                <header className="mb-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                        <Sparkles className="size-3" />
                        Live from GitHub
                    </div>
                    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
                        <div>
                            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-(--text-faint)">
                                Ship log
                            </p>
                            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-(--text-primary) sm:text-5xl">
                                Recent updates from{" "}
                                <span className="bg-linear-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">
                                    {feed.repo.fullName}
                                </span>
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--text-secondary) sm:text-base">
                                Fresh commits and release notes pulled from the
                                repository so this project can publish a clean,
                                always-current update feed without manual
                                changelog work.
                            </p>
                        </div>

                        <div className="glass-card relative overflow-hidden p-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--text-faint)">
                                        Repo pulse
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-(--text-primary)">
                                        {feed.repo.name}
                                    </p>
                                </div>
                                <div className="rounded-full border border-(--border-subtle) px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                                    Synced {latestSyncLabel}
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-(--text-secondary)">
                                {feed.repo.description ??
                                    "Project updates are mirrored from GitHub commits and releases."}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-(--text-muted)">
                                <span className="rounded-full border border-(--border-subtle) px-2.5 py-1">
                                    {feed.commits.length} recent commits
                                </span>
                                <span className="rounded-full border border-(--border-subtle) px-2.5 py-1">
                                    {feed.repo.issues} open issues
                                </span>
                                {feed.latestRelease ? (
                                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 text-emerald-300">
                                        Latest release{" "}
                                        {feed.latestRelease.tagName}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </header>

                <section className="mb-8 grid gap-4 md:grid-cols-3">
                    <StatCard
                        icon={Star}
                        label="Stars"
                        value={feed.repo.stars.toLocaleString()}
                        caption="Signals how many people are tracking the project."
                    />
                    <StatCard
                        icon={GitBranch}
                        label="Forks"
                        value={feed.repo.forks.toLocaleString()}
                        caption="Useful proxy for experimentation and external contributions."
                    />
                    <StatCard
                        icon={Clock3}
                        label="Last Push"
                        value={
                            feed.repo.lastPushAt
                                ? formatDistanceToNow(
                                      new Date(feed.repo.lastPushAt),
                                      {
                                          addSuffix: true,
                                      },
                                  )
                                : "Unknown"
                        }
                        caption="Repository activity straight from the default branch."
                    />
                </section>

                {feed.error ? (
                    <div className="mb-8 rounded-2xl border border-amber-300/15 bg-amber-300/8 px-4 py-3 text-sm text-amber-100">
                        {feed.error}
                    </div>
                ) : null}

                {feed.latestRelease ? (
                    <section className="mb-8">
                        <div className="mb-4 flex items-center gap-2.5">
                            <Tag className="size-4 text-(--text-muted)" />
                            <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                                Latest release
                            </span>
                            <div className="h-px flex-1 bg-(--border-subtle)" />
                        </div>

                        <article className="glass-card overflow-hidden p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                        {feed.latestRelease.isPrerelease
                                            ? "Prerelease"
                                            : "Stable release"}
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-(--text-primary)">
                                        {feed.latestRelease.name}
                                    </h2>
                                    <p className="mt-2 text-sm text-(--text-secondary)">
                                        Published{" "}
                                        {format(
                                            new Date(
                                                feed.latestRelease.publishedAt,
                                            ),
                                            "PPP",
                                        )}
                                    </p>
                                </div>
                                <a
                                    href={feed.latestRelease.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-xs font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary)"
                                >
                                    View release
                                    <ArrowUpRight className="size-3.5" />
                                </a>
                            </div>
                            {feed.latestRelease.body ? (
                                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-(--text-secondary)">
                                    {feed.latestRelease.body}
                                </p>
                            ) : null}
                        </article>
                    </section>
                ) : null}

                <section>
                    <div className="mb-4 flex items-center gap-2.5">
                        <GitBranch className="size-4 text-(--text-muted)" />
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            Recent commits
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                    </div>

                    {feed.commits.length > 0 ? (
                        <div className="space-y-4">
                            {feed.commits.map((commit, index) => (
                                <article
                                    key={commit.id}
                                    className="glass-card relative overflow-hidden p-5"
                                >
                                    <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-cyan-300/80 via-amber-300/40 to-transparent" />
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <AuthorAvatar
                                                    avatarUrl={
                                                        commit.authorAvatarUrl
                                                    }
                                                    authorName={
                                                        commit.authorName
                                                    }
                                                />
                                                <div className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full border border-(--bg-primary) bg-(--bg-secondary) text-[9px] font-bold text-(--text-faint)">
                                                    {index + 1}
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full border border-(--border-subtle) px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-cyan-200">
                                                        {commit.sha}
                                                    </span>
                                                    <span className="text-[11px] text-(--text-faint)">
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                commit.date,
                                                            ),
                                                            {
                                                                addSuffix: true,
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                <h3 className="mt-3 text-lg font-semibold text-(--text-primary)">
                                                    {commit.title}
                                                </h3>
                                                {commit.message ? (
                                                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--text-secondary)">
                                                        {commit.message}
                                                    </p>
                                                ) : null}
                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-(--text-muted)">
                                                    <span>
                                                        by {commit.authorName}
                                                    </span>
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                commit.date,
                                                            ),
                                                            "PPP p",
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap gap-2">
                                            {commit.authorUrl ? (
                                                <a
                                                    href={commit.authorUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-xs font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:text-(--text-secondary)"
                                                >
                                                    Author
                                                    <ArrowUpRight className="size-3.5" />
                                                </a>
                                            ) : null}
                                            <a
                                                href={commit.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1.5 text-xs font-medium text-cyan-100 transition-all hover:border-cyan-200 hover:brightness-110"
                                            >
                                                View commit
                                                <ArrowUpRight className="size-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-6 text-sm text-(--text-secondary)">
                            No commits available right now. You can still open
                            the repository directly from GitHub.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
