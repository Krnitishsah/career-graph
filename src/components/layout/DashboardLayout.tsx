import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import Sidebar from "@/src/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Dashboard Body */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}