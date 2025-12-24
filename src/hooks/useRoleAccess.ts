import { useMemo } from "react";
import { AppRole } from "@/contexts/AuthContext";

interface RouteAccess {
  path: string;
  label: string;
  allowedRoles: AppRole[];
}

const routeAccessMap: RouteAccess[] = [
  { path: "/", label: "Dashboard", allowedRoles: ["admin", "product_manager", "employee"] },
  { path: "/dashboard", label: "Dashboard", allowedRoles: ["admin"] },
  { path: "/customers", label: "Customers", allowedRoles: ["admin", "employee"] },
  { path: "/inventory", label: "Inventory", allowedRoles: ["admin", "product_manager"] },
  { path: "/suppliers", label: "Suppliers", allowedRoles: ["admin", "product_manager"] },
  { path: "/sales", label: "Sales", allowedRoles: ["admin", "employee"] },
  { path: "/staff", label: "Staff Performance", allowedRoles: ["admin"] },
];

export function useRoleAccess(role: AppRole | null) {
  const accessibleRoutes = useMemo(() => {
    if (!role) return [];
    return routeAccessMap.filter((route) => route.allowedRoles.includes(role));
  }, [role]);

  const canAccessRoute = (path: string): boolean => {
    if (!role) return false;
    const route = routeAccessMap.find((r) => r.path === path);
    if (!route) return true; // Allow access to unlisted routes
    return route.allowedRoles.includes(role);
  };

  const getDefaultRoute = (): string => {
    if (!role) return "/auth";
    
    switch (role) {
      case "admin":
        return "/dashboard";
      case "product_manager":
        return "/inventory";
      case "employee":
        return "/sales";
      default:
        return "/dashboard";
    }
  };

  return {
    accessibleRoutes,
    canAccessRoute,
    getDefaultRoute,
  };
}
