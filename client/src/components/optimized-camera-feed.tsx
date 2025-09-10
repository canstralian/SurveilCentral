import { memo, useState, useCallback, useMemo } from "react";
import type { Camera } from "@shared/schema";
import { AlertTriangle } from "lucide-react";
import { useCameraStatus, useCameraFeedProps } from "@/hooks/use-optimized-camera";

interface CameraFeedProps {
  camera: Camera;
}

// Memoized camera feed component - only re-renders when camera prop changes
const OptimizedCameraFeed = memo(function CameraFeed({ camera }: CameraFeedProps) {
  const [showControls, setShowControls] = useState(false);
  const { statusColor, statusText } = useCameraStatus(camera.status);
  const feedProps = useCameraFeedProps(camera);
  
  // Memoized event handlers to prevent re-creation
  const handleMouseEnter = useCallback(() => setShowControls(true), []);
  const handleMouseLeave = useCallback(() => setShowControls(false), []);
  
  // Memoized class names
  const containerClass = useMemo(() => 
    `camera-feed bg-black rounded-lg overflow-hidden border-2 relative group ${
      camera.status === "offline" ? "border-alert" : "border-border"
    }`,
    [camera.status]
  );
  
  // Memoized icon class
  const iconClass = useMemo(() => 
    `fas ${camera.status === "offline" ? "fa-video-slash" : "fa-video"} mr-2`,
    [camera.status]
  );
  
  // Render optimized content
  const renderContent = useMemo(() => {
    if (camera.status === "offline") {
      return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center aspect-video">
          <div className="text-center text-white">
            <AlertTriangle className="w-12 h-12 text-alert mb-3 mx-auto" />
            <p className="text-lg font-semibold">Camera Offline</p>
            <p className="text-sm text-gray-400" data-testid={`text-camera-name-${camera.id}`}>
              {camera.name}
            </p>
          </div>
        </div>
      );
    }
    
    if (camera.imageUrl) {
      return (
        <img 
          src={camera.imageUrl}
          alt={`${camera.name} Feed`}
          className="w-full h-full object-cover aspect-video"
          loading="lazy"
          data-testid={`img-camera-feed-${camera.id}`}
        />
      );
    }
    
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center aspect-video">
        <div className="text-center text-white">
          <i className="fas fa-video text-4xl mb-3"></i>
          <p className="text-sm">No Feed Available</p>
        </div>
      </div>
    );
  }, [camera.status, camera.imageUrl, camera.name, camera.id]);
  
  // Render controls only when needed
  const renderControls = useMemo(() => {
    if (!showControls) return null;
    
    return (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
        <button 
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          data-testid={`button-expand-camera-${camera.id}`}
          aria-label="Expand camera view"
        >
          <i className="fas fa-expand"></i>
        </button>
        <button 
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          data-testid={`button-snapshot-camera-${camera.id}`}
          aria-label="Take snapshot"
        >
          <i className="fas fa-camera"></i>
        </button>
        <button 
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          data-testid={`button-settings-camera-${camera.id}`}
          aria-label="Camera settings"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    );
  }, [showControls, camera.id]);
  
  return (
    <div 
      className={containerClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`camera-feed-${camera.id}`}
    >
      {renderContent}
      
      {/* Camera Info Overlay */}
      <div className="absolute top-3 left-3 bg-black/75 text-white px-3 py-1 rounded text-sm">
        <i className={iconClass}></i>
        <span data-testid={`text-camera-overlay-name-${camera.id}`}>
          {camera.name}
        </span>
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <div className={`w-2 h-2 ${statusColor} rounded-full status-indicator`}></div>
        <span 
          className="text-white text-xs bg-black/75 px-2 py-1 rounded"
          data-testid={`text-camera-status-${camera.id}`}
        >
          {statusText}
        </span>
      </div>
      
      {/* Recording Indicator */}
      {camera.isRecording && camera.status === "online" && (
        <div className="absolute bottom-3 left-3 bg-alert/90 text-white px-2 py-1 rounded text-xs">
          <i className="fas fa-circle text-alert mr-1"></i>REC
        </div>
      )}
      
      {renderControls}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for deep equality check
  return (
    prevProps.camera.id === nextProps.camera.id &&
    prevProps.camera.name === nextProps.camera.name &&
    prevProps.camera.status === nextProps.camera.status &&
    prevProps.camera.imageUrl === nextProps.camera.imageUrl &&
    prevProps.camera.isRecording === nextProps.camera.isRecording
  );
});

export default OptimizedCameraFeed;