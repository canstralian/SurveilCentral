
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Simple in-memory storage for demo (replace with database in production)
const users = new Map();
const sessions = new Map();

// Initialize admin user
const adminId = "admin-001";
const adminPasswordHash = await bcrypt.hash("admin123", 10);
users.set(adminId, {
  id: adminId,
  username: "admin",
  email: "admin@cctv.local",
  passwordHash: adminPasswordHash,
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createSession(userId: string): string {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry
  
  const session = {
    id: crypto.randomUUID(),
    userId,
    token,
    expiresAt,
    createdAt: new Date()
  };
  
  sessions.set(token, session);
  return token;
}

export function validateSession(token: string): any | null {
  const session = sessions.get(token);
  if (!session) return null;
  
  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  
  return session;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const session = validateSession(token);
  if (!session) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
  
  const user = users.get(session.userId);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'User account inactive' });
  }
  
  req.user = user;
  req.session = session;
  next();
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const roleHierarchy = { 'viewer': 1, 'operator': 2, 'admin': 3 };
    const userLevel = roleHierarchy[req.user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}

// Export storage for routes
export { users, sessions };
