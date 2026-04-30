import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCheck, Briefcase, CalendarDays,
  DollarSign, BarChart3, Settings, LogOut, Menu, X, Plane,
  ChevronRight, Map, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: Users, path: "/dashboard/leads" },
  { label: "Customers", icon: UserCheck, path: "/dashboard/customers" },
  { label: "Agents", icon: Briefcase, path: "/dashboard/agents" },
  { label: "Tours", icon: Map, path: "/dashboard/tours" },
  { label: "Departures", icon: CalendarDays, path: "/dashboard/departures" },
  { label: "Packages", icon: Package, path: "/dashboard/packages" },
  { label: "Bookings", icon: CalendarDays, path: "/dashboard/bookings" },
  { label: "Payments", icon: DollarSign, path: "/dashboard/payments" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const customerNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Bookings", icon: CalendarDays, path: "/dashboard/bookings" },
  { label: "My Payments", icon: DollarSign, path: "/dashboard/payments" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const agentNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: Users, path: "/dashboard/leads" },
  { label: "Customers", icon: UserCheck, path: "/dashboard/customers" },
  { label: "Tours", icon: Map, path: "/dashboard/tours" },
  { label: "Departures", icon: CalendarDays, path: "/dashboard/departures" },
  { label: "Packages", icon: Package, path: "/dashboard/packages" },
  { label: "Bookings", icon: CalendarDays, path: "/dashboard/bookings" },
  { label: "Payments", icon: DollarSign, path: "/dashboard/payments" },
];

export default function DashboardLayout() {
  const { user, profile, roles, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: company } = useQuery({
    queryKey: ["dashboard-company-branding", profile?.company_id ?? "default"],
    queryFn: async () => {
      if (profile?.company_id) {
        const { data } = await supabase.from("companies").select("name, logo_url").eq("id", profile.company_id).maybeSingle();
        return data;
      }
      // Customers and unauth'd users: fall back to the tenant's default branding
      const { data } = await supabase.from("companies").select("name, logo_url").limit(1).maybeSingle();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const isAdmin = roles.includes("company_admin") || roles.includes("super_admin");
  const isAgent = roles.includes("travel_agent");
  const navItems = isAdmin ? adminNavItems : isAgent ? agentNavItems : customerNavItems;

  const initials = (profile?.full_name || user.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-5 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              {company?.logo_url ? (
                <img src={company.logo_url} alt={company.name || "Logo"} className="h-8 w-auto max-w-[140px] object-contain" />
              ) : (
                <>
                  <Plane className="h-5 w-5 text-primary" />
                  <span className="font-display text-xl font-bold text-gradient-blue">{company?.name || "TravelHub"}</span>
                </>
              )}
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-secondary text-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <button onClick={signOut} className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
