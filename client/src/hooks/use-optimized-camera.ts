import { useMemo, useCallback, memo } from 'react';
import type { Camera } from '@shared/schema';

// Status color mapping
const STATUS_COLORS = {
  online: 'bg-success',
  reconnecting: 'bg-warning',
  offline: 'bg-alert',
} as const;

// Status text mapping
const STATUS_TEXT = {
  online: 'LIVE',
  reconnecting: 'RECONNECTING',
  offline: 'OFFLINE',
} as const;

// Custom hook for camera status utilities
export function useCameraStatus(status: string) {
  const statusColor = useMemo(() => 
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-muted-foreground',
    [status]
  );
  
  const statusText = useMemo(() => 
    STATUS_TEXT[status as keyof typeof STATUS_TEXT] || 'UNKNOWN',
    [status]
  );
  
  return { statusColor, statusText };
}

// Memoized camera feed props
export function useCameraFeedProps(camera: Camera) {
  return useMemo(() => ({
    id: camera.id,
    name: camera.name,
    status: camera.status,
    imageUrl: camera.imageUrl,
    isRecording: camera.isRecording,
  }), [camera.id, camera.name, camera.status, camera.imageUrl, camera.isRecording]);
}

// Optimized image loading hook
export function useImageLazyLoad(imageUrl: string | null | undefined) {
  const loadImage = useCallback((element: HTMLImageElement | null) => {
    if (!element || !imageUrl) return;
    
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.src = imageUrl;
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [imageUrl]);
  
  return loadImage;
}