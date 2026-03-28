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
import { Plus, MapPin, Clock, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function ToursPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", destination: "", duration_days: 1, duration_nights: 0,
    adult_price: 0, child_price: 0, category: "tour", difficulty: "easy",
    max_group_size: 20, description: "",
    inclusions: "", exclusions: "", highlights: "",
  });

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createTour = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const { error } = await supabase.from("tours").insert({
        company_id: profile.company_id,
        title: form.title,
        slug,
        destination: form.destination || null,
        duration_days: form.duration_days,
        duration_nights: form.duration_nights,
        adult_price: form.adult_price,
        child_price: form.child_price,
        category: form.category,
        difficulty: form.difficulty,
        max_group_size: form.max_group_size || null,
        description: form.description || null,
        inclusions: form.inclusions ? form.inclusions.split(",").map((s) => s.trim()) : [],
        exclusions: form.exclusions ? form.exclusions.split(",").map((s) => s.trim()) : [],
        highlights: form.highlights ? form.highlights.split(",").map((s) => s.trim()) : [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      setOpen(false);
      setForm({ title: "", destination: "", duration_days: 1, duration_nights: 0, adult_price: 0, child_price: 0, category: "tour", difficulty: "easy", max_group_size: 20, description: "", inclusions: "", exclusions: "", highlights: "" });
      toast.success("Tour created!");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Tours & Activities</h1>
          <p className="text-muted-foreground text-sm">Create and manage tours, activities, and experiences.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Tour</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Tour</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-foreground">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Bali Adventure Tour" className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Destination</Label>
                  <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Bali, Indonesia" className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
                    <option value="tour">Tour</option>
                    <option value="activity">Activity</option>
                    <option value="experience">Experience</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Days</Label>
                  <Input type="number" min={1} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Nights</Label>
                  <Input type="number" min={0} value={form.duration_nights} onChange={(e) => setForm({ ...form, duration_nights: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Max Group</Label>
                  <Input type="number" min={1} value={form.max_group_size} onChange={(e) => setForm({ ...form, max_group_size: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Adult Price ($)</Label>
                  <Input type="number" min={0} value={form.adult_price} onChange={(e) => setForm({ ...form, adult_price: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Child Price ($)</Label>
                  <Input type="number" min={0} value={form.child_price} onChange={(e) => setForm({ ...form, child_price: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the tour..." className="flex w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Inclusions (comma-separated)</Label>
                <Input value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} placeholder="Meals, Transport, Guide" className="bg-secondary border-border" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Exclusions (comma-separated)</Label>
                <Input value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} placeholder="Flights, Insurance, Tips" className="bg-secondary border-border" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Highlights (comma-separated)</Label>
                <Input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Sunrise trek, Temple visit" className="bg-secondary border-border" />
              </div>
              <Button variant="hero" onClick={() => createTour.mutate()} disabled={!form.title || createTour.isPending}>
                {createTour.isPending ? "Creating..." : "Create Tour"}
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
              <TableHead className="hidden md:table-cell">Destination</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : tours.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tours yet. Create your first tour!</TableCell></TableRow>
            ) : (
              tours.map((t) => (
                <TableRow key={t.id} className="border-border">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{t.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{t.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3" /> {t.destination || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="h-3 w-3" /> {t.duration_days}D/{t.duration_nights}N
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    ${Number(t.adult_price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={t.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {t.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
