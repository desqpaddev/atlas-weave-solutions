import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MapPin, Clock, Plane, Hotel, Map, Car } from "lucide-react";
import { toast } from "sonner";

export default function PackagesPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", destination: "", duration_days: 1, duration_nights: 0,
    base_price: 0, description: "",
    includes_flight: false, includes_hotel: false, includes_tour: false, includes_transfer: false,
    is_customizable: true,
    inclusions: "", exclusions: "", highlights: "",
  });

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createPackage = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const { error } = await supabase.from("packages").insert({
        company_id: profile.company_id,
        title: form.title,
        slug,
        destination: form.destination || null,
        duration_days: form.duration_days,
        duration_nights: form.duration_nights,
        base_price: form.base_price,
        description: form.description || null,
        includes_flight: form.includes_flight,
        includes_hotel: form.includes_hotel,
        includes_tour: form.includes_tour,
        includes_transfer: form.includes_transfer,
        is_customizable: form.is_customizable,
        inclusions: form.inclusions ? form.inclusions.split(",").map((s) => s.trim()) : [],
        exclusions: form.exclusions ? form.exclusions.split(",").map((s) => s.trim()) : [],
        highlights: form.highlights ? form.highlights.split(",").map((s) => s.trim()) : [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setOpen(false);
      setForm({ title: "", destination: "", duration_days: 1, duration_nights: 0, base_price: 0, description: "", includes_flight: false, includes_hotel: false, includes_tour: false, includes_transfer: false, is_customizable: true, inclusions: "", exclusions: "", highlights: "" });
      toast.success("Package created!");
    },
    onError: (e) => toast.error(e.message),
  });

  const IncludesIcons = ({ pkg }: { pkg: any }) => (
    <div className="flex gap-1.5">
      {pkg.includes_flight && <Plane className="h-3.5 w-3.5 text-blue-400" />}
      {pkg.includes_hotel && <Hotel className="h-3.5 w-3.5 text-purple-400" />}
      {pkg.includes_tour && <Map className="h-3.5 w-3.5 text-green-400" />}
      {pkg.includes_transfer && <Car className="h-3.5 w-3.5 text-yellow-400" />}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Holiday Packages</h1>
          <p className="text-muted-foreground text-sm">Pre-built travel packages combining flights, hotels & tours.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Package</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Package</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-foreground">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Bali Honeymoon Package" className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Destination</Label>
                  <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Bali, Indonesia" className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Base Price ($)</Label>
                  <Input type="number" min={0} value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Days</Label>
                  <Input type="number" min={1} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Nights</Label>
                  <Input type="number" min={0} value={form.duration_nights} onChange={(e) => setForm({ ...form, duration_nights: Number(e.target.value) })} className="bg-secondary border-border" />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Includes</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "includes_flight" as const, label: "Flights", icon: Plane },
                    { key: "includes_hotel" as const, label: "Hotels", icon: Hotel },
                    { key: "includes_tour" as const, label: "Tours", icon: Map },
                    { key: "includes_transfer" as const, label: "Transfers", icon: Car },
                  ].map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                      <Checkbox checked={form[key]} onCheckedChange={(c) => setForm({ ...form, [key]: !!c })} />
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="flex w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Inclusions (comma-separated)</Label>
                <Input value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} placeholder="Airport transfer, Breakfast daily" className="bg-secondary border-border" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Exclusions (comma-separated)</Label>
                <Input value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} placeholder="Visa fees, Personal expenses" className="bg-secondary border-border" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <Checkbox checked={form.is_customizable} onCheckedChange={(c) => setForm({ ...form, is_customizable: !!c })} />
                Allow customers to customize this package
              </label>
              <Button variant="hero" onClick={() => createPackage.mutate()} disabled={!form.title || createPackage.isPending}>
                {createPackage.isPending ? "Creating..." : "Create Package"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Package</TableHead>
              <TableHead className="hidden md:table-cell">Destination</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead>Includes</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : packages.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No packages yet. Create your first package!</TableCell></TableRow>
            ) : (
              packages.map((p) => (
                <TableRow key={p.id} className="border-border">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{p.title}</p>
                      {p.is_customizable && <p className="text-xs text-muted-foreground">Customizable</p>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3" /> {p.destination || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="h-3 w-3" /> {p.duration_days}D/{p.duration_nights}N
                    </span>
                  </TableCell>
                  <TableCell><IncludesIcons pkg={p} /></TableCell>
                  <TableCell className="text-foreground font-medium">
                    ${Number(p.base_price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {p.is_active ? "Active" : "Inactive"}
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
