import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCameraSchema, insertDiscoveredDeviceSchema, insertSystemStatsSchema } from "@shared/schema";
import { registerAuthRoutes } from "./auth-routes";
import { requireAuth, requireRole } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register authentication routes
  registerAuthRoutes(app);
  
  // Camera routes (protected)
  app.get("/api/cameras", requireAuth, async (req, res) => {
    try {
      const cameras = await storage.getCameras();
      res.json(cameras);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  app.get("/api/cameras/:id", async (req, res) => {
    try {
      const camera = await storage.getCamera(req.params.id);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }
      res.json(camera);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch camera" });
    }
  });

  app.post("/api/cameras", requireAuth, requireRole('operator'), async (req, res) => {
    try {
      const validatedData = insertCameraSchema.parse(req.body);
      const camera = await storage.createCamera(validatedData);
      res.status(201).json(camera);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid camera data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create camera" });
    }
  });

  app.patch("/api/cameras/:id", requireAuth, requireRole('operator'), async (req, res) => {
    try {
      const partialSchema = insertCameraSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const camera = await storage.updateCamera(req.params.id, validatedData);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }
      res.json(camera);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid camera data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update camera" });
    }
  });

  app.delete("/api/cameras/:id", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const success = await storage.deleteCamera(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Camera not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete camera" });
    }
  });

  // Discovered devices routes
  app.get("/api/discovered-devices", async (req, res) => {
    try {
      const devices = await storage.getDiscoveredDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch discovered devices" });
    }
  });

  app.post("/api/discovered-devices", async (req, res) => {
    try {
      const validatedData = insertDiscoveredDeviceSchema.parse(req.body);
      const device = await storage.createDiscoveredDevice(validatedData);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create discovered device" });
    }
  });

  app.patch("/api/discovered-devices/:id", async (req, res) => {
    try {
      const partialSchema = insertDiscoveredDeviceSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const device = await storage.updateDiscoveredDevice(req.params.id, validatedData);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update device" });
    }
  });

  app.delete("/api/discovered-devices/:id", async (req, res) => {
    try {
      const success = await storage.deleteDiscoveredDevice(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete device" });
    }
  });

  // System stats routes
  app.get("/api/system-stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      if (!stats) {
        return res.status(404).json({ message: "System stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system stats" });
    }
  });

  app.patch("/api/system-stats", async (req, res) => {
    try {
      const partialSchema = insertSystemStatsSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const stats = await storage.updateSystemStats(validatedData);
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stats data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update system stats" });
    }
  });

  // Network discovery simulation
  app.post("/api/discover-cameras", async (req, res) => {
    try {
      // Simulate network discovery process
      const stats = await storage.getSystemStats();
      if (stats) {
        await storage.updateSystemStats({
          scanProgress: Math.min(100, (stats.scanProgress || 0) + 15)
        });
      }
      res.json({ message: "Discovery started", progress: stats?.scanProgress || 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to start discovery" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
