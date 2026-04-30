import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Users, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const emptyForm = { tour_id: "", departure_date: "", return_date: "", total_seats: 20, price_override: "", booking_cutoff_date: "", notes: "", status: "open" };

export default function DeparturesPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: tours = [] } = useQuery({
    queryKey: ["tours"], queryFn: async () => { const { data, error } = await supabase.from("tours").select("id, title").order("title"); if (error) throw error; return data; },
  });

  const { data: departures = [], isLoading } = useQuery({
    queryKey: ["departures"], queryFn: async () => { const { data, error } = await supabase.from("tour_departures").select("*, tours(title)").order("departure_date", { ascending: true }); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      if (!form.tour_id || !form.departure_date) throw new Error("Tour and date required");
      const payload = { company_id: profile.company_id, tour_id: form.tour_id, departure_date: form.departure_date, return_date: form.return_date || null, total_seats: form.total_seats, price_override: form.price_override ? Number(form.price_override) : null, booking_cutoff_date: form.booking_cutoff_date || null, notes: form.notes || null, status: form.status };
      if (editId) { const { error } = await supabase.from("tour_departures").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("tour_departures").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["departures"] }); toast.success(editId ? "Departure updated!" : "Departure created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("tour_departures").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["departures"] }); toast.success("Departure deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (d: any) => { setEditId(d.id); setForm({ tour_id: d.tour_id, departure_date: d.departure_date, return_date: d.return_date || "", total_seats: d.total_seats, price_override: d.price_override?.toString() || "", booking_cutoff_date: d.booking_cutoff_date || "", notes: d.notes || "", status: d.status }); setOpen(true); };
  const viewDep = departures.find(d => d.id === viewId);

  const statusColor: Record<string, string> = { open: "bg-green-500/20 text-green-400", closed: "bg-red-500/20 text-red-400", full: "bg-yellow-500/20 text-yellow-400", cancelled: "bg-gray-500/20 text-gray-400" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Fixed Departures</h1><p className="text-muted-foreground text-sm">Manage group tour departures with seat inventory.</p></div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Departure</Button></DialogTrigger>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">{editId ? "Edit Departure" : "Create Departure"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4 py-2">
              <div><Label>Tour *</Label><select value={form.tour_id} onChange={(e) => setForm({ ...form, tour_id: e.target.value })} className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option value="">Select a tour</option>{tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Departure Date *</Label><Input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} className="mt-1" /></div>
                <div><Label>Return Date</Label><Input type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Total Seats</Label><Input type="number" min={1} value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label>Price Override ($)</Label><Input type="number" min={0} value={form.price_override} onChange={(e) => setForm({ ...form, price_override: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Cutoff Date</Label><Input type="date" value={form.booking_cutoff_date} onChange={(e) => setForm({ ...form, booking_cutoff_date: e.target.value })} className="mt-1" /></div>
                <div><Label>Status</Label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option value="open">Open</option><option value="closed">Closed</option><option value="full">Full</option><option value="cancelled">Cancelled</option></select></div>
              </div>
              <div><Label>Notes</Label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <Button variant="brand" disabled={!form.tour_id || !form.departure_date || save.isPending}>{save.isPending ? "Saving..." : editId ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Tour</TableHead><TableHead>Dates</TableHead><TableHead>Seats</TableHead><TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Price</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
            departures.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No departures yet.</TableCell></TableRow> :
            departures.map((d: any) => (
              <TableRow key={d.id} className="border-border">
                <TableCell className="font-medium text-foreground">{d.tours?.title || "—"}</TableCell>
                <TableCell><span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3 w-3" />{format(new Date(d.departure_date), "dd MMM yyyy")}</span></TableCell>
                <TableCell><span className="flex items-center gap-1 text-sm"><Users className="h-3 w-3 text-muted-foreground" /><span className="text-foreground font-medium">{d.booked_seats}</span><span className="text-muted-foreground">/ {d.total_seats}</span>{d.waitlist_count > 0 && <Badge variant="secondary" className="ml-1 bg-yellow-500/20 text-yellow-400 text-xs">+{d.waitlist_count} WL</Badge>}</span></TableCell>
                <TableCell><Badge variant="secondary" className={statusColor[d.status] || "bg-gray-500/20 text-gray-400"}>{d.status}</Badge></TableCell>
                <TableCell className="hidden sm:table-cell text-foreground font-medium">{d.price_override ? `£${Number(d.price_override).toLocaleString()}` : "Default"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(d.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(d)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this departure?")) remove.mutate(d.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="font-display">Departure Details</DialogTitle></DialogHeader>
          {viewDep && (
            <div className="space-y-3 text-sm grid grid-cols-2 gap-3">
              <div><p className="text-muted-foreground">Tour</p><p className="font-medium text-foreground">{(viewDep as any).tours?.title}</p></div>
              <div><p className="text-muted-foreground">Status</p><Badge variant="secondary" className={statusColor[viewDep.status] || ""}>{viewDep.status}</Badge></div>
              <div><p className="text-muted-foreground">Departure</p><p className="text-foreground">{format(new Date(viewDep.departure_date), "dd MMM yyyy")}</p></div>
              <div><p className="text-muted-foreground">Return</p><p className="text-foreground">{viewDep.return_date ? format(new Date(viewDep.return_date), "dd MMM yyyy") : "—"}</p></div>
              <div><p className="text-muted-foreground">Seats</p><p className="text-foreground">{viewDep.booked_seats} / {viewDep.total_seats}</p></div>
              <div><p className="text-muted-foreground">Price Override</p><p className="text-foreground">{viewDep.price_override ? `£${Number(viewDep.price_override).toLocaleString()}` : "Default"}</p></div>
              {viewDep.notes && <div className="col-span-2"><p className="text-muted-foreground">Notes</p><p className="text-foreground">{viewDep.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
