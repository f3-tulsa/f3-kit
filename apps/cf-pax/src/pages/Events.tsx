import { useState } from "react";
import { clsx } from "clsx";

type ViewMode = "list" | "calendar";

export default function Events() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Events</h1>

        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex bg-f3-gray/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={clsx(
                "px-4 py-2 rounded text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-f3-red text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={clsx(
                "px-4 py-2 rounded text-sm font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-f3-red text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Calendar
            </button>
          </div>

          {/* Add Event Button */}
          <button className="px-4 py-2 bg-f3-red text-white font-semibold rounded hover:bg-red-700 transition-colors">
            + New Event
          </button>
        </div>
      </div>

      {viewMode === "list" ? <EventList /> : <EventCalendar />}
    </div>
  );
}

function EventList() {
  // Placeholder data
  const events = [
    {
      id: "1",
      name: "The Foundry",
      date: "2025-01-21",
      time: "05:30",
      ao: "Central Park",
      paxCount: 12,
      q: "Chappie",
    },
    {
      id: "2",
      name: "The Grind",
      date: "2025-01-21",
      time: "05:30",
      ao: "High School Track",
      paxCount: 8,
      q: "Torpedo",
    },
    {
      id: "3",
      name: "Saturday Ruck",
      date: "2025-01-18",
      time: "06:00",
      ao: "Trail Head",
      paxCount: 6,
      q: "Mailman",
    },
  ];

  return (
    <div className="bg-f3-gray/20 rounded-lg border border-f3-gray/30 overflow-hidden">
      <table className="w-full">
        <thead className="bg-f3-gray/30">
          <tr>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
              Event
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
              Date
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
              AO
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
              Q
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
              PAX
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-f3-gray/30">
          {events.map((event) => (
            <tr
              key={event.id}
              className="hover:bg-f3-gray/10 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <span className="font-semibold text-f3-red">{event.name}</span>
              </td>
              <td className="px-6 py-4 text-gray-300">
                {event.date} @ {event.time}
              </td>
              <td className="px-6 py-4 text-gray-300">{event.ao}</td>
              <td className="px-6 py-4 text-gray-300">{event.q}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-f3-red/20 text-f3-red text-sm rounded">
                  {event.paxCount}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventCalendar() {
  return (
    <div className="bg-f3-gray/20 rounded-lg p-8 border border-f3-gray/30 text-center">
      <p className="text-gray-400 mb-4">📅 Calendar view coming soon!</p>
      <p className="text-sm text-gray-500">
        This will show a monthly calendar with workouts and events.
      </p>
    </div>
  );
}
