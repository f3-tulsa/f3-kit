export function Profile() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-zinc-700 rounded-full flex items-center justify-center text-3xl font-bold text-red-500">
              D
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">Dredd</div>
              <div className="text-zinc-400">John Smith</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">F3 Name</label>
              <input
                type="text"
                defaultValue="Dredd"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">First Name</label>
              <input
                type="text"
                defaultValue="John"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Last Name</label>
              <input
                type="text"
                defaultValue="Smith"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-bold mb-4">Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-red-500">245</div>
              <div className="text-zinc-400">Total Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">34</div>
              <div className="text-zinc-400">Qs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">2023-03-15</div>
              <div className="text-zinc-400">First Post</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">2026-01-27</div>
              <div className="text-zinc-400">Last Post</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
