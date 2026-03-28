import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Clock, Pencil, Trash2, Eye, X } from "lucide-react";
import { toast } from "sonner";

const defaultCategories = ["tour", "activity", "experience", "adventure", "cultural", "cruise", "wildlife", "honeymoon", "pilgrimage", "trekking"];

const emptyForm = { title: "", destination: "", duration_days: 1, duration_nights: 0, adult_price: 0, child_price: 0, category: "tour", difficulty: "easy", max_group_size: 20, description: "", inclusions: "", exclusions: "", highlights: "", is_active: true, cover_image: "", newCategory: "" };

export default function ToursPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Fetch distinct categories from existing tours
  const { data: dynamicCategories = [] } = useQuery({
    queryKey: ["tour-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("tours").select("category");
      if (!data) return [];
      const cats = [...new Set(data.map(t => t.category).filter(Boolean))] as string[];
      return cats;
    },
  });

  const allCategories = [...new Set([...defaultCategories, ...dynamicCategories])].sort();

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tours").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const category = form.category === "__new__" ? form.newCategory.trim().toLowerCase() : form.category;
      if (!category) throw new Error("Category is required");
      const payload = {
        company_id: profile.company_id, title: form.title, slug, destination: form.destination || null,
        duration_days: form.duration_days, duration_nights: form.duration_nights, adult_price: form.adult_price,
        child_price: form.child_price, category, difficulty: form.difficulty,
        max_group_size: form.max_group_size || null, description: form.description || null, is_active: form.is_active,
        cover_image: form.cover_image || null,
        inclusions: form.inclusions ? form.inclusions.split(",").map(s => s.trim()) : [],
        exclusions: form.exclusions ? form.exclusions.split(",").map(s => s.trim()) : [],
        highlights: form.highlights ? form.highlights.split(",").map(s => s.trim()) : [],
      };
      if (editId) { const { error } = await supabase.from("tours").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("tours").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tours"] }); qc.invalidateQueries({ queryKey: ["tour-categories"] }); toast.success(editId ? "Tour updated!" : "Tour created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("tours").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tours"] }); toast.success("Tour deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (t: any) => {
    setEditId(t.id);
    setForm({ title: t.title, destination: t.destination || "", duration_days: t.duration_days, duration_nights: t.duration_nights, adult_price: Number(t.adult_price), child_price: Number(t.child_price || 0), category: t.category || "tour", difficulty: t.difficulty || "easy", max_group_size: t.max_group_size || 20, description: t.description || "", is_active: t.is_active ?? true, inclusions: (t.inclusions || []).join(", "), exclusions: (t.exclusions || []).join(", "), highlights: (t.highlights || []).join(", "), cover_image: t.cover_image || "", newCategory: "" });
    setOpen(true);
  };
  const viewTour = tours.find(t => t.id === viewId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Tours & Activities</h1><p className="text-muted-foreground text-sm">Create and manage tours, activities, and experiences.</p></div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Tour</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">{editId ? "Edit Tour" : "Create Tour"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4 py-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Destination</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="mt-1" /></div>
                <div>
                  <Label>Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                    {allCategories.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    <option value="__new__">+ Add New Category</option>
                  </select>
                  {form.category === "__new__" && (
                    <Input placeholder="Enter new category" value={form.newCategory} onChange={(e) => setForm({ ...form, newCategory: e.target.value })} className="mt-2" />
                  )}
                </div>
              </div>
              <div><Label>Cover Image URL</Label><Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." className="mt-1" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Days</Label><Input type="number" min={1} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label>Nights</Label><Input type="number" min={0} value={form.duration_nights} onChange={(e) => setForm({ ...form, duration_nights: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label>Max Group</Label><Input type="number" min={1} value={form.max_group_size} onChange={(e) => setForm({ ...form, max_group_size: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Adult Price ($)</Label><Input type="number" min={0} value={form.adult_price} onChange={(e) => setForm({ ...form, adult_price: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label>Child Price ($)</Label><Input type="number" min={0} value={form.child_price} onChange={(e) => setForm({ ...form, child_price: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <div><Label>Description</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div><Label>Inclusions (comma-separated)</Label><Input value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} className="mt-1" /></div>
              <div><Label>Exclusions (comma-separated)</Label><Input value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} className="mt-1" /></div>
              <div><Label>Highlights (comma-separated)</Label><Input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} className="mt-1" /></div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground"><Checkbox checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: !!c })} /> Active</label>
              <Button variant="brand" disabled={!form.title || save.isPending}>{save.isPending ? "Saving..." : editId ? "Update Tour" : "Create Tour"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Tour</TableHead><TableHead className="hidden md:table-cell">Destination</TableHead><TableHead className="hidden sm:table-cell">Duration</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
            tours.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No tours yet.</TableCell></TableRow> :
            tours.map((t) => (
              <TableRow key={t.id} className="border-border">
                <TableCell><div><p className="font-medium text-foreground">{t.title}</p><p className="text-xs text-muted-foreground capitalize">{t.category}</p></div></TableCell>
                <TableCell className="hidden md:table-cell"><span className="flex items-center gap-1 text-muted-foreground text-sm"><MapPin className="h-3 w-3" /> {t.destination || "—"}</span></TableCell>
                <TableCell className="hidden sm:table-cell"><span className="flex items-center gap-1 text-muted-foreground text-sm"><Clock className="h-3 w-3" /> {t.duration_days}D/{t.duration_nights}N</span></TableCell>
                <TableCell className="text-foreground font-medium">${Number(t.adult_price).toLocaleString()}</TableCell>
                <TableCell><Badge variant="secondary" className={t.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>{t.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(t.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this tour?")) remove.mutate(t.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Tour Details</DialogTitle></DialogHeader>
          {viewTour && (
            <div className="space-y-3 text-sm">
              {viewTour.cover_image && <img src={viewTour.cover_image} alt={viewTour.title} className="w-full h-40 object-cover rounded-lg" />}
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Title</p><p className="font-medium text-foreground">{viewTour.title}</p></div>
                <div><p className="text-muted-foreground">Destination</p><p className="text-foreground">{viewTour.destination || "—"}</p></div>
                <div><p className="text-muted-foreground">Duration</p><p className="text-foreground">{viewTour.duration_days}D / {viewTour.duration_nights}N</p></div>
                <div><p className="text-muted-foreground">Category</p><p className="text-foreground capitalize">{viewTour.category}</p></div>
                <div><p className="text-muted-foreground">Adult Price</p><p className="text-foreground">${Number(viewTour.adult_price).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Child Price</p><p className="text-foreground">${Number(viewTour.child_price || 0).toLocaleString()}</p></div>
              </div>
              {viewTour.description && <div><p className="text-muted-foreground">Description</p><p className="text-foreground">{viewTour.description}</p></div>}
              {viewTour.highlights && (viewTour.highlights as string[]).length > 0 && <div><p className="text-muted-foreground">Highlights</p><p className="text-foreground">{(viewTour.highlights as string[]).join(", ")}</p></div>}
              {viewTour.inclusions && (viewTour.inclusions as string[]).length > 0 && <div><p className="text-muted-foreground">Inclusions</p><p className="text-foreground">{(viewTour.inclusions as string[]).join(", ")}</p></div>}
              {viewTour.exclusions && (viewTour.exclusions as string[]).length > 0 && <div><p className="text-muted-foreground">Exclusions</p><p className="text-foreground">{(viewTour.exclusions as string[]).join(", ")}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
