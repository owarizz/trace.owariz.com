import type { Metadata } from "next";
import { getUpdatesFeed, UpdatesRender } from "@/features/updates";

export const metadata: Metadata = {
    title: "Trace Updates",
    description:
        "Recent commits and release notes pulled directly from the GitHub repository.",
};

export default async function UpdatesPage() {
    const feed = await getUpdatesFeed();

    return <UpdatesRender feed={feed} />;
}
