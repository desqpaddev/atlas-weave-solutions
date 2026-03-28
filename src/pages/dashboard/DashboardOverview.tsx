import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardOverview() {
  const { profile } = useAuth();

  const { data: leadCount } = useQuery({
    queryKey: ["lead-count"],
    queryFn: async () => {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: bookingCount } = useQuery({
    queryKey: ["booking-count"],
    queryFn: async () => {
      const { count } = await supabase.from("bookings").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: customerCount } = useQuery({
    queryKey: ["customer-count"],
    queryFn: async () => {
      const { count } = await supabase.from("customers").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    { label: "Total Leads", value: leadCount ?? 0, icon: TrendingUp, color: "text-gold" },
    { label: "Bookings", value: bookingCount ?? 0, icon: CalendarDays, color: "text-gold" },
    { label: "Customers", value: customerCount ?? 0, icon: Users, color: "text-gold" },
    { label: "Revenue", value: "$0", icon: DollarSign, color: "text-gold" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your travel business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-display">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No leads yet. Start by adding your first lead.</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-display">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No bookings yet. They'll appear here once created.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
