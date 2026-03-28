import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const emptyForm = { full_name: "", email: "", phone: "", commission_rate: 0, is_active: true };

export default function AgentsPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["agents"], queryFn: async () => { const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const payload = { company_id: profile.company_id, full_name: form.full_name, email: form.email, phone: form.phone || null, commission_rate: form.commission_rate, is_active: form.is_active };
      if (editId) { const { error } = await supabase.from("agents").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("agents").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["agents"] }); toast.success(editId ? "Agent updated!" : "Agent created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("agents").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["agents"] }); toast.success("Agent deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (a: any) => { setEditId(a.id); setForm({ full_name: a.full_name, email: a.email, phone: a.phone || "", commission_rate: a.commission_rate ?? 0, is_active: a.is_active ?? true }); setOpen(true); };
  const viewAgent = agents.find(a => a.id === viewId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Agents</h1><p className="text-muted-foreground text-sm">Manage travel agents and commission tracking.</p></div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Agent</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display">{editId ? "Edit Agent" : "New Agent"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div><Label>Full Name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-1" /></div>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
                <div><Label>Commission %</Label><Input type="number" min={0} max={100} value={form.commission_rate} onChange={(e) => setForm({ ...form, commission_rate: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground"><Checkbox checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: !!c })} /> Active</label>
              <Button variant="brand" className="w-full" disabled={save.isPending}>{save.isPending ? "Saving..." : editId ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Email</TableHead><TableHead className="hidden sm:table-cell">Commission %</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
            agents.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No agents yet.</TableCell></TableRow> :
            agents.map((a) => (
              <TableRow key={a.id} className="border-border">
                <TableCell className="font-medium text-foreground">{a.full_name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{a.email}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{a.commission_rate ?? 0}%</TableCell>
                <TableCell><Badge variant="secondary" className={a.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>{a.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(a.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this agent?")) remove.mutate(a.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="font-display">Agent Details</DialogTitle></DialogHeader>
          {viewAgent && (
            <div className="space-y-3 text-sm grid grid-cols-2 gap-3">
              <div><p className="text-muted-foreground">Name</p><p className="font-medium text-foreground">{viewAgent.full_name}</p></div>
              <div><p className="text-muted-foreground">Email</p><p className="text-foreground">{viewAgent.email}</p></div>
              <div><p className="text-muted-foreground">Phone</p><p className="text-foreground">{viewAgent.phone || "—"}</p></div>
              <div><p className="text-muted-foreground">Commission</p><p className="text-foreground">{viewAgent.commission_rate ?? 0}%</p></div>
              <div><p className="text-muted-foreground">Status</p><Badge variant="secondary" className={viewAgent.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>{viewAgent.is_active ? "Active" : "Inactive"}</Badge></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
