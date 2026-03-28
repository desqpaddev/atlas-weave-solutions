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
import { Plus, MapPin, Clock, Plane, Hotel, Map, Car, Trash2, GripVertical, Edit, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

type ItineraryDay = { day: number; title: string; description: string; activities: string[] };

const defaultForm = { title: "", destination: "", duration_days: 1, duration_nights: 0, base_price: 0, description: "", includes_flight: false, includes_hotel: false, includes_tour: false, includes_transfer: false, is_customizable: true, inclusions: "", exclusions: "", highlights: "" };

export default function PackagesPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [itineraryOpen, setItineraryOpen] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [formItinerary, setFormItinerary] = useState<ItineraryDay[]>([]);
  const [formNewActivity, setFormNewActivity] = useState<Record<number, string>>({});

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(defaultForm); setFormItinerary([]); setFormNewActivity({}); };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ title: p.title, destination: p.destination || "", duration_days: p.duration_days, duration_nights: p.duration_nights, base_price: Number(p.base_price), description: p.description || "", includes_flight: p.includes_flight ?? false, includes_hotel: p.includes_hotel ?? false, includes_tour: p.includes_tour ?? false, includes_transfer: p.includes_transfer ?? false, is_customizable: p.is_customizable ?? true, inclusions: (p.inclusions || []).join(", "), exclusions: (p.exclusions || []).join(", "), highlights: (p.highlights || []).join(", ") });
    setFormItinerary(Array.isArray(p.itinerary) ? (p.itinerary as unknown as ItineraryDay[]) : []);
    setOpen(true);
  };

  const savePackage = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const payload = {
        company_id: profile.company_id, title: form.title, slug,
        destination: form.destination || null, duration_days: form.duration_days, duration_nights: form.duration_nights,
        base_price: form.base_price, description: form.description || null,
        includes_flight: form.includes_flight, includes_hotel: form.includes_hotel, includes_tour: form.includes_tour, includes_transfer: form.includes_transfer,
        is_customizable: form.is_customizable,
        inclusions: form.inclusions ? form.inclusions.split(",").map((s) => s.trim()) : [],
        exclusions: form.exclusions ? form.exclusions.split(",").map((s) => s.trim()) : [],
        highlights: form.highlights ? form.highlights.split(",").map((s) => s.trim()) : [],
        itinerary: formItinerary.length > 0 ? (formItinerary as unknown as Json[]) : [],
      };
      if (editId) { const { error } = await supabase.from("packages").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("packages").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["packages"] }); toast.success(editId ? "Package updated!" : "Package created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const removePackage = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("packages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["packages"] }); toast.success("Package deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const viewPkg = packages.find(p => p.id === viewId);

  const IncludesIcons = ({ pkg }: { pkg: any }) => (
    <div className="flex gap-1.5">
      {pkg.includes_flight && <Plane className="h-3.5 w-3.5 text-primary" />}
      {pkg.includes_hotel && <Hotel className="h-3.5 w-3.5 text-primary" />}
      {pkg.includes_tour && <Map className="h-3.5 w-3.5 text-primary" />}
      {pkg.includes_transfer && <Car className="h-3.5 w-3.5 text-primary" />}
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
            <Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Package</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Package</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-foreground">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Bali Honeymoon Package" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Destination</Label>
                  <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Bali, Indonesia" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Base Price ($)</Label>
                  <Input type="number" min={0} value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-foreground">Days</Label>
                  <Input type="number" min={1} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Nights</Label>
                  <Input type="number" min={0} value={form.duration_nights} onChange={(e) => setForm({ ...form, duration_nights: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Includes</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: "includes_flight" as const, label: "Flights", icon: Plane },
                    { key: "includes_hotel" as const, label: "Hotels", icon: Hotel },
                    { key: "includes_tour" as const, label: "Tours", icon: Map },
                    { key: "includes_transfer" as const, label: "Transfers", icon: Car },
                  ]).map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                      <Checkbox checked={form[key]} onCheckedChange={(c) => setForm({ ...form, [key]: !!c })} />
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Highlights (comma-separated)</Label>
                <Input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Beach views, Private pool villa" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Inclusions (comma-separated)</Label>
                <Input value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} placeholder="Airport transfer, Breakfast daily" />
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Exclusions (comma-separated)</Label>
                <Input value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} placeholder="Visa fees, Personal expenses" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <Checkbox checked={form.is_customizable} onCheckedChange={(c) => setForm({ ...form, is_customizable: !!c })} />
                Allow customers to customize this package
              </label>

              {/* Inline Itinerary Builder */}
              <div className="border border-border rounded-xl p-4 bg-secondary/30">
                <Label className="text-foreground font-semibold mb-3 block">Day-wise Itinerary</Label>
                <div className="space-y-3">
                  {formItinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="border border-border rounded-lg p-3 bg-background">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">{day.day}</span>
                        <Input
                          value={day.title}
                          onChange={(e) => {
                            const updated = [...formItinerary];
                            updated[dayIndex].title = e.target.value;
                            setFormItinerary(updated);
                          }}
                          className="text-sm font-semibold"
                          placeholder="Day title"
                        />
                        <Button variant="ghost" size="icon" className="shrink-0 text-destructive h-7 w-7" onClick={() => {
                          setFormItinerary(formItinerary.filter((_, i) => i !== dayIndex).map((d, i) => ({ ...d, day: i + 1 })));
                        }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <textarea
                        value={day.description}
                        onChange={(e) => {
                          const updated = [...formItinerary];
                          updated[dayIndex].description = e.target.value;
                          setFormItinerary(updated);
                        }}
                        placeholder="Day description..."
                        rows={1}
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs placeholder:text-muted-foreground mb-2"
                      />
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-center gap-1.5 text-xs bg-secondary rounded px-2 py-1 mb-1">
                          <span className="flex-1 text-muted-foreground">{activity}</span>
                          <button onClick={() => {
                            const updated = [...formItinerary];
                            updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== actIndex);
                            setFormItinerary(updated);
                          }} className="text-destructive"><Trash2 className="h-2.5 w-2.5" /></button>
                        </div>
                      ))}
                      <div className="flex gap-1.5">
                        <Input
                          value={formNewActivity[dayIndex] || ""}
                          onChange={(e) => setFormNewActivity({ ...formNewActivity, [dayIndex]: e.target.value })}
                          placeholder="Add activity..."
                          className="text-xs h-7"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = formNewActivity[dayIndex]?.trim();
                              if (!val) return;
                              const updated = [...formItinerary];
                              updated[dayIndex].activities = [...updated[dayIndex].activities, val];
                              setFormItinerary(updated);
                              setFormNewActivity({ ...formNewActivity, [dayIndex]: "" });
                            }
                          }}
                        />
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                          const val = formNewActivity[dayIndex]?.trim();
                          if (!val) return;
                          const updated = [...formItinerary];
                          updated[dayIndex].activities = [...updated[dayIndex].activities, val];
                          setFormItinerary(updated);
                          setFormNewActivity({ ...formNewActivity, [dayIndex]: "" });
                        }}>Add</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-1 border-dashed text-xs" onClick={() => {
                    const nextDay = formItinerary.length + 1;
                    setFormItinerary([...formItinerary, { day: nextDay, title: `Day ${nextDay}`, description: "", activities: [] }]);
                  }}>
                    <Plus className="h-3.5 w-3.5" /> Add Day
                  </Button>
                </div>
              </div>

              <Button variant="brand" onClick={() => savePackage.mutate()} disabled={!form.title || savePackage.isPending}>
                {savePackage.isPending ? "Saving..." : editId ? "Update Package" : "Create Package"}
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
              <TableHead>Itinerary</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : packages.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No packages yet. Create your first package!</TableCell></TableRow>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => setItineraryOpen(p.id)}
                    >
                      <Edit className="h-3 w-3" />
                      {Array.isArray(p.itinerary) && (p.itinerary as unknown as ItineraryDay[]).length > 0
                        ? `${(p.itinerary as unknown as ItineraryDay[]).length} days`
                        : "Add"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Itinerary Builder Dialog */}
      {itineraryOpen && (
        <ItineraryBuilderDialog
          packageId={itineraryOpen}
          pkg={packages.find((p) => p.id === itineraryOpen)!}
          onClose={() => setItineraryOpen(null)}
        />
      )}
    </div>
  );
}

