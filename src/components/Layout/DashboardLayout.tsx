import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: ShoppingCart, label: "Sales", path: "/sales" },
  { icon: TrendingUp, label: "Staff Performance", path: "/staff" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-soft-pink via-cream to-mint">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white/80 backdrop-blur-md border-r border-white/20 p-4 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-gradient-accent bg-clip-text text-transparent">
                SkinCare
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-accent text-foreground"
                }`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="mt-auto p-4 rounded-2xl bg-gradient-accent text-white">
            <p className="text-sm font-semibold mb-1">Premium Plan</p>
            <p className="text-xs opacity-90">Unlimited access</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
