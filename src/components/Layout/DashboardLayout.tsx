import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  Menu,
  X,
  Truck,
  LogOut,
} from "lucide-react";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  allowedRoles: AppRole[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", allowedRoles: ["admin"] },
  { icon: Users, label: "Customers", path: "/customers", allowedRoles: ["admin", "employee"] },
  { icon: Package, label: "Inventory", path: "/inventory", allowedRoles: ["admin", "product_manager"] },
  { icon: Truck, label: "Suppliers", path: "/suppliers", allowedRoles: ["admin", "product_manager"] },
  { icon: ShoppingCart, label: "Sales", path: "/sales", allowedRoles: ["admin", "employee"] },
  { icon: TrendingUp, label: "Staff Performance", path: "/staff", allowedRoles: ["admin"] },
];

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  product_manager: "Product Manager",
  employee: "Employee",
};

const roleColors: Record<AppRole, string> = {
  admin: "bg-primary text-primary-foreground",
  product_manager: "bg-secondary text-secondary-foreground",
  employee: "bg-accent text-accent-foreground",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, role, signOut } = useAuth();
  const { canAccessRoute } = useRoleAccess(role);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const visibleMenuItems = menuItems.filter((item) => 
    role && item.allowedRoles.includes(role)
  );

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
          {visibleMenuItems.map((item) => (
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

        {/* User Info & Sign Out */}
        <div className="mt-auto space-y-3">
          {sidebarOpen && role && (
            <div className="p-3 rounded-2xl bg-accent/50">
              <p className="text-xs text-muted-foreground mb-1">Signed in as</p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <Badge className={`mt-2 rounded-full text-xs ${roleColors[role]}`}>
                {roleLabels[role]}
              </Badge>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={`w-full justify-start gap-3 rounded-2xl hover:bg-destructive/10 hover:text-destructive ${
              !sidebarOpen && "justify-center px-0"
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
