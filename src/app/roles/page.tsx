import RolesExplorer from "@/components/roles/RolesExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles | Career Graph",
  description:
    "Explore career roles, required skills, categories, and related career paths.",
};

export default function RolesPage() {
  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RolesExplorer />
      </div>
    </main>
  );
}