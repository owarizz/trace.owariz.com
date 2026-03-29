"use client";

import {
    Gauge,
    Layers,
    RefreshCw,
    Zap,
    type LucideIcon,
    User,
} from "lucide-react";
import { useMe } from "../../controller";
import { MeCardError } from "./error";
import { MeCardSkeleton } from "./skeleton";

interface FieldConfig {
    readonly label: string;
    readonly key: keyof typeof FIELD_META;
    readonly icon: LucideIcon;
    readonly accent?: string;
}

const FIELD_META = {
    priority: { suffix: "" },
    concurrency: { suffix: "" },
    quota: { suffix: "" },
    quotaUsed: { suffix: "" },
} as const;

const FIELDS: readonly FieldConfig[] = [
    {
        label: "Priority",
        key: "priority",
        icon: Zap,
        accent: "text-amber-400",
    },
    {
        label: "Concurrency",
        key: "concurrency",
        icon: Layers,
        accent: "text-cyan-400",
    },
    {
        label: "Quota",
        key: "quota",
        icon: Gauge,
        accent: "text-emerald-400",
    },
    {
        label: "Quota Used",
        key: "quotaUsed",
        icon: RefreshCw,
        accent: "text-violet-400",
    },
] as const;

function QuotaBar({ used, total }: { used: number; total: number }) {
    const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
    const color =
        pct > 80
            ? "from-red-500 to-red-400"
            : pct > 50
              ? "from-amber-500 to-amber-400"
              : "from-emerald-500 to-emerald-400";

    return (
        <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-(--text-muted)">
                    Quota Usage
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-(--text-secondary)">
                    {used} / {total}
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-(--bg-elevated) overflow-hidden">
                <div
                    className={`h-full rounded-full bg-linear-to-r ${color} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export function MeRender() {
    const { data, error, loading, refetch } = useMe();

    if (loading) return <MeCardSkeleton />;
    if (error) return <MeCardError message={error} onRetry={refetch} />;
    if (!data) return null;

    return (
        <div className="glass-card noise relative overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="flex items-center justify-center size-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
                            <User className="size-4" />
                        </div>
                        {/* Online dot */}
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-(--bg-primary) bg-(--success)" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-(--text-primary)">
                            {data.id}
                        </p>
                        <p className="text-[11px] font-medium text-(--text-muted)">
                            Guest User
                        </p>
                    </div>
                </div>

                {/* Refresh button */}
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="flex items-center justify-center size-8 rounded-lg border border-(--border-subtle) bg-(--bg-glass) text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                    aria-label="Refresh data"
                >
                    <RefreshCw className="size-3.5" />
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-(--border-subtle)" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4">
                {FIELDS.map(({ label, key, icon: Icon, accent }, i) => (
                    <div
                        key={key}
                        className={`group relative px-6 py-5 transition-colors hover:bg-white/2 animate-count-up stagger-${i + 1} ${
                            i < FIELDS.length - 1
                                ? "border-r border-(--border-subtle)"
                                : ""
                        }`}
                    >
                        {/* Icon */}
                        <div className="mb-3 flex items-center gap-2">
                            <Icon
                                className={`size-3.5 ${accent ?? "text-(--text-muted)"} transition-transform group-hover:scale-110`}
                            />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                                {label}
                            </span>
                        </div>

                        {/* Value */}
                        <p className="text-xl font-bold tabular-nums text-(--text-primary)">
                            {data[key] ?? "—"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quota bar */}
            <div className="h-px bg-(--border-subtle)" />
            <div className="px-6 py-4">
                <QuotaBar
                    used={Number(data.quotaUsed) || 0}
                    total={data.quota}
                />
            </div>
        </div>
    );
}
