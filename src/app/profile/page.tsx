import type { Metadata } from "next";
import { ProfileRender } from "@/features/home/view/profile-render";

export const metadata: Metadata = {
    title: "API Profile — Trace",
    description: "Live quota and concurrency status for the trace.moe API account.",
};

export default function ProfilePage() {
    return <ProfileRender />;
}
