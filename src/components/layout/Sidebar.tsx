"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Compass,
  Network,
  Settings,
  Sparkles,
  Tags,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Roles",
    href: "/roles",
    icon: BriefcaseBusiness,
  },
  {
    label: "Skills",
    href: "/skills",
    icon: Tags,
  },
  {
    label: "Career Graph",
    href: "/graph",
    icon: Network,
  },
];

const secondaryNavigation = [
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Recommendations",
    href: "/recommendations",
    icon: Sparkles,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:min-h-[calc(100vh-4rem)] lg:flex-col">
      {/* Brand */}
      <div className="border-b border-border px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Network className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Career Graph
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Graph Explorer
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="mb-2 mt-7 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tools
        </p>

        <nav className="space-y-1">
          {secondaryNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />

            <span className="text-xs font-medium text-foreground">
              Career Graph
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Explore relationships between skills and career roles.
          </p>
        </div>
      </div>
    </aside>
  );
}