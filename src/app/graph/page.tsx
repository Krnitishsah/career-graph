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
        <GraphExplorer />
      </div>
    </main>
  );
}
