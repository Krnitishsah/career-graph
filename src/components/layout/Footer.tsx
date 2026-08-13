import Link from "next/link";
import { Network } from "lucide-react";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Network className="h-4 w-4 text-primary" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Career Graph
            </p>

            <p className="text-xs text-muted-foreground">
              Explore skills. Discover careers.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>

          <Link
            href="/roles"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Roles
          </Link>

          <Link
            href="/skills"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Skills
          </Link>

          <Link
            href="/explore"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {currentYear} Career Graph. All rights reserved.
        </p>
      </div>
    </footer>
  );
}