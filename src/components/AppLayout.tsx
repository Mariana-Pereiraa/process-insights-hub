import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
