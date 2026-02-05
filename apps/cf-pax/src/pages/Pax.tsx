import { useState } from "react";

export default function Pax() {
  const [search, setSearch] = useState("");

  // Placeholder data
  const paxList = [
    { id: "1", f3Name: "Chappie", firstName: "John", posts: 45, lastPost: "2025-01-21" },
    { id: "2", f3Name: "Torpedo", firstName: "Mike", posts: 38, lastPost: "2025-01-20" },
    { id: "3", f3Name: "Mailman", firstName: "Steve", posts: 52, lastPost: "2025-01-19" },
    { id: "4", f3Name: "Slice", firstName: "Dave", posts: 29, lastPost: "2025-01-18" },
    { id: "5", f3Name: "Sparky", firstName: "Tom", posts: 61, lastPost: "2025-01-21" },
  ];

  const filteredPax = paxList.filter(
    (p) =>
      p.f3Name.toLowerCase().includes(search.toLowerCase()) ||
      p.firstName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">PAX Directory</h1>

        <div className="flex items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search PAX..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-f3-gray/30 border border-f3-gray/50 rounded text-white placeholder-gray-500 focus:outline-none focus:border-f3-red"
          />

          {/* Add PAX Button */}
          <button className="px-4 py-2 bg-f3-red text-white font-semibold rounded hover:bg-red-700 transition-colors">
            + Add PAX
          </button>
        </div>
      </div>

      {/* PAX Table */}
      <div className="bg-f3-gray/20 rounded-lg border border-f3-gray/30 overflow-hidden">
        <table className="w-full">
          <thead className="bg-f3-gray/30">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                F3 Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                First Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                Total Posts
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                Last Post
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-f3-gray/30">
            {filteredPax.map((pax) => (
              <tr
                key={pax.id}
                className="hover:bg-f3-gray/10 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-f3-red">{pax.f3Name}</span>
                </td>
                <td className="px-6 py-4 text-gray-300">{pax.firstName}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-f3-gray/30 text-white text-sm rounded">
                    {pax.posts}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{pax.lastPost}</td>
                <td className="px-6 py-4">
                  <button className="text-sm text-f3-red hover:underline">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPax.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No PAX found matching "{search}"
        </div>
      )}
    </div>
  );
}
