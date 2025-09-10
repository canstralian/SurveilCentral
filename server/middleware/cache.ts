import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  etag: string;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 30000; // 30 seconds
  
  constructor() {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }
  
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  private generateETag(data: any): string {
    return `"${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 27)}"`;
  }
  
  get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (entry && Date.now() <= entry.timestamp + entry.ttl) {
      return entry;
    }
    this.cache.delete(key);
    return undefined;
  }
  
  set(key: string, data: any, ttl?: number): void {
    const etag = this.generateETag(data);
    this.cache.set(key, {
      data,
      etag,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL
    });
  }
  
  invalidate(pattern?: RegExp): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export const cacheManager = new CacheManager();

// Cache middleware for GET requests
export function cacheMiddleware(ttl?: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const cacheKey = `${req.path}:${JSON.stringify(req.query)}`;
    const cached = cacheManager.get(cacheKey);
    
    if (cached) {
      // Check if client has the same version
      const clientETag = req.headers['if-none-match'];
      if (clientETag === cached.etag) {
        return res.status(304).end();
      }
      
      res.setHeader('ETag', cached.etag);
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.data);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function(data: any) {
      if (res.statusCode === 200) {
        const entry = cacheManager.get(cacheKey);
        if (!entry) {
          cacheManager.set(cacheKey, data, ttl);
          const newEntry = cacheManager.get(cacheKey);
          if (newEntry) {
            res.setHeader('ETag', newEntry.etag);
          }
        }
        res.setHeader('X-Cache', 'MISS');
      }
      return originalJson(data);
    };
    
    next();
  };
}

// Invalidation helper for mutations
export function invalidateCache(pattern?: string) {
  if (pattern) {
    cacheManager.invalidate(new RegExp(pattern));
  } else {
    cacheManager.invalidate();
  }
}