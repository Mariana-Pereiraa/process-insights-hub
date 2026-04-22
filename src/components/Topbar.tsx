import { Bell, Menu, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { mockNotifications } from "@/data/mock-notifications";

interface TopbarProps {
  title: string;
  onToggleSidebar?: () => void;
}

export function Topbar({ title, onToggleSidebar }: TopbarProps) {
  const unreadCount = mockNotifications.filter((n) => !n.lida).length;

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/notificacoes"
          aria-label="Notificações"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-white bg-red-600">
              {unreadCount}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground hidden sm:block">Mariana Pereira Da Silva</span>
        </div>
      </div>
    </header>
  );
}
