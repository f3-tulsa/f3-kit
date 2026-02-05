import { Routes, Route, Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Pax from "./pages/Pax";
import Profile from "./pages/Profile";

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        "px-4 py-2 rounded transition-colors",
        isActive
          ? "bg-f3-red text-white"
          : "text-gray-300 hover:bg-f3-gray/30 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-f3-gray/30 bg-f3-black/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-f3-red">F3</span>
            <span className="text-lg font-display">PAX Portal</span>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/pax">PAX</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, PAX</span>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/pax" element={<Pax />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-f3-gray/30 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          F3 PAX Portal • Built for the HIM
        </div>
      </footer>
    </div>
  );
}