function ItineraryBuilderDialog({
  packageId,
  pkg,
  onClose,
}: {
  packageId: string;
  pkg: any;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const initialItinerary: ItineraryDay[] = Array.isArray(pkg.itinerary)
    ? (pkg.itinerary as unknown as ItineraryDay[])
    : [];
  const [days, setDays] = useState<ItineraryDay[]>(
    initialItinerary.length > 0 ? initialItinerary : []
  );
  const [newActivity, setNewActivity] = useState<Record<number, string>>({});

  const addDay = () => {
    const nextDay = days.length + 1;
    setDays([...days, { day: nextDay, title: `Day ${nextDay}`, description: "", activities: [] }]);
  };

  const removeDay = (index: number) => {
    const updated = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setDays(updated);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...days];
    (updated[index] as any)[field] = value;
    setDays(updated);
  };

  const addActivity = (dayIndex: number) => {
    const activity = newActivity[dayIndex]?.trim();
    if (!activity) return;
    const updated = [...days];
    updated[dayIndex].activities = [...updated[dayIndex].activities, activity];
    setDays(updated);
    setNewActivity({ ...newActivity, [dayIndex]: "" });
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    const updated = [...days];
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== actIndex);
    setDays(updated);
  };

  const saveItinerary = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("packages")
        .update({ itinerary: days as unknown as Json[] })
        .eq("id", packageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Itinerary saved!");
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Itinerary — {pkg.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-border rounded-xl p-4 bg-secondary/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {day.day}
                </span>
                <Input
                  value={day.title}
                  onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                  className="font-semibold"
                  placeholder="Day title"
                />
                <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => removeDay(dayIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <textarea
                value={day.description}
                onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
                placeholder="Day description..."
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground mb-3"
              />

              {/* Activities */}
              <div className="space-y-1.5 mb-3">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-center gap-2 text-sm bg-background rounded-lg px-3 py-2">
                    <span className="text-muted-foreground flex-1">{activity}</span>
                    <button onClick={() => removeActivity(dayIndex, actIndex)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newActivity[dayIndex] || ""}
                  onChange={(e) => setNewActivity({ ...newActivity, [dayIndex]: e.target.value })}
                  placeholder="Add activity (e.g., City tour, Lunch at resort)"
                  onKeyDown={(e) => e.key === "Enter" && addActivity(dayIndex)}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={() => addActivity(dayIndex)}>Add</Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addDay} className="w-full gap-1 border-dashed">
            <Plus className="h-4 w-4" /> Add Day
          </Button>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="brand" onClick={() => saveItinerary.mutate()} disabled={saveItinerary.isPending} className="flex-1">
              {saveItinerary.isPending ? "Saving..." : "Save Itinerary"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
