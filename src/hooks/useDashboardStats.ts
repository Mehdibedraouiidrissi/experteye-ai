
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api";

interface DashboardStats {
  documents: {
    total: number;
    uploadedToday: number;
    trend: number;
  };
  conversations: {
    total: number;
    activeToday: number;
    trend: number;
  };
  users: {
    total: number;
    activeNow: number;
    trend: number;
  };
  vectorDb: {
    totalChunks: number;
    trend: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }>;
  system: {
    ram: {
      used: number;
      total: number;
    };
    cpu: number;
    apiRequests: number;
    vectorDbSize: number;
    modelSize: number;
    documents: {
      total: number;
      processed: number;
      processing: number;
      types: Record<string, number>;
    };
    users: {
      total: number;
      admins: number;
      activeSessions: number;
      recentActions: Array<{
        time: string;
        action: string;
      }>;
    };
  };
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async (): Promise<DashboardStats> => {
      return await ApiService.request("/dashboard/stats", "GET");
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
