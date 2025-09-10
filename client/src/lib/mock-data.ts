import type { Camera, DiscoveredDevice, SystemStats } from "@shared/schema";

export const mockCameras: Camera[] = [
  {
    id: "1",
    name: "Office - Main Floor",
    ipAddress: "192.168.1.101",
    manufacturer: "Hikvision",
    model: "DS-2CD2T47G1-L",
    status: "online",
    isRecording: true,
    resolution: "1920x1080",
    location: "Main Office",
    streamUrl: "rtsp://192.168.1.101/stream",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    capabilities: { ptz: false, nightVision: true, motionDetection: true },
    discoveredAt: new Date("2024-01-15T10:30:00Z"),
    lastSeen: new Date()
  },
  {
    id: "2",
    name: "Entrance - Lobby",
    ipAddress: "192.168.1.102",
    manufacturer: "Axis",
    model: "P3245-LVE",
    status: "online",
    isRecording: true,
    resolution: "2560x1440",
    location: "Front Entrance",
    streamUrl: "rtsp://192.168.1.102/stream",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
    capabilities: { ptz: true, nightVision: true, motionDetection: true },
    discoveredAt: new Date("2024-01-15T10:35:00Z"),
    lastSeen: new Date()
  }
];

export const mockDiscoveredDevices: DiscoveredDevice[] = [
  {
    id: "1",
    name: "Hikvision DS-2CD2T47G1-L",
    ipAddress: "192.168.1.101",
    macAddress: "00:11:22:33:44:55",
    manufacturer: "Hikvision",
    deviceType: "camera",
    connectionStatus: "connected",
    discoveredAt: new Date("2024-01-15T10:30:00Z"),
    lastSeen: new Date()
  },
  {
    id: "2",
    name: "Axis P3245-LVE",
    ipAddress: "192.168.1.102",
    macAddress: "00:11:22:33:44:56",
    manufacturer: "Axis",
    deviceType: "camera",
    connectionStatus: "pending",
    discoveredAt: new Date("2024-01-15T10:35:00Z"),
    lastSeen: new Date()
  }
];

export const mockSystemStats: SystemStats = {
  id: "1",
  totalCameras: 9,
  activeCameras: 7,
  offlineCameras: 2,
  recordingCameras: 5,
  discoveredDevices: 24,
  connectedDevices: 12,
  failedConnections: 3,
  scanProgress: 85,
  bandwidthUsage: 68,
  updatedAt: new Date()
};
