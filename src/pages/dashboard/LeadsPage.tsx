import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type LeadStatus = Database["public"]["Enums"]["lead_status"];
const statusColors: Record<LeadStatus, string> = { new: "bg-blue-500/20 text-blue-400", contacted: "bg-yellow-500/20 text-yellow-400", quoted: "bg-purple-500/20 text-purple-400", negotiating: "bg-orange-500/20 text-orange-400", won: "bg-green-500/20 text-green-400", lost: "bg-red-500/20 text-red-400" };
const emptyForm = { full_name: "", email: "", phone: "", destination: "", budget: "", notes: "", source: "website", status: "new" as LeadStatus, pax: 1, travel_dates: "" };

export default function LeadsPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"], queryFn: async () => { const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const payload = { company_id: profile.company_id, full_name: form.full_name, email: form.email || null, phone: form.phone || null, destination: form.destination || null, budget: form.budget ? parseFloat(form.budget) : null, notes: form.notes || null, source: form.source, status: form.status as LeadStatus, pax: form.pax, travel_dates: form.travel_dates || null };
      if (editId) { const { error } = await supabase.from("leads").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("leads").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success(editId ? "Lead updated!" : "Lead created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("leads").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Lead deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (l: any) => { setEditId(l.id); setForm({ full_name: l.full_name, email: l.email || "", phone: l.phone || "", destination: l.destination || "", budget: l.budget?.toString() || "", notes: l.notes || "", source: l.source || "website", status: l.status, pax: l.pax || 1, travel_dates: l.travel_dates || "" }); setOpen(true); };
  const viewLead = leads.find(l => l.id === viewId);

  const filtered = leads.filter(l => l.full_name.toLowerCase().includes(search.toLowerCase()) || (l.email?.toLowerCase().includes(search.toLowerCase()) ?? false) || (l.destination?.toLowerCase().includes(search.toLowerCase()) ?? false));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Leads</h1><p className="text-muted-foreground text-sm">Track and manage your sales pipeline.</p></div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Lead</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editId ? "Edit Lead" : "New Lead"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div><Label>Full Name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Destination</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="mt-1" /></div>
                <div><Label>Budget</Label><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Source</Label><Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="social">Social Media</SelectItem><SelectItem value="phone">Phone</SelectItem><SelectItem value="walk-in">Walk-in</SelectItem></SelectContent></Select></div>
                <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{(["new","contacted","quoted","negotiating","won","lost"] as LeadStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Travelers</Label><Input type="number" min={1} value={form.pax} onChange={(e) => setForm({ ...form, pax: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label>Travel Dates</Label><Input value={form.travel_dates} onChange={(e) => setForm({ ...form, travel_dates: e.target.value })} placeholder="e.g. Dec 2026" className="mt-1" /></div>
              </div>
              <div><Label>Notes</Label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <Button variant="brand" className="w-full" disabled={save.isPending}>{save.isPending ? "Saving..." : editId ? "Update Lead" : "Create Lead"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Email</TableHead><TableHead className="hidden sm:table-cell">Destination</TableHead><TableHead>Status</TableHead><TableHead className="hidden lg:table-cell">Budget</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
            filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No leads found.</TableCell></TableRow> :
            filtered.map((l) => (
              <TableRow key={l.id} className="border-border">
                <TableCell className="font-medium text-foreground">{l.full_name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{l.email || "—"}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{l.destination || "—"}</TableCell>
                <TableCell><Badge variant="secondary" className={statusColors[l.status as LeadStatus]}>{l.status}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{l.budget ? `$${Number(l.budget).toLocaleString()}` : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(l.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(l)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this lead?")) remove.mutate(l.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="font-display">Lead Details</DialogTitle></DialogHeader>
          {viewLead && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Name</p><p className="font-medium text-foreground">{viewLead.full_name}</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge variant="secondary" className={statusColors[viewLead.status as LeadStatus]}>{viewLead.status}</Badge></div>
                <div><p className="text-muted-foreground">Email</p><p className="text-foreground">{viewLead.email || "—"}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="text-foreground">{viewLead.phone || "—"}</p></div>
                <div><p className="text-muted-foreground">Destination</p><p className="text-foreground">{viewLead.destination || "—"}</p></div>
                <div><p className="text-muted-foreground">Budget</p><p className="text-foreground">{viewLead.budget ? `$${Number(viewLead.budget).toLocaleString()}` : "—"}</p></div>
                <div><p className="text-muted-foreground">Source</p><p className="text-foreground">{viewLead.source || "—"}</p></div>
                <div><p className="text-muted-foreground">Travelers</p><p className="text-foreground">{viewLead.pax}</p></div>
              </div>
              {viewLead.notes && <div><p className="text-muted-foreground">Notes</p><p className="text-foreground whitespace-pre-wrap">{viewLead.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
