"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { LineChart, BarChart } from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
  dailyUsers: any[];
  processingStats: any[];
  revenue: any[];
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    dailyUsers: [],
    processingStats: [],
    revenue: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [usersData, imagesData, revenueData] = await Promise.all([
        supabase
          .from('users')
          .select('created_at')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('images')
          .select('status,created_at')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('payments')
          .select('amount,created_at')
          .gte('created_at', thirtyDaysAgo.toISOString())
      ]);

      // Process data for charts
      const dailyUsers = processTimeSeriesData(usersData.data || []);
      const processingStats = processStatusData(imagesData.data || []);
      const revenue = processRevenueData(revenueData.data || []);

      setData({ dailyUsers, processingStats, revenue });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily New Users</h3>
          <LineChart data={data.dailyUsers} />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Processing Success Rate</h3>
          <BarChart data={data.processingStats} />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
        <LineChart data={data.revenue} />
      </Card>
    </div>
  );
}

function processTimeSeriesData(data: any[]) {
  // Process raw data into chart-friendly format
  return data.reduce((acc: any[], item: any) => {
    const date = new Date(item.created_at).toLocaleDateString();
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ date, value: 1 });
    }
    return acc;
  }, []);
}

function processStatusData(data: any[]) {
  // Process status data for bar chart
  return Object.entries(
    data.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    status,
    count
  }));
}

function processRevenueData(data: any[]) {
  // Process revenue data for line chart
  return data.reduce((acc: any[], item: any) => {
    const date = new Date(item.created_at).toLocaleDateString();
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.amount += item.amount;
    } else {
      acc.push({ date, amount: item.amount });
    }
    return acc;
  }, []);
}