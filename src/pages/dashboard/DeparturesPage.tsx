import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DeparturesPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tour_id: "", departure_date: "", return_date: "", total_seats: 20,
    price_override: "", booking_cutoff_date: "", notes: "",
  });

  const { data: tours = [] } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tours").select("id, title").order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: departures = [], isLoading } = useQuery({
    queryKey: ["departures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_departures")
        .select("*, tours(title)")
        .order("departure_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createDeparture = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      if (!form.tour_id || !form.departure_date) throw new Error("Tour and departure date required");
      const { error } = await supabase.from("tour_departures").insert({
        company_id: profile.company_id,
        tour_id: form.tour_id,
        departure_date: form.departure_date,
        return_date: form.return_date || null,
        total_seats: form.total_seats,
        price_override: form.price_override ? Number(form.price_override) : null,
        booking_cutoff_date: form.booking_cutoff_date || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departures"] });
      setOpen(false);
      setForm({ tour_id: "", departure_date: "", return_date: "", total_seats: 20, price_override: "", booking_cutoff_date: "", notes: "" });
      toast.success("Departure created!");
    },
    onError: (e) => toast.error(e.message),
  });

  const statusColor: Record<string, string> = {
    open: "bg-green-500/20 text-green-400",
    closed: "bg-red-500/20 text-red-400",
    full: "bg-yellow-500/20 text-yellow-400",
    cancelled: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Fixed Departures</h1>
          <p className="text-muted-foreground text-sm">Manage group tour departures with seat inventory.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Departure</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Departure</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-foreground">Tour *</Label>
                <select value={form.tour_id} onChange={(e) => setForm({ ...form, tour_id: e.target.value })} className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
                  <option value="">Select a tour</option>
                  {tours.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Departure Date *</Label>
                  <Input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Return Date</Label>
                  <Input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Total Seats</Label>
                  <Input type="number" min={1} value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Price Override ($)</Label>
                  <Input type="number" min={0} value={form.price_override} onChange={(e) => setForm({ ...form, price_override: e.target.value })} placeholder="Optional" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Booking Cutoff Date</Label>
                <Input type="date" value={form.booking_cutoff_date} onChange={(e) => setForm({ ...form, booking_cutoff_date: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Notes</Label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="flex w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
              <Button variant="hero" onClick={() => createDeparture.mutate()} disabled={!form.tour_id || !form.departure_date || createDeparture.isPending}>
                {createDeparture.isPending ? "Creating..." : "Create Departure"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Tour</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : departures.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No departures yet.</TableCell></TableRow>
            ) : (
              departures.map((d: any) => {
                const available = d.total_seats - d.booked_seats;
                return (
                  <TableRow key={d.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{d.tours?.title || "—"}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(d.departure_date), "dd MMM yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground font-medium">{d.booked_seats}</span>
                        <span className="text-muted-foreground">/ {d.total_seats}</span>
                        {d.waitlist_count > 0 && (
                          <Badge variant="secondary" className="ml-1 bg-yellow-500/20 text-yellow-400 text-xs">
                            +{d.waitlist_count} WL
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor[d.status] || "bg-gray-500/20 text-gray-400"}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-foreground font-medium">
                      {d.price_override ? `$${Number(d.price_override).toLocaleString()}` : "Default"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
