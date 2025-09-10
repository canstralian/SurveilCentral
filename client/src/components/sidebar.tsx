import type { SystemStats } from "@shared/schema";

interface SidebarProps {
  systemStats?: SystemStats;
}

export default function Sidebar({ systemStats }: SidebarProps) {
  return (
    <aside className="w-64 sidebar-nav text-primary-foreground p-6">
      <nav className="space-y-2">
        <a 
          href="#" 
          className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white"
          data-testid="link-live-monitoring"
        >
          <i className="fas fa-video w-5"></i>
          <span>Live Monitoring</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
          data-testid="link-network-discovery"
        >
          <i className="fas fa-network-wired w-5"></i>
          <span>Network Discovery</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
          data-testid="link-camera-management"
        >
          <i className="fas fa-cogs w-5"></i>
          <span>Camera Management</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
          data-testid="link-analytics"
        >
          <i className="fas fa-chart-line w-5"></i>
          <span>Analytics</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
          data-testid="link-alerts"
        >
          <i className="fas fa-exclamation-triangle w-5"></i>
          <span>Alerts</span>
        </a>
      </nav>

      {/* Camera Status Summary */}
      <div className="mt-8 p-4 bg-white/10 rounded-lg">
        <h3 className="font-semibold mb-3">System Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Active Cameras:</span>
            <span data-testid="text-active-cameras">
              {systemStats?.activeCameras || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Offline Cameras:</span>
            <span className="text-alert" data-testid="text-offline-cameras">
              {systemStats?.offlineCameras || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Recording:</span>
            <span data-testid="text-recording-cameras">
              {systemStats?.recordingCameras || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Network Health */}
      <div className="mt-4 p-4 bg-white/10 rounded-lg">
        <h3 className="font-semibold mb-3">Network Health</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Bandwidth Usage:</span>
            <span data-testid="text-bandwidth-usage">
              {systemStats?.bandwidthUsage || 0}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500" 
              style={{ width: `${systemStats?.bandwidthUsage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
