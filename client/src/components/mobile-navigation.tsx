
import type { SystemStats } from "@shared/schema";

interface MobileNavigationProps {
  systemStats?: SystemStats;
}

export default function MobileNavigation({ systemStats }: MobileNavigationProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground border-t border-white/10 z-50">
      <div className="flex items-center justify-around py-2">
        <a 
          href="#" 
          className="flex flex-col items-center p-2 min-w-0 flex-1 touch-manipulation"
          data-testid="mobile-nav-monitoring"
        >
          <i className="fas fa-video text-lg mb-1"></i>
          <span className="text-xs truncate">Live</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center p-2 min-w-0 flex-1 touch-manipulation"
          data-testid="mobile-nav-discovery"
        >
          <i className="fas fa-network-wired text-lg mb-1"></i>
          <span className="text-xs truncate">Network</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center p-2 min-w-0 flex-1 touch-manipulation"
          data-testid="mobile-nav-cameras"
        >
          <i className="fas fa-cogs text-lg mb-1"></i>
          <span className="text-xs truncate">Cameras</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center p-2 min-w-0 flex-1 touch-manipulation"
          data-testid="mobile-nav-analytics"
        >
          <i className="fas fa-chart-line text-lg mb-1"></i>
          <span className="text-xs truncate">Analytics</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center p-2 min-w-0 flex-1 touch-manipulation relative"
          data-testid="mobile-nav-alerts"
        >
          <i className="fas fa-exclamation-triangle text-lg mb-1"></i>
          <span className="text-xs truncate">Alerts</span>
          {(systemStats?.offlineCameras || 0) > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </a>
      </div>
    </nav>
  );
}
