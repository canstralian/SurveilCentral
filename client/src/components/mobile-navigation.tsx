
import type { SystemStats } from "@shared/schema";

interface MobileNavigationProps {
  systemStats?: SystemStats;
}

export default function MobileNavigation({ systemStats }: MobileNavigationProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground border-t border-white/10 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-3 px-2">
        <a 
          href="#" 
          className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 touch-manipulation rounded-lg active:bg-white/10 transition-colors"
          data-testid="mobile-nav-monitoring"
        >
          <i className="fas fa-video text-xl mb-1"></i>
          <span className="text-xs truncate font-medium">Live</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 touch-manipulation rounded-lg active:bg-white/10 transition-colors"
          data-testid="mobile-nav-discovery"
        >
          <i className="fas fa-network-wired text-xl mb-1"></i>
          <span className="text-xs truncate font-medium">Network</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 touch-manipulation rounded-lg active:bg-white/10 transition-colors"
          data-testid="mobile-nav-cameras"
        >
          <i className="fas fa-cogs text-xl mb-1"></i>
          <span className="text-xs truncate font-medium">Cameras</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 touch-manipulation rounded-lg active:bg-white/10 transition-colors"
          data-testid="mobile-nav-analytics"
        >
          <i className="fas fa-chart-line text-xl mb-1"></i>
          <span className="text-xs truncate font-medium">Analytics</span>
        </a>
        <a 
          href="#" 
          className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 touch-manipulation rounded-lg active:bg-white/10 transition-colors relative"
          data-testid="mobile-nav-alerts"
        >
          <i className="fas fa-exclamation-triangle text-xl mb-1"></i>
          <span className="text-xs truncate font-medium">Alerts</span>
          {(systemStats?.offlineCameras || 0) > 0 && (
            <div className="absolute top-1 right-2 w-3 h-3 bg-red-500 rounded-full border border-primary"></div>
          )}
        </a>
      </div>
    </nav>
  );
}
