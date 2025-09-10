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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <div 
          key={stat.testId} 
          className="stats-card p-4 md:p-6 rounded-2xl relative group overflow-hidden"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            animation: 'fadeInScale 0.6s ease-out forwards'
          }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div className="flex-1 z-10">
              <p className="text-xs md:text-sm text-muted-foreground/80 font-medium truncate mb-1">{stat.label}</p>
              <p 
                className={`text-xl md:text-3xl font-bold ${stat.color} drop-shadow-sm`}
                data-testid={`text-${stat.testId}`}
              >
                {stat.value}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <i className={`${stat.icon} ${stat.color} text-lg md:text-xl drop-shadow-sm`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
