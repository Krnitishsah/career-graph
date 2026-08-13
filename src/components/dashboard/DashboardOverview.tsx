"use client";

import {
  BriefcaseBusiness,
  GitBranch,
  Layers3,
  Network,
  Sparkles,
} from "lucide-react";

import StatCard from "./StatCard";
import useDashboard from "../../hooks/useDashboard";

export default function DashboardOverview() {
  const { stats, loading, error } = useDashboard();

  const cards = [
    {
      title: "Career Roles",
      value: loading ? "—" : stats.roles,
      description: "Roles available in the graph",
      icon: BriefcaseBusiness,
    },
    {
      title: "Skills",
      value: loading ? "—" : stats.skills,
      description: "Technical and professional skills",
      icon: Layers3,
    },
    {
      title: "Relationships",
      value: loading ? "—" : stats.relationships,
      description: "Connections between graph nodes",
      icon: GitBranch,
    },
    {
      title: "Categories",
      value: loading ? "—" : stats.categories,
      description: "Skill and role categories",
      icon: Network,
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Career Graph Dashboard
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Explore career roles, skills, and their relationships in the graph.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Graph Introduction */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <Network className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Explore the Career Graph
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Discover how skills connect with career roles. Use the graph to
              understand which skills are required for different roles and
              explore related career paths.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
