
import React from "react";
import type { SystemStats } from "@shared/schema";
import { 
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader
} from "./ui/sidebar";
import { 
  Monitor, 
  Network, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  Video
} from "lucide-react";

interface SidebarProps {
  systemStats?: SystemStats;
}

export default function Sidebar({ systemStats }: SidebarProps) {
  return (
    <SidebarPrimitive className="w-full md:w-64">
      <SidebarHeader className="p-4 md:p-6">
        <h2 className="text-lg font-semibold">CCTV Dashboard</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="min-h-[48px] bg-white/10 text-white hover:bg-white/20"
                data-testid="link-live-monitoring"
              >
                <Video className="w-5 h-5" />
                <span>Live Monitoring</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="min-h-[48px] hover:bg-white/10 transition-colors"
                data-testid="link-network-discovery"
              >
                <Network className="w-5 h-5" />
                <span>Network Discovery</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="min-h-[48px] hover:bg-white/10 transition-colors"
                data-testid="link-camera-management"
              >
                <Settings className="w-5 h-5" />
                <span>Camera Management</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="min-h-[48px] hover:bg-white/10 transition-colors"
                data-testid="link-analytics"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="min-h-[48px] hover:bg-white/10 transition-colors"
                data-testid="link-alerts"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Alerts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* Camera Status Summary */}
        <div className="p-4 bg-white/10 rounded-lg">
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
              <span className="text-red-400" data-testid="text-offline-cameras">
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
              />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
