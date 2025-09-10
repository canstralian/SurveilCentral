import { useState } from "react";
import type { Camera } from "@shared/schema";
import { AlertTriangle } from "lucide-react";

interface CameraFeedProps {
  camera: Camera;
}

export default function CameraFeed({ camera }: CameraFeedProps) {
  const [showControls, setShowControls] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "reconnecting":
        return "bg-warning";
      case "offline":
        return "bg-alert";
      default:
        return "bg-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "LIVE";
      case "reconnecting":
        return "RECONNECTING";
      case "offline":
        return "OFFLINE";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <div 
      className={`camera-feed bg-black rounded-lg overflow-hidden border-2 relative group ${
        camera.status === "offline" ? "border-alert" : "border-border"
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      data-testid={`camera-feed-${camera.id}`}
    >
      {/* Camera feed content */}
      {camera.status === "offline" ? (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center aspect-video">
          <div className="text-center text-white">
            <AlertTriangle className="w-12 h-12 text-alert mb-3 mx-auto" />
            <p className="text-lg font-semibold">Camera Offline</p>
            <p className="text-sm text-gray-400" data-testid={`text-camera-name-${camera.id}`}>
              {camera.name}
            </p>
          </div>
        </div>
      ) : camera.imageUrl ? (
        <img 
          src={camera.imageUrl} 
          alt={`${camera.name} Feed`} 
          className="w-full h-full object-cover aspect-video"
          data-testid={`img-camera-feed-${camera.id}`}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center aspect-video">
          <div className="text-center text-white">
            <i className="fas fa-video text-4xl mb-3"></i>
            <p className="text-sm">No Feed Available</p>
          </div>
        </div>
      )}
      
      {/* Camera Info Overlay */}
      <div className="absolute top-3 left-3 bg-black/75 text-white px-3 py-1 rounded text-sm">
        <i className={`fas ${camera.status === "offline" ? "fa-video-slash" : "fa-video"} mr-2`}></i>
        <span data-testid={`text-camera-overlay-name-${camera.id}`}>
          {camera.name}
        </span>
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <div className={`w-2 h-2 ${getStatusColor(camera.status)} rounded-full status-indicator`}></div>
        <span 
          className="text-white text-xs bg-black/75 px-2 py-1 rounded"
          data-testid={`text-camera-status-${camera.id}`}
        >
          {getStatusText(camera.status)}
        </span>
      </div>
      
      {/* Recording Indicator */}
      {camera.isRecording && camera.status === "online" && (
        <div className="absolute bottom-3 left-3 bg-alert/90 text-white px-2 py-1 rounded text-xs">
          <i className="fas fa-circle text-alert mr-1"></i>REC
        </div>
      )}
      
      {/* Camera Controls (shown on hover) */}
      {showControls && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <button 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            data-testid={`button-expand-camera-${camera.id}`}
          >
            <i className="fas fa-expand"></i>
          </button>
          <button 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            data-testid={`button-snapshot-camera-${camera.id}`}
          >
            <i className="fas fa-camera"></i>
          </button>
          <button 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            data-testid={`button-settings-camera-${camera.id}`}
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      )}
    </div>
  );
}
