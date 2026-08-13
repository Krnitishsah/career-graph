import type { Metadata } from "next";

import DashboardOverview from "@/src/components/dashboard/DashboardOverview";
import RecommendationList from "@/src/components/dashboard/RecommendationList";

export const metadata: Metadata = {
  title: "Dashboard | Career Graph",
  description:
    "Overview of skills, career roles, relationships, and career recommendations.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">
            Career Graph
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explore your skills, career roles, and connected career paths.
          </p>
        </header>

        {/* Overview Stats */}
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="sr-only">
            Career Graph Overview
          </h2>

          <DashboardOverview />
        </section>

        {/* Career Recommendations */}
        <section
          aria-labelledby="recommendations-heading"
          className="mt-8"
        >
          <h2 id="recommendations-heading" className="sr-only">
            Career Recommendations
          </h2>

          <RecommendationList />
        </section>
      </div>
    </main>
  );
}