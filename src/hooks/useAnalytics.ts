import { useState, useEffect } from "react";
import {
  EngagementMetrics,
  PerformanceInsights,
  TimeFrame,
} from "@/lib/types/analytics";
import axios from "@/lib/utils/axios";


export function useAnalytics() {
  const [engagementMetrics, setEngagementMetrics] =
    useState<EngagementMetrics | null>(null);
  const [performanceInsights, setPerformanceInsights] =
    useState<PerformanceInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>("monthly");

  const fetchAnalytics = async (): Promise<void> => {
    setLoading(true);
    try {
      const [engagementRes, performanceRes] = await Promise.all([
        axios.get(
          `/analytics/organizations/engagement?timeframe=${timeframe}`
        ),
        axios.get(`/analytics/organizations/performance`),
      ]);

      // Analytics data fetched successfully

      setEngagementMetrics(engagementRes.data);
      setPerformanceInsights(performanceRes.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analytics")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  return {
    engagementMetrics,
    performanceInsights,
    loading,
    error,
    timeframe,
    setTimeframe,
    refreshAnalytics: fetchAnalytics,
  };
}
