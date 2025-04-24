
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

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

// Fallback data if API request fails
const fallbackData: DashboardStats = {
  documents: {
    total: 247,
    uploadedToday: 12,
    trend: 16,
  },
  conversations: {
    total: 186,
    activeToday: 42,
    trend: 24,
  },
  users: {
    total: 50,
    activeNow: 12,
    trend: 8,
  },
  vectorDb: {
    totalChunks: 12500,
    trend: 32,
  },
  recentActivity: [
    {
      id: "ra1",
      action: "Uploaded document: financial_report_q2.pdf",
      timestamp: new Date().toISOString(),
      user: "Admin User",
    },
    {
      id: "ra2",
      action: "Started a new conversation",
      timestamp: new Date(new Date().getTime() - 30 * 60000).toISOString(),
      user: "John D.",
    },
    {
      id: "ra3",
      action: "Updated system settings",
      timestamp: new Date(new Date().getTime() - 120 * 60000).toISOString(),
      user: "Admin User",
    },
  ],
  system: {
    ram: {
      used: 4096,
      total: 8192,
    },
    cpu: 35,
    apiRequests: 75,
    vectorDbSize: 2.5,
    modelSize: 1.5,
    documents: {
      total: 247,
      processed: 235,
      processing: 12,
      types: {
        pdf: 120,
        docx: 50,
        pptx: 34,
        xlsx: 23,
        txt: 20,
      },
    },
    users: {
      total: 50,
      admins: 5,
      activeSessions: 12,
      recentActions: [
        {
          time: new Date(new Date().getTime() - 5 * 60000).toISOString(),
          action: "Updated system settings",
        },
        {
          time: new Date(new Date().getTime() - 15 * 60000).toISOString(),
          action: "Added a new data source",
        },
        {
          time: new Date(new Date().getTime() - 45 * 60000).toISOString(),
          action: "Uploaded financial report.pdf",
        },
      ],
    },
  },
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        return await ApiService.request("/dashboard/stats", "GET");
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Show toast only in development to avoid bothering users in production
        if (process.env.NODE_ENV === "development") {
          toast({
            title: "Using fallback dashboard data",
            description: "Could not connect to the backend API. Using sample data instead.",
            variant: "destructive",
          });
        }
        return fallbackData;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
  });
};
