import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Layers3,
} from "lucide-react";

interface RoleSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  slug: string;
  category: string;
  level?: string;
  description?: string;
  salaryRange?: string;
  skills?: RoleSkill[];
}

interface RoleResponse {
  success: boolean;
  message?: string;
  data?: Role;
  error?: string;
}

interface RolePageProps {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET ROLE WITH REQUIRED SKILLS
// ============================================================

async function getRole(id: string): Promise<Role | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/roles/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: RoleResponse =
      await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(
      "Failed to fetch role:",
      error
    );

    return null;
  }
}

// ============================================================
// METADATA
// ============================================================

export async function generateMetadata({
  params,
}: RolePageProps): Promise<Metadata> {
  const { id } = await params;

  const role = await getRole(id);

  if (!role) {
    return {
      title: "Role Not Found | Career Graph",
      description:
        "The requested career role could not be found.",
    };
  }

  return {
    title: `${role.name} | Career Graph`,
    description:
      role.description ||
      `Explore the ${role.name} career role.`,
  };
}

// ============================================================
// PAGE
// ============================================================

export default async function RolePage({
  params,
}: RolePageProps) {
  const { id } = await params;

  const role = await getRole(id);

  // ==========================================================
  // ROLE NOT FOUND
  // ==========================================================

  if (!role) {
    return (
      <main className="min-h-full bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <section className="mt-8 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <BriefcaseBusiness className="h-6 w-6 text-destructive" />
            </div>

            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Role Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              The career role you are looking for does
              not exist or may have been removed.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // ==========================================================
  // REQUIRED SKILLS
  // ==========================================================

  const requiredSkills = Array.isArray(role.skills)
    ? role.skills.filter(
        (skill) =>
          skill &&
          typeof skill.name === "string" &&
          skill.name.trim().length > 0
      )
    : [];

  // ==========================================================
  // ROLE DETAILS
  // ==========================================================

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 rounded-xl bg-primary/10 p-3">
              <BriefcaseBusiness className="h-7 w-7 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {role.name}
                </h1>

                {role.level && (
                  <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {role.level}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {role.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <Layers3 className="h-3.5 w-3.5" />
                    {role.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">

          {/* Description */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold text-foreground">
              About this Role
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {role.description ||
                "No description is available for this role yet."}
            </p>
          </section>

          {/* Information */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Role Information
            </h2>

            <div className="mt-5 space-y-5">

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Category
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {role.category || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Experience Level
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {role.level || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Salary Range
                </p>

                <p className="mt-1 text-sm font-medium text-foreground">
                  {role.salaryRange || "Not specified"}
                </p>
              </div>

            </div>
          </section>
        </div>

        {/* Required Skills */}
        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold text-foreground">
              Required Skills
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Skills required for this career role.
          </p>

          {requiredSkills.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {requiredSkills.map((skill) => (
                <div
                  key={skill.id || skill.slug}
                  className="rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground">
                        {skill.name}
                      </h3>

                      {skill.category && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {skill.category}
                        </p>
                      )}

                      {skill.description && (
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No required skills are available for
                this role yet.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}