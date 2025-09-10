import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import CameraGrid from "@/components/camera-grid";
import NetworkDiscovery from "@/components/network-discovery";
import CameraManagement from "@/components/camera-management";
import type { Camera, SystemStats, DiscoveredDevice } from "@shared/schema";

export default function Dashboard() {
  const [gridLayout, setGridLayout] = useState<"2x2" | "3x3" | "4x4">("3x3");

  const { data: cameras = [], isLoading: camerasLoading } = useQuery<Camera[]>({
    queryKey: ["/api/cameras"],
  });

  const { data: systemStats, isLoading: statsLoading } = useQuery<SystemStats>({
    queryKey: ["/api/system-stats"],
  });

  const { data: discoveredDevices = [], isLoading: devicesLoading } = useQuery<DiscoveredDevice[]>({
    queryKey: ["/api/discovered-devices"],
  });

  const isLoading = camerasLoading || statsLoading || devicesLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header systemStats={systemStats} />

      <div className="flex h-screen">
        <Sidebar systemStats={systemStats} />

        <main className="flex-1 p-3 md:p-6 overflow-auto">
          {/* Control Panel */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <h2 className="text-xl md:text-2xl font-bold">Live Camera Monitoring</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                <span className="text-sm text-muted-foreground" data-testid="text-cameras-info">
                  {cameras.length} cameras configured
                </span>
                <select 
                  value={gridLayout}
                  onChange={(e) => setGridLayout(e.target.value as "2x2" | "3x3" | "4x4")}
                  className="px-3 py-2 border rounded-lg bg-background text-sm"
                  data-testid="select-grid-layout"
                >
                  <option value="2x2">2x2 Grid</option>
                  <option value="3x3">3x3 Grid</option>
                  <option value="4x4">4x4 Grid</option>
                </select>
              </div>
            </div>

            {/* Network Discovery Status */}
            <NetworkDiscovery 
              systemStats={systemStats} 
              isLoading={statsLoading} 
            />
          </div>

          {/* Camera Grid */}
          <CameraGrid 
            cameras={cameras} 
            gridLayout={gridLayout} 
            isLoading={camerasLoading} 
          />

          {/* Network Discovery Details */}
          <div className="bg-white rounded-lg border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Network Discovery & Topology</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Discovered Devices List */}
              <div>
                <h4 className="font-medium mb-3">Recently Discovered Devices</h4>
                <div className="space-y-2">
                  {devicesLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg animate-pulse">
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-muted-foreground/20 rounded"></div>
                            <div>
                              <div className="w-32 h-4 bg-muted-foreground/20 rounded mb-1"></div>
                              <div className="w-24 h-3 bg-muted-foreground/20 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    discoveredDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-video text-primary"></i>
                          <div>
                            <p className="font-medium text-sm" data-testid={`text-device-name-${device.id}`}>
                              {device.name}
                            </p>
                            <p className="text-xs text-muted-foreground" data-testid={`text-device-ip-${device.id}`}>
                              {device.ipAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span 
                            className={`px-2 py-1 text-white text-xs rounded ${
                              device.connectionStatus === 'connected' ? 'bg-success' :
                              device.connectionStatus === 'pending' ? 'bg-warning' : 'bg-alert'
                            }`}
                            data-testid={`status-device-${device.id}`}
                          >
                            {device.connectionStatus === 'connected' ? 'Connected' :
                             device.connectionStatus === 'pending' ? 'Pending' : 'Failed'}
                          </span>
                          <button 
                            className="text-primary hover:text-secondary"
                            data-testid={`button-configure-device-${device.id}`}
                          >
                            <i className="fas fa-cog"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Network Map Visualization */}
              <div>
                <h4 className="font-medium mb-3">Network Topology</h4>
                <div className="h-64 bg-muted rounded-lg p-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <i className="fas fa-network-wired text-4xl mb-2"></i>
                      <p className="text-sm">Network Topology Visualization</p>
                      <p className="text-xs" data-testid="text-network-devices-count">
                        {systemStats?.discoveredDevices || 0} devices detected on network
                      </p>
                    </div>
                  </div>

                  {/* Mock network nodes */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full"></div>
                  <div className="absolute top-12 right-8 w-3 h-3 bg-success rounded-full"></div>
                  <div className="absolute bottom-8 left-12 w-3 h-3 bg-warning rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 bg-alert rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Management */}
          <CameraManagement cameras={cameras} isLoading={camerasLoading} />
        </main>
      </div>
    </div>
  );
}