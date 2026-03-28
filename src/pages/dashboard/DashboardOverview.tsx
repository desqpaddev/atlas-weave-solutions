import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, DollarSign, TrendingUp, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function DashboardOverview() {
  const { profile, roles, user } = useAuth();

  const isAdmin = roles.includes("company_admin") || roles.includes("super_admin");
  const isAgent = roles.includes("travel_agent");
  const isCustomer = !isAdmin && !isAgent;

  if (isCustomer) return <CustomerDashboard user={user} profile={profile} />;
  return <AdminDashboard profile={profile} />;
}

function CustomerDashboard({ user, profile }: { user: any; profile: any }) {
  const { data: customerRecord } = useQuery({
    queryKey: ["my-customer-record", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: myBookings = [] } = useQuery({
    queryKey: ["my-bookings", customerRecord?.id],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*").eq("customer_id", customerRecord!.id).order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
    enabled: !!customerRecord?.id,
  });

  const { data: myPayments = [] } = useQuery({
    queryKey: ["my-payments-summary", customerRecord?.id],
    queryFn: async () => {
      if (!customerRecord?.id) return [];
      const bookingIds = myBookings.map(b => b.id);
      if (bookingIds.length === 0) return [];
      const { data } = await supabase.from("payments").select("*").in("booking_id", bookingIds).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: myBookings.length > 0,
  });

  const totalSpent = myPayments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const activeBookings = myBookings.filter(b => ["pending", "confirmed", "in_progress"].includes(b.status)).length;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400", confirmed: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-purple-500/20 text-purple-400", completed: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}! 👋</h1>
        <p className="text-muted-foreground mt-1">Here's a summary of your travel activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">{myBookings.length}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Trips</CardTitle>
            <MapPin className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">{activeBookings}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">My Recent Bookings</CardTitle>
            <Link to="/dashboard/bookings"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {myBookings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm mb-3">No bookings yet. Start exploring!</p>
                <Link to="/tours"><Button variant="brand" size="sm">Browse Tours</Button></Link>
              </div>
            ) : myBookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.destination || "—"} · {b.pax} traveler(s)</p>
                </div>
                <Badge variant="secondary" className={statusColors[b.status] || ""}>{b.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Recent Payments</CardTitle>
            <Link to="/dashboard/payments"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {myPayments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No payments yet.</p>
            ) : myPayments.slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">${Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground capitalize">{p.method || "—"} · {p.paid_at ? format(new Date(p.paid_at), "dd MMM yyyy") : "Pending"}</p>
                </div>
                <Badge variant="secondary" className={p.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>{p.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Ready for your next adventure?</p>
        <div className="flex gap-3 justify-center">
          <Link to="/tours"><Button variant="brand">Explore Tours</Button></Link>
          <Link to="/packages"><Button variant="outline">View Packages</Button></Link>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ profile }: { profile: any }) {
  const { data: leadCount } = useQuery({
    queryKey: ["lead-count"], queryFn: async () => { const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }); return count || 0; },
  });
  const { data: bookingCount } = useQuery({
    queryKey: ["booking-count"], queryFn: async () => { const { count } = await supabase.from("bookings").select("*", { count: "exact", head: true }); return count || 0; },
  });
  const { data: customerCount } = useQuery({
    queryKey: ["customer-count"], queryFn: async () => { const { count } = await supabase.from("customers").select("*", { count: "exact", head: true }); return count || 0; },
  });
  const { data: revenue } = useQuery({
    queryKey: ["total-revenue"],
    queryFn: async () => {
      const { data } = await supabase.from("payments").select("amount, status");
      if (!data) return 0;
      return data.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
    },
  });
  const { data: recentLeads = [] } = useQuery({
    queryKey: ["recent-leads"],
    queryFn: async () => { const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5); return data || []; },
  });
  const { data: recentBookings = [] } = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: async () => { const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5); return data || []; },
  });
  const { data: upcomingDepartures = [] } = useQuery({
    queryKey: ["upcoming-departures"],
    queryFn: async () => {
      const { data } = await supabase.from("tour_departures").select("*, tours(title)").gte("departure_date", new Date().toISOString().split("T")[0]).order("departure_date").limit(5);
      return data || [];
    },
  });

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400", contacted: "bg-yellow-500/20 text-yellow-400", quoted: "bg-purple-500/20 text-purple-400",
    pending: "bg-yellow-500/20 text-yellow-400", confirmed: "bg-blue-500/20 text-blue-400", completed: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400", won: "bg-green-500/20 text-green-400", lost: "bg-red-500/20 text-red-400",
  };

  const stats = [
    { label: "Total Leads", value: leadCount ?? 0, icon: TrendingUp, color: "text-primary" },
    { label: "Bookings", value: bookingCount ?? 0, icon: CalendarDays, color: "text-primary" },
    { label: "Customers", value: customerCount ?? 0, icon: Users, color: "text-primary" },
    { label: "Revenue", value: `$${(revenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your travel business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold text-foreground">{stat.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg font-display">Recent Leads</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.length === 0 ? <p className="text-muted-foreground text-sm">No leads yet.</p> :
              recentLeads.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{l.full_name}</p>
                    <p className="text-xs text-muted-foreground">{l.destination || "No destination"}</p>
                  </div>
                  <Badge variant="secondary" className={statusColors[l.status] || ""}>{l.status}</Badge>
                </div>
              ))
            }
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg font-display">Recent Bookings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.length === 0 ? <p className="text-muted-foreground text-sm">No bookings yet.</p> :
              recentBookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{b.reference_number}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className={statusColors[b.status] || ""}>{b.status}</Badge>
                    <p className="text-xs font-medium text-foreground mt-1">${Number(b.total_amount).toLocaleString()}</p>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg font-display">Upcoming Departures</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upcomingDepartures.length === 0 ? <p className="text-muted-foreground text-sm">No upcoming departures.</p> :
              upcomingDepartures.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.tours?.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" />{format(new Date(d.departure_date), "dd MMM yyyy")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-foreground font-medium">{d.booked_seats}/{d.total_seats} seats</p>
                    <p className="text-xs text-muted-foreground">{d.total_seats - d.booked_seats} available</p>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
