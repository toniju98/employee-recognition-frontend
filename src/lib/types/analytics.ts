export interface EngagementMetrics {
  totalRecognitions: number;
  activeUsers: number;
  recognitionsPerUser: number;
  topDepartments: {
    department: string;
    recognitions: number;
  }[];
  timeframeData: {
    date: string;
    recognitions: number;
  }[];
}

export interface PerformanceInsights {
  departmentStats: {
    department: string;
    averagePoints: number;
    totalRecognitions: number;
    activeUsers: number;
  }[];
  topPerformers: {
    userId: string;
    name: string;
    department: string;
    points: number;
    recognitionsReceived: number;
  }[];
}

export type TimeFrame = "weekly" | "monthly" | "quarterly";
