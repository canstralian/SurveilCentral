import CameraFeed from "./camera-feed";
import type { Camera } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CameraGridProps {
  cameras: Camera[];
  gridLayout: "2x2" | "3x3" | "4x4";
  isLoading: boolean;
}

export default function CameraGrid({ cameras, gridLayout, isLoading }: CameraGridProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-4 mb-6 grid-${gridLayout}`}>
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-video rounded-lg" />
        ))}
      </div>
    );
  }

  const gridSize = gridLayout === "2x2" ? 4 : gridLayout === "3x3" ? 9 : 16;
  const visibleCameras = cameras.slice(0, gridSize);

  return (
    <div className={`grid gap-4 mb-6 grid-${gridLayout}`} data-testid="camera-grid">
      {visibleCameras.map((camera) => (
        <CameraFeed key={camera.id} camera={camera} />
      ))}
      
      {/* Fill empty slots if needed */}
      {visibleCameras.length < gridSize && 
        [...Array(gridSize - visibleCameras.length)].map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="camera-feed bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center"
            data-testid={`empty-slot-${i}`}
          >
            <div className="text-center text-muted-foreground">
              <i className="fas fa-plus text-2xl mb-2"></i>
              <p className="text-sm">Add Camera</p>
            </div>
          </div>
        ))
      }
    </div>
  );
}
