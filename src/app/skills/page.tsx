import SkillsExplorer from "@/src/components/skills/SkillsExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Career Graph",
  description:
    "Explore technical skills, categories, proficiency levels, and related career roles.",
};

export default function SkillsPage() {
  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Skills
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore technical skills, categories, proficiency levels, and
            related career roles.
          </p>
        </header>

        <SkillsExplorer />
      </div>
    </main>
  );
}