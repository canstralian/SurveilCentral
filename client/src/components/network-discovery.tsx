import type { SystemStats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface NetworkDiscoveryProps {
  systemStats?: SystemStats;
  isLoading: boolean;
}

export default function NetworkDiscovery({ systemStats, isLoading }: NetworkDiscoveryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Discovered Devices",
      value: systemStats?.discoveredDevices || 0,
      icon: "fas fa-search",
      color: "text-primary",
      testId: "discovered-devices"
    },
    {
      label: "Connected Cameras",
      value: systemStats?.connectedDevices || 0,
      icon: "fas fa-video",
      color: "text-success",
      testId: "connected-cameras"
    },
    {
      label: "Failed Connections",
      value: systemStats?.failedConnections || 0,
      icon: "fas fa-exclamation-triangle",
      color: "text-alert",
      testId: "failed-connections"
    },
    {
      label: "Scan Progress",
      value: `${systemStats?.scanProgress || 0}%`,
      icon: "fas fa-sync-alt",
      color: "text-warning",
      testId: "scan-progress"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.testId} className="bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p 
                className={`text-2xl font-bold ${stat.color}`}
                data-testid={`text-${stat.testId}`}
              >
                {stat.value}
              </p>
            </div>
            <i className={`${stat.icon} ${stat.color} text-xl`}></i>
          </div>
        </div>
      ))}
    </div>
  );
}
