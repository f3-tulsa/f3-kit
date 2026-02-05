import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Dashboard() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: api.health,
    retry: false,
  });

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total PAX" value="--" subtitle="Active members" />
        <StatCard title="This Week" value="--" subtitle="Workouts posted" />
        <StatCard title="This Month" value="--" subtitle="Total posts" />
        <StatCard title="FNGs" value="--" subtitle="New this month" />
      </div>

      {/* API Status */}
      <div className="bg-f3-gray/20 rounded-lg p-6 border border-f3-gray/30 mb-8">
        <h2 className="text-xl font-display font-semibold mb-4">API Status</h2>
        {healthQuery.isLoading && (
          <p className="text-gray-400">Checking API connection...</p>
        )}
        {healthQuery.isError && (
          <p className="text-red-400">
            ❌ API not connected. Make sure cf-api is running on port 8787.
          </p>
        )}
        {healthQuery.isSuccess && (
          <p className="text-green-400">
            ✅ Connected to {healthQuery.data.service}
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-f3-gray/20 rounded-lg p-6 border border-f3-gray/30">
        <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400">
          Activity feed will show recent backblasts, new PAX, and announcements.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="bg-f3-gray/20 rounded-lg p-6 border border-f3-gray/30">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-display font-bold text-f3-red">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
