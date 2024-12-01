"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LineChart, BarChart } from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalImages: 0,
    processingSuccess: 0,
    revenueToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: usersCount },
        { count: imagesCount },
        { count: successCount },
        { sum: revenue },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }),
        supabase.from('images').select('*', { count: 'exact' }),
        supabase.from('images').select('*', { count: 'exact' }).eq('status', 'COMPLETED'),
        supabase.from('payments').select('amount').gte('created_at', new Date().toISOString().split('T')[0]),
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalImages: imagesCount || 0,
        processingSuccess: successCount ? (successCount / imagesCount) * 100 : 0,
        revenueToday: revenue || 0,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Images</h3>
          <p className="text-3xl font-bold">{stats.totalImages}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold">{stats.processingSuccess.toFixed(1)}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
          <p className="text-3xl font-bold">${stats.revenueToday}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <LineChart data={[]} /> {/* Implement actual data */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Processing Stats</h3>
          <BarChart data={[]} /> {/* Implement actual data */}
        </Card>
      </div>
    </div>
  );
}