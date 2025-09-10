import type { SystemStats } from "@shared/schema";

interface HeaderProps {
  systemStats?: SystemStats;
}

export default function Header({ systemStats }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <i className="fas fa-shield-alt text-2xl"></i>
          <h1 className="text-xl font-bold" data-testid="text-app-title">
            CCTV Operations Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full status-indicator"></div>
            <span className="text-sm" data-testid="text-system-status">
              System Online
            </span>
          </div>
          <div className="text-sm" data-testid="text-user-name">
            Administrator
          </div>
          <button 
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            data-testid="button-settings"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
