import { type Camera, type InsertCamera, type DiscoveredDevice, type InsertDiscoveredDevice, type SystemStats, type InsertSystemStats, cameras, discoveredDevices, systemStats } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Camera operations
  getCameras(): Promise<Camera[]>;
  getCamera(id: string): Promise<Camera | undefined>;
  createCamera(camera: InsertCamera): Promise<Camera>;
  updateCamera(id: string, camera: Partial<InsertCamera>): Promise<Camera | undefined>;
  deleteCamera(id: string): Promise<boolean>;

  // Discovered device operations
  getDiscoveredDevices(): Promise<DiscoveredDevice[]>;
  getDiscoveredDevice(id: string): Promise<DiscoveredDevice | undefined>;
  createDiscoveredDevice(device: InsertDiscoveredDevice): Promise<DiscoveredDevice>;
  updateDiscoveredDevice(id: string, device: Partial<InsertDiscoveredDevice>): Promise<DiscoveredDevice | undefined>;
  deleteDiscoveredDevice(id: string): Promise<boolean>;

  // System stats operations
  getSystemStats(): Promise<SystemStats | undefined>;
  updateSystemStats(stats: Partial<InsertSystemStats>): Promise<SystemStats>;
}

export class MemStorage implements IStorage {
  private cameras: Map<string, Camera>;
  private discoveredDevices: Map<string, DiscoveredDevice>;
  private systemStats: SystemStats | undefined;

  constructor() {
    this.cameras = new Map();
    this.discoveredDevices = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock cameras
    const mockCameras: InsertCamera[] = [
      {
        name: "Office - Main Floor",
        ipAddress: "192.168.1.101",
        manufacturer: "Hikvision",
        model: "DS-2CD2T47G1-L",
        status: "online",
        isRecording: true,
        resolution: "1920x1080",
        location: "Main Office",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Entrance - Lobby",
        ipAddress: "192.168.1.102",
        manufacturer: "Axis",
        model: "P3245-LVE",
        status: "online",
        isRecording: true,
        resolution: "2560x1440",
        location: "Front Entrance",
        imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Parking - Level 1",
        ipAddress: "192.168.1.103",
        manufacturer: "Dahua",
        model: "IPC-HFW2431S-S",
        status: "reconnecting",
        isRecording: false,
        resolution: "1920x1080",
        location: "Parking Garage",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Conference Room A",
        ipAddress: "192.168.1.104",
        manufacturer: "Hikvision",
        model: "DS-2CD2T47G1-L",
        status: "online",
        isRecording: false,
        resolution: "1920x1080",
        location: "Conference Room A",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Hallway - East Wing",
        ipAddress: "192.168.1.105",
        manufacturer: "Axis",
        model: "P3245-LVE",
        status: "online",
        isRecording: true,
        resolution: "1920x1080",
        location: "East Hallway",
        imageUrl: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Server Room",
        ipAddress: "192.168.1.106",
        manufacturer: "Dahua",
        model: "IPC-HFW2431S-S",
        status: "offline",
        isRecording: false,
        resolution: "1920x1080",
        location: "Server Room",
        imageUrl: ""
      },
      {
        name: "Reception Area",
        ipAddress: "192.168.1.107",
        manufacturer: "Hikvision",
        model: "DS-2CD2T47G1-L",
        status: "online",
        isRecording: true,
        resolution: "1920x1080",
        location: "Reception",
        imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Stairwell - North",
        ipAddress: "192.168.1.108",
        manufacturer: "Axis",
        model: "P3245-LVE",
        status: "online",
        isRecording: false,
        resolution: "1920x1080",
        location: "North Stairwell",
        imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      },
      {
        name: "Exterior - Main",
        ipAddress: "192.168.1.109",
        manufacturer: "Dahua",
        model: "IPC-HFW2431S-S",
        status: "online",
        isRecording: true,
        resolution: "2560x1440",
        location: "Main Exterior",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
      }
    ];

    mockCameras.forEach(camera => {
      this.createCamera(camera);
    });

    // Initialize mock discovered devices
    const mockDevices: InsertDiscoveredDevice[] = [
      {
        name: "Hikvision DS-2CD2T47G1-L",
        ipAddress: "192.168.1.101",
        macAddress: "00:11:22:33:44:55",
        manufacturer: "Hikvision",
        deviceType: "camera",
        connectionStatus: "connected"
      },
      {
        name: "Axis P3245-LVE",
        ipAddress: "192.168.1.102",
        macAddress: "00:11:22:33:44:56",
        manufacturer: "Axis",
        deviceType: "camera",
        connectionStatus: "pending"
      },
      {
        name: "Dahua IPC-HFW2431S-S",
        ipAddress: "192.168.1.103",
        macAddress: "00:11:22:33:44:57",
        manufacturer: "Dahua",
        deviceType: "camera",
        connectionStatus: "failed"
      }
    ];

    mockDevices.forEach(device => {
      this.createDiscoveredDevice(device);
    });

    // Initialize system stats
    this.systemStats = {
      id: randomUUID(),
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
  }

  async getCameras(): Promise<Camera[]> {
    return Array.from(this.cameras.values());
  }

  async getCamera(id: string): Promise<Camera | undefined> {
    return this.cameras.get(id);
  }

  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const id = randomUUID();
    const camera: Camera = {
      ...insertCamera,
      id,
      manufacturer: insertCamera.manufacturer || null,
      model: insertCamera.model || null,
      status: insertCamera.status || "offline",
      location: insertCamera.location || null,
      streamUrl: insertCamera.streamUrl || null,
      imageUrl: insertCamera.imageUrl || null,
      capabilities: insertCamera.capabilities || null,
      resolution: insertCamera.resolution || null,
      isRecording: insertCamera.isRecording || null,
      discoveredAt: new Date(),
      lastSeen: new Date()
    };
    this.cameras.set(id, camera);
    return camera;
  }

  async updateCamera(id: string, updateData: Partial<InsertCamera>): Promise<Camera | undefined> {
    const camera = this.cameras.get(id);
    if (!camera) return undefined;

    const updatedCamera: Camera = {
      ...camera,
      ...updateData,
      lastSeen: new Date()
    };
    this.cameras.set(id, updatedCamera);
    return updatedCamera;
  }

  async deleteCamera(id: string): Promise<boolean> {
    return this.cameras.delete(id);
  }

  async getDiscoveredDevices(): Promise<DiscoveredDevice[]> {
    return Array.from(this.discoveredDevices.values());
  }

  async getDiscoveredDevice(id: string): Promise<DiscoveredDevice | undefined> {
    return this.discoveredDevices.get(id);
  }

  async createDiscoveredDevice(insertDevice: InsertDiscoveredDevice): Promise<DiscoveredDevice> {
    const id = randomUUID();
    const device: DiscoveredDevice = {
      ...insertDevice,
      id,
      manufacturer: insertDevice.manufacturer || null,
      macAddress: insertDevice.macAddress || null,
      deviceType: insertDevice.deviceType || null,
      connectionStatus: insertDevice.connectionStatus || null,
      discoveredAt: new Date(),
      lastSeen: new Date()
    };
    this.discoveredDevices.set(id, device);
    return device;
  }

  async updateDiscoveredDevice(id: string, updateData: Partial<InsertDiscoveredDevice>): Promise<DiscoveredDevice | undefined> {
    const device = this.discoveredDevices.get(id);
    if (!device) return undefined;

    const updatedDevice: DiscoveredDevice = {
      ...device,
      ...updateData,
      lastSeen: new Date()
    };
    this.discoveredDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDiscoveredDevice(id: string): Promise<boolean> {
    return this.discoveredDevices.delete(id);
  }

  async getSystemStats(): Promise<SystemStats | undefined> {
    // Calculate stats dynamically based on actual data
    const cameras = Array.from(this.cameras.values());
    const devices = Array.from(this.discoveredDevices.values());
    
    const totalCameras = cameras.length;
    const activeCameras = cameras.filter(c => c.status === "online").length;
    const offlineCameras = cameras.filter(c => c.status === "offline").length;
    const recordingCameras = cameras.filter(c => c.isRecording && c.status === "online").length;
    const discoveredDevices = devices.length;
    const connectedDevices = devices.filter(d => d.connectionStatus === "connected").length;
    const failedConnections = devices.filter(d => d.connectionStatus === "failed").length;
    
    // Update system stats with calculated values
    this.systemStats = {
      id: this.systemStats?.id || randomUUID(),
      totalCameras,
      activeCameras,
      offlineCameras,
      recordingCameras,
      discoveredDevices,
      connectedDevices,
      failedConnections,
      scanProgress: this.systemStats?.scanProgress || 85, // Keep user-controlled values
      bandwidthUsage: Math.round((activeCameras / Math.max(totalCameras, 1)) * 100), // Calculate based on active cameras
      updatedAt: new Date()
    };

    return this.systemStats;
  }

  async updateSystemStats(updateData: Partial<InsertSystemStats>): Promise<SystemStats> {
    if (!this.systemStats) {
      this.systemStats = {
        id: randomUUID(),
        totalCameras: 0,
        activeCameras: 0,
        offlineCameras: 0,
        recordingCameras: 0,
        discoveredDevices: 0,
        connectedDevices: 0,
        failedConnections: 0,
        scanProgress: 0,
        bandwidthUsage: 0,
        updatedAt: new Date()
      };
    }

    this.systemStats = {
      ...this.systemStats,
      ...updateData,
      updatedAt: new Date()
    };

    return this.systemStats;
  }
}

export class DatabaseStorage implements IStorage {
  async getCameras(): Promise<Camera[]> {
    return await db.select().from(cameras);
  }

