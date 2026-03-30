import "server-only";

import { APP_CONFIG } from "@/common/config";

const GITHUB_API_BASE = "https://api.github.com";
const REVALIDATE_SECONDS = 15 * 60;

interface GitHubRepoResponse {
    description: string | null;
    forks_count: number;
    full_name: string;
    html_url: string;
    name: string;
    open_issues_count: number;
    pushed_at: string;
    stargazers_count: number;
}

interface GitHubCommitResponse {
    author: {
        avatar_url: string;
        html_url: string;
        login: string;
    } | null;
    commit: {
        author: {
            date: string;
            name: string;
        };
        message: string;
    };
    html_url: string;
    sha: string;
}

interface GitHubReleaseResponse {
    body: string | null;
    html_url: string;
    name: string | null;
    prerelease: boolean;
    published_at: string;
    tag_name: string;
}

export interface UpdatesRepoSummary {
    description: string | null;
    forks: number;
    fullName: string;
    issues: number;
    lastPushAt: string | null;
    name: string;
    stars: number;
    url: string;
}

export interface UpdatesRelease {
    body: string | null;
    isPrerelease: boolean;
    name: string;
    publishedAt: string;
    tagName: string;
    url: string;
}

export interface UpdatesCommit {
    authorAvatarUrl: string | null;
    authorName: string;
    authorUrl: string | null;
    date: string;
    id: string;
    message: string | null;
    sha: string;
    title: string;
    url: string;
}

export interface UpdatesFeed {
    commits: UpdatesCommit[];
    error: string | null;
    fetchedAt: string;
    latestRelease: UpdatesRelease | null;
    repo: UpdatesRepoSummary;
}

function getGitHubHeaders() {
    const headers = new Headers({
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    });

    if (process.env.GITHUB_TOKEN) {
        headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
    }

    return headers;
}

async function fetchGitHubJson<T>(path: string) {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
        headers: getGitHubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
    }

    return (await response.json()) as T;
}

function getPlainTextExcerpt(value: string | null, maxLength = 180) {
    if (!value) {
        return null;
    }

    const plainText = value
        .replace(/[#>*_`~[\]-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!plainText) {
        return null;
    }

    return plainText.length > maxLength
        ? `${plainText.slice(0, maxLength).trimEnd()}...`
        : plainText;
}

function mapCommit(commit: GitHubCommitResponse): UpdatesCommit {
    const [titleLine, ...restLines] = commit.commit.message
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    return {
        id: commit.sha,
        sha: commit.sha.slice(0, 7),
        title: titleLine ?? "Untitled commit",
        message: restLines.length > 0 ? restLines.join(" ") : null,
        date: commit.commit.author.date,
        url: commit.html_url,
        authorName: commit.author?.login ?? commit.commit.author.name,
        authorUrl: commit.author?.html_url ?? null,
        authorAvatarUrl: commit.author?.avatar_url ?? null,
    };
}

function mapRelease(release: GitHubReleaseResponse): UpdatesRelease {
    return {
        name: release.name ?? release.tag_name,
        tagName: release.tag_name,
        publishedAt: release.published_at,
        url: release.html_url,
        body: getPlainTextExcerpt(release.body, 220),
        isPrerelease: release.prerelease,
    };
}

function getFallbackRepo(): UpdatesRepoSummary {
    return {
        name: APP_CONFIG.github.repository,
        fullName: `${APP_CONFIG.github.owner}/${APP_CONFIG.github.repository}`,
        description: "Latest updates pulled from the GitHub repository.",
        url: APP_CONFIG.github.url,
        stars: 0,
        forks: 0,
        issues: 0,
        lastPushAt: null,
    };
}

export async function getUpdatesFeed(): Promise<UpdatesFeed> {
    const repositoryPath = `/repos/${APP_CONFIG.github.owner}/${APP_CONFIG.github.repository}`;

    const [repoResult, commitsResult, releaseResult] = await Promise.allSettled(
        [
            fetchGitHubJson<GitHubRepoResponse>(repositoryPath),
            fetchGitHubJson<GitHubCommitResponse[]>(
                `${repositoryPath}/commits?per_page=12`,
            ),
            fetchGitHubJson<GitHubReleaseResponse[]>(
                `${repositoryPath}/releases?per_page=1`,
            ),
        ],
    );

    const repo =
        repoResult.status === "fulfilled"
            ? {
                  name: repoResult.value.name,
                  fullName: repoResult.value.full_name,
                  description: repoResult.value.description,
                  url: repoResult.value.html_url,
                  stars: repoResult.value.stargazers_count,
                  forks: repoResult.value.forks_count,
                  issues: repoResult.value.open_issues_count,
                  lastPushAt: repoResult.value.pushed_at,
              }
            : getFallbackRepo();

    const commits =
        commitsResult.status === "fulfilled"
            ? commitsResult.value.map(mapCommit)
            : [];

    const latestRelease =
        releaseResult.status === "fulfilled" && releaseResult.value.length > 0
            ? mapRelease(releaseResult.value[0])
            : null;

    const hasPartialFailure =
        repoResult.status === "rejected" ||
        commitsResult.status === "rejected" ||
        releaseResult.status === "rejected";

    return {
        repo,
        commits,
        latestRelease,
        fetchedAt: new Date().toISOString(),
        error: hasPartialFailure
            ? "Some GitHub data could not be loaded right now. The page is showing what is available."
            : null,
    };
}
