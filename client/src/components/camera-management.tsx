import type { Camera } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface CameraManagementProps {
  cameras: Camera[];
  isLoading: boolean;
}

export default function CameraManagement({ cameras, isLoading }: CameraManagementProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full";
    switch (status) {
      case "online":
        return `${baseClasses} bg-success/10 text-success`;
      case "offline":
        return `${baseClasses} bg-alert/10 text-alert`;
      case "reconnecting":
        return `${baseClasses} bg-warning/10 text-warning`;
      default:
        return `${baseClasses} bg-muted/10 text-muted-foreground`;
    }
  };

  const getRecordingBadge = (isRecording: boolean, status: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full";
    if (status === "offline") {
      return `${baseClasses} bg-muted/50 text-muted-foreground`;
    }
    return isRecording 
      ? `${baseClasses} bg-alert/10 text-alert` 
      : `${baseClasses} bg-muted/50 text-muted-foreground`;
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Camera Management</h3>
        <Button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
          data-testid="button-add-camera"
        >
          <i className="fas fa-plus mr-2"></i>Add Camera
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="pb-3 text-sm font-medium text-muted-foreground">Camera Name</th>
              <th className="pb-3 text-sm font-medium text-muted-foreground">IP Address</th>
              <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="pb-3 text-sm font-medium text-muted-foreground">Resolution</th>
              <th className="pb-3 text-sm font-medium text-muted-foreground">Recording</th>
              <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))
            ) : (
              cameras.map((camera) => (
                <tr key={camera.id}>
                  <td className="py-3" data-testid={`text-camera-table-name-${camera.id}`}>
                    {camera.name}
                  </td>
                  <td className="py-3 text-muted-foreground" data-testid={`text-camera-table-ip-${camera.id}`}>
                    {camera.ipAddress}
                  </td>
                  <td className="py-3">
                    <span 
                      className={getStatusBadge(camera.status)}
                      data-testid={`status-camera-table-${camera.id}`}
                    >
                      {camera.status === "online" ? "Online" : 
                       camera.status === "offline" ? "Offline" : 
                       "Reconnecting"}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground" data-testid={`text-camera-table-resolution-${camera.id}`}>
                    {camera.resolution}
                  </td>
                  <td className="py-3">
                    <span 
                      className={getRecordingBadge(camera.isRecording || false, camera.status)}
                      data-testid={`status-recording-table-${camera.id}`}
                    >
                      {camera.status === "offline" ? "Stopped" : 
                       camera.isRecording ? "Recording" : "Stopped"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button 
                        className={`${camera.status === "offline" ? "text-muted-foreground" : "text-primary hover:text-secondary"}`}
                        disabled={camera.status === "offline"}
                        data-testid={`button-view-camera-${camera.id}`}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="text-primary hover:text-secondary"
                        data-testid={`button-edit-camera-${camera.id}`}
                      >
                        <i className="fas fa-cog"></i>
                      </button>
                      <button 
                        className="text-alert hover:text-red-700"
                        data-testid={`button-delete-camera-${camera.id}`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
