export function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <div className="text-4xl font-bold text-red-500">12</div>
          <div className="text-zinc-400">Posts This Month</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <div className="text-4xl font-bold text-red-500">3</div>
          <div className="text-zinc-400">Qs This Month</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <div className="text-4xl font-bold text-red-500">156</div>
          <div className="text-zinc-400">Total Posts</div>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-zinc-700">
            <div>
              <div className="font-medium">The Foundry</div>
              <div className="text-sm text-zinc-400">Posted as PAX</div>
            </div>
            <div className="text-zinc-400 text-sm">Today</div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-700">
            <div>
              <div className="font-medium">Saturday Beatdown</div>
              <div className="text-sm text-zinc-400">Q'd the workout</div>
            </div>
            <div className="text-zinc-400 text-sm">2 days ago</div>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <div className="font-medium">The Asylum</div>
              <div className="text-sm text-zinc-400">Posted as PAX</div>
            </div>
            <div className="text-zinc-400 text-sm">3 days ago</div>
          </div>
        </div>
      </div>
    </div>
  )
}
