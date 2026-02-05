import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Events } from './pages/Events'
import { Pax } from './pages/Pax'
import { Profile } from './pages/Profile'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-red-600 text-white'
            : 'text-zinc-300 hover:bg-zinc-700'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        {/* Header */}
        <header className="bg-zinc-800 border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-red-500">
              F3 PAX Portal
            </Link>
            <nav className="flex gap-2">
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/events">Events</NavItem>
              <NavItem to="/pax">PAX</NavItem>
              <NavItem to="/profile">Profile</NavItem>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/pax" element={<Pax />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
