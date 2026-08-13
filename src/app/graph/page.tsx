import GraphExplorer from "@/components/graph/GraphExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Graph | Career Graph",
  description:
    "Explore relationships between skills and career roles using a graph.",
};

export default function GraphPage() {
  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Career Graph
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Explore relationships between skills and career roles.
          </p>
        </header>

        <GraphExplorer />
      </div>
    </main>
  );
}