import { NextResponse } from "next/server";

import { getDashboardStats } from "../../../../lib/services/dashboard.service";

export async function GET() {
  try {
    const stats = await getDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard statistics",
      },
      { status: 500 },
    );
  }
}