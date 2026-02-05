export function Events() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">AO</th>
              <th className="text-left px-4 py-3 font-medium">Q</th>
              <th className="text-left px-4 py-3 font-medium">PAX</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-zinc-700">
              <td className="px-4 py-3">2026-01-27</td>
              <td className="px-4 py-3">The Foundry</td>
              <td className="px-4 py-3 text-red-400">Dredd</td>
              <td className="px-4 py-3">14</td>
            </tr>
            <tr className="border-t border-zinc-700">
              <td className="px-4 py-3">2026-01-25</td>
              <td className="px-4 py-3">Saturday Beatdown</td>
              <td className="px-4 py-3 text-red-400">Maverick</td>
              <td className="px-4 py-3">22</td>
            </tr>
            <tr className="border-t border-zinc-700">
              <td className="px-4 py-3">2026-01-24</td>
              <td className="px-4 py-3">The Asylum</td>
              <td className="px-4 py-3 text-red-400">Iceman</td>
              <td className="px-4 py-3">11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
