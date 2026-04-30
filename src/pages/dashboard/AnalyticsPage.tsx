import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, DollarSign, Users, CalendarDays } from "lucide-react";

const COLORS = ["hsl(210,80%,55%)", "hsl(150,60%,45%)", "hsl(40,90%,55%)", "hsl(0,70%,55%)", "hsl(270,60%,55%)", "hsl(180,60%,45%)", "hsl(330,60%,55%)", "hsl(60,70%,50%)"];

export default function AnalyticsPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const { data: bookings = [] } = useQuery({
    queryKey: ["analytics-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*").order("created_at");
      return data || [];
    },
  });

  const { data: tours = [] } = useQuery({
    queryKey: ["analytics-tours"],
    queryFn: async () => {
      const { data } = await supabase.from("tours").select("*");
      return data || [];
    },
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["analytics-leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*");
      return data || [];
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["analytics-payments"],
    queryFn: async () => {
      const { data } = await supabase.from("payments").select("*");
      return data || [];
    },
  });

  const categories = [...new Set(tours.map(t => t.category).filter(Boolean))] as string[];
  const locations = [...new Set(tours.map(t => t.destination).filter(Boolean))] as string[];

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (categoryFilter !== "all") {
      const tour = tours.find(t => t.title === b.title);
      if (!tour || tour.category !== categoryFilter) return false;
    }
    if (locationFilter !== "all" && b.destination !== locationFilter) return false;
    return true;
  });

  // Revenue by month
  const revenueByMonth = filteredBookings.reduce((acc, b) => {
    const month = new Date(b.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    acc[month] = (acc[month] || 0) + Number(b.total_amount);
    return acc;
  }, {} as Record<string, number>);
  const revenueChartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));

  // Bookings by status
  const bookingsByStatus = filteredBookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusChartData = Object.entries(bookingsByStatus).map(([name, value]) => ({ name, value }));

  // Bookings by category
  const bookingsByCategory = filteredBookings.reduce((acc, b) => {
    const tour = tours.find(t => t.title === b.title);
    const cat = tour?.category || b.booking_type || "other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryChartData = Object.entries(bookingsByCategory).map(([name, value]) => ({ name, value }));

  // Revenue by destination
  const revenueByDest = filteredBookings.reduce((acc, b) => {
    const dest = b.destination || "Unknown";
    acc[dest] = (acc[dest] || 0) + Number(b.total_amount);
    return acc;
  }, {} as Record<string, number>);
  const destChartData = Object.entries(revenueByDest).map(([destination, revenue]) => ({ destination, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  // Lead conversion
  const leadsByStatus = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const leadChartData = Object.entries(leadsByStatus).map(([name, value]) => ({ name, value }));

  // Payment methods
  const paymentsByMethod = payments.reduce((acc, p) => {
    const method = p.method || "Unknown";
    acc[method] = (acc[method] || 0) + Number(p.amount);
    return acc;
  }, {} as Record<string, number>);
  const paymentMethodData = Object.entries(paymentsByMethod).map(([name, value]) => ({ name, value }));

  const totalRevenue = filteredBookings.reduce((s, b) => s + Number(b.total_amount), 0);
  const totalPaid = filteredBookings.reduce((s, b) => s + Number(b.paid_amount), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm">Sales reports & performance insights.</p>
        </div>
        <div className="flex gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-xl font-bold text-foreground">£{totalRevenue.toLocaleString()}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-500" /></div>
              <div><p className="text-xs text-muted-foreground">Collected</p><p className="text-xl font-bold text-foreground">£{totalPaid.toLocaleString()}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><CalendarDays className="h-5 w-5 text-accent" /></div>
              <div><p className="text-xs text-muted-foreground">Bookings</p><p className="text-xl font-bold text-foreground">{filteredBookings.length}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-purple-500" /></div>
              <div><p className="text-xs text-muted-foreground">Leads</p><p className="text-xl font-bold text-foreground">{leads.length}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Bookings by Status</CardTitle></CardHeader>
          <CardContent>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `£{name}: ${value}`} dataKey="value">
                    {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Bookings by Category</CardTitle></CardHeader>
          <CardContent>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Revenue by Destination</CardTitle></CardHeader>
          <CardContent>
            {destChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={destChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis dataKey="destination" type="category" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="revenue" fill="hsl(150,60%,45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Lead Pipeline</CardTitle></CardHeader>
          <CardContent>
            {leadChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={leadChartData} cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `£{name}: ${value}`} dataKey="value">
                    {leadChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Payment Methods</CardTitle></CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="value" fill="hsl(40,90%,55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm py-8 text-center">No data yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