  async getCamera(id: string): Promise<Camera | undefined> {
    const [camera] = await db.select().from(cameras).where(eq(cameras.id, id));
    return camera || undefined;
  }

  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const [camera] = await db
      .insert(cameras)
      .values(insertCamera)
      .returning();
    return camera;
  }

  async updateCamera(id: string, updateData: Partial<InsertCamera>): Promise<Camera | undefined> {
    const [camera] = await db
      .update(cameras)
      .set({ ...updateData, lastSeen: new Date() })
      .where(eq(cameras.id, id))
      .returning();
    return camera || undefined;
  }

  async deleteCamera(id: string): Promise<boolean> {
    const rows = await db
      .delete(cameras)
      .where(eq(cameras.id, id))
      .returning();
    return rows.length > 0;
  }

  async getDiscoveredDevices(): Promise<DiscoveredDevice[]> {
    return await db.select().from(discoveredDevices);
  }

  async getDiscoveredDevice(id: string): Promise<DiscoveredDevice | undefined> {
    const [device] = await db.select().from(discoveredDevices).where(eq(discoveredDevices.id, id));
    return device || undefined;
  }

  async createDiscoveredDevice(insertDevice: InsertDiscoveredDevice): Promise<DiscoveredDevice> {
    const [device] = await db
      .insert(discoveredDevices)
      .values(insertDevice)
      .returning();
    return device;
  }

  async updateDiscoveredDevice(id: string, updateData: Partial<InsertDiscoveredDevice>): Promise<DiscoveredDevice | undefined> {
    const [device] = await db
      .update(discoveredDevices)
      .set({ ...updateData, lastSeen: new Date() })
      .where(eq(discoveredDevices.id, id))
      .returning();
    return device || undefined;
  }

  async deleteDiscoveredDevice(id: string): Promise<boolean> {
    const rows = await db
      .delete(discoveredDevices)
      .where(eq(discoveredDevices.id, id))
      .returning();
    return rows.length > 0;
  }

  async getSystemStats(): Promise<SystemStats | undefined> {
    // First try to get existing stats
    const [existing] = await db.select().from(systemStats).limit(1);
    
    if (existing) {
      // Calculate dynamic stats based on actual data
      const allCameras = await this.getCameras();
      const allDevices = await this.getDiscoveredDevices();
      
      const totalCameras = allCameras.length;
      const activeCameras = allCameras.filter(c => c.status === "online").length;
      const offlineCameras = allCameras.filter(c => c.status === "offline").length;
      const recordingCameras = allCameras.filter(c => c.isRecording && c.status === "online").length;
      const discoveredDevicesCount = allDevices.length;
      const connectedDevices = allDevices.filter(d => d.connectionStatus === "connected").length;
      const failedConnections = allDevices.filter(d => d.connectionStatus === "failed").length;
      
      // Update with calculated values
      const [updatedStats] = await db
        .update(systemStats)
        .set({
          totalCameras,
          activeCameras,
          offlineCameras,
          recordingCameras,
          discoveredDevices: discoveredDevicesCount,
          connectedDevices,
          failedConnections,
          bandwidthUsage: Math.round((activeCameras / Math.max(totalCameras, 1)) * 100),
          updatedAt: new Date()
        })
        .where(eq(systemStats.id, existing.id))
        .returning();
      
      return updatedStats;
    } else {
      // Create initial stats
      const allCameras = await this.getCameras();
      const allDevices = await this.getDiscoveredDevices();
      
      const [newStats] = await db
        .insert(systemStats)
        .values({
          totalCameras: allCameras.length,
          activeCameras: allCameras.filter(c => c.status === "online").length,
          offlineCameras: allCameras.filter(c => c.status === "offline").length,
          recordingCameras: allCameras.filter(c => c.isRecording && c.status === "online").length,
          discoveredDevices: allDevices.length,
          connectedDevices: allDevices.filter(d => d.connectionStatus === "connected").length,
          failedConnections: allDevices.filter(d => d.connectionStatus === "failed").length,
          scanProgress: 85,
          bandwidthUsage: allCameras.length > 0 ? Math.round((allCameras.filter(c => c.status === "online").length / allCameras.length) * 100) : 0
        })
        .returning();
      
      return newStats;
    }
  }

  async updateSystemStats(updateData: Partial<InsertSystemStats>): Promise<SystemStats> {
    const [existing] = await db.select().from(systemStats).limit(1);
    
    if (existing) {
      const [updatedStats] = await db
        .update(systemStats)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(systemStats.id, existing.id))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db
        .insert(systemStats)
        .values({
          totalCameras: 0,
          activeCameras: 0,
          offlineCameras: 0,
          recordingCameras: 0,
          discoveredDevices: 0,
          connectedDevices: 0,
          failedConnections: 0,
          scanProgress: 0,
          bandwidthUsage: 0,
          ...updateData
        })
        .returning();
      return newStats;
    }
  }
}

export const storage = new DatabaseStorage();
