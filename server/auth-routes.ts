
import type { Express } from "express";
import { users, sessions, hashPassword, verifyPassword, createSession, validateSession } from "./auth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["viewer", "operator", "admin"]).default("viewer")
});

export function registerAuthRoutes(app: Express) {
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Find user by username
      let user = null;
      for (const [id, u] of users.entries()) {
        if (u.username === username) {
          user = u;
          break;
        }
      }
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Update last login
      user.lastLogin = new Date();
      
      // Create session
      const token = createSession(user.id);
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Register endpoint (admin only in production)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, role } = registerSchema.parse(req.body);
      
      // Check if username or email already exists
      for (const [id, user] of users.entries()) {
        if (user.username === username) {
          return res.status(409).json({ message: 'Username already exists' });
        }
        if (user.email === email) {
          return res.status(409).json({ message: 'Email already exists' });
        }
      }
      
      const passwordHash = await hashPassword(password);
      const userId = `user-${Date.now()}`;
      
      const newUser = {
        id: userId,
        username,
        email,
        passwordHash,
        role,
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      users.set(userId, newUser);
      
      res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      sessions.delete(token);
    }
    res.json({ message: 'Logged out successfully' });
  });
  
  // Get current user
  app.get("/api/auth/me", (req, res) => {
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
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
}
