import type { LucideIcon } from "lucide-react";

export type DashboardStats = {
  roles: number;
  skills: number;
  relationships: number;
  categories: number;
};

export type DashboardStatsResponse = {
  success: boolean;
  data: DashboardStats;
  message?: string;
};

export type DashboardStatCard = {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
};

export type DashboardOverviewProps = {
  stats?: Partial<DashboardStats>;
};

export type DashboardState = {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
};