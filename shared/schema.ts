import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cameras = pgTable("cameras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ipAddress: text("ip_address").notNull(),
  manufacturer: text("manufacturer"),
  model: text("model"),
  status: text("status").notNull().default("offline"), // online, offline, reconnecting
  isRecording: boolean("is_recording").default(false),
  resolution: text("resolution").default("1920x1080"),
  location: text("location"),
  streamUrl: text("stream_url"),
  imageUrl: text("image_url"),
  capabilities: jsonb("capabilities"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow()
});

export const discoveredDevices = pgTable("discovered_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ipAddress: text("ip_address").notNull(),
  macAddress: text("mac_address"),
  manufacturer: text("manufacturer"),
  deviceType: text("device_type").default("camera"),
  connectionStatus: text("connection_status").default("pending"), // connected, pending, failed
  discoveredAt: timestamp("discovered_at").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow()
});

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalCameras: integer("total_cameras").default(0),
  activeCameras: integer("active_cameras").default(0),
  offlineCameras: integer("offline_cameras").default(0),
  recordingCameras: integer("recording_cameras").default(0),
  discoveredDevices: integer("discovered_devices").default(0),
  connectedDevices: integer("connected_devices").default(0),
  failedConnections: integer("failed_connections").default(0),
  scanProgress: integer("scan_progress").default(0),
  bandwidthUsage: integer("bandwidth_usage").default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertCameraSchema = createInsertSchema(cameras).omit({
  id: true,
  discoveredAt: true,
  lastSeen: true
});

export const insertDiscoveredDeviceSchema = createInsertSchema(discoveredDevices).omit({
  id: true,
  discoveredAt: true,
  lastSeen: true
});

export const insertSystemStatsSchema = createInsertSchema(systemStats).omit({
  id: true,
  updatedAt: true
});

export type Camera = typeof cameras.$inferSelect;
export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type DiscoveredDevice = typeof discoveredDevices.$inferSelect;
export type InsertDiscoveredDevice = z.infer<typeof insertDiscoveredDeviceSchema>;
export type SystemStats = typeof systemStats.$inferSelect;
export type InsertSystemStats = z.infer<typeof insertSystemStatsSchema>;
