"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MeRender } from "./me-card";

export function StatusPanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-2xl border border-(--border-subtle) bg-(--bg-glass) px-4 py-3 text-left transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover)"
                aria-expanded={isOpen}
            >
                <div>
                    <p className="text-sm font-semibold text-(--text-primary)">
                        API account details
                    </p>
                    <p className="mt-1 text-xs text-(--text-muted)">
                        Load quota and concurrency only when needed.
                    </p>
                </div>
                <ChevronDown
                    className={`size-4 shrink-0 text-(--text-faint) transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    {isOpen ? <MeRender /> : null}
                </div>
            </div>
        </div>
    );
}
