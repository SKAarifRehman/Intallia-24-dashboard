import { Sidebar } from "@/components/layout/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">{children}</main>
    </div>
  );
}
