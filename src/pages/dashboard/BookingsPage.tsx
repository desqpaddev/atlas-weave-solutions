import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database["public"]["Enums"]["booking_status"];
type BookingType = Database["public"]["Enums"]["booking_type"];
const statusColors: Record<BookingStatus, string> = { pending: "bg-yellow-500/20 text-yellow-400", confirmed: "bg-blue-500/20 text-blue-400", in_progress: "bg-purple-500/20 text-purple-400", completed: "bg-green-500/20 text-green-400", cancelled: "bg-red-500/20 text-red-400", refunded: "bg-gray-500/20 text-gray-400" };
const emptyForm = { title: "", booking_type: "tour" as BookingType, status: "pending" as BookingStatus, total_amount: 0, paid_amount: 0, destination: "", pax: 1, check_in: "", check_out: "", description: "", reference_number: "" };

export default function BookingsPage() {
  const { profile, roles, user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const isAdmin = roles.includes("company_admin") || roles.includes("super_admin");
  const isAgent = roles.includes("travel_agent");
  const isCustomer = !isAdmin && !isAgent;

  // For customers, first find their customer record
  const { data: customerRecord } = useQuery({
    queryKey: ["my-customer-record", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: isCustomer && !!user?.id,
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", isCustomer ? customerRecord?.id : "all"],
    queryFn: async () => {
      let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (isCustomer && customerRecord?.id) {
        query = query.eq("customer_id", customerRecord.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isCustomer ? !!customerRecord?.id || customerRecord === null : true,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const ref = form.reference_number || `BK-${Date.now().toString(36).toUpperCase()}`;
      const payload = { company_id: profile.company_id, title: form.title, booking_type: form.booking_type, status: form.status, total_amount: form.total_amount, paid_amount: form.paid_amount, destination: form.destination || null, pax: form.pax, check_in: form.check_in || null, check_out: form.check_out || null, description: form.description || null, reference_number: ref };
      if (editId) { const { error } = await supabase.from("bookings").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("bookings").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); toast.success(editId ? "Booking updated!" : "Booking created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("bookings").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); toast.success("Booking deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (b: any) => { setEditId(b.id); setForm({ title: b.title, booking_type: b.booking_type, status: b.status, total_amount: Number(b.total_amount), paid_amount: Number(b.paid_amount), destination: b.destination || "", pax: b.pax || 1, check_in: b.check_in || "", check_out: b.check_out || "", description: b.description || "", reference_number: b.reference_number }); setOpen(true); };
  const viewBooking = bookings.find(b => b.id === viewId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{isCustomer ? "My Bookings" : "Bookings"}</h1>
          <p className="text-muted-foreground text-sm">{isCustomer ? "View your travel bookings." : "Manage all travel bookings across channels."}</p>
        </div>
        {!isCustomer && (
          <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
            <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Booking</Button></DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card border-border">
              <DialogHeader><DialogTitle>{editId ? "Edit Booking" : "New Booking"}</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4 py-2">
                <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Type</Label><Select value={form.booking_type} onValueChange={(v) => setForm({ ...form, booking_type: v as BookingType })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{(["flight","hotel","tour","package"] as BookingType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as BookingStatus })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{(["pending","confirmed","in_progress","completed","cancelled","refunded"] as BookingStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Total Amount ($)</Label><Input type="number" min={0} value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: Number(e.target.value) })} className="mt-1" /></div>
                  <div><Label>Paid Amount ($)</Label><Input type="number" min={0} value={form.paid_amount} onChange={(e) => setForm({ ...form, paid_amount: Number(e.target.value) })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Destination</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="mt-1" /></div>
                  <div><Label>Travelers</Label><Input type="number" min={1} value={form.pax} onChange={(e) => setForm({ ...form, pax: Number(e.target.value) })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Check-in</Label><Input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} className="mt-1" /></div>
                  <div><Label>Check-out</Label><Input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} className="mt-1" /></div>
                </div>
                <div><Label>Description</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                <Button variant="brand" disabled={!form.title || save.isPending}>{save.isPending ? "Saving..." : editId ? "Update" : "Create"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isCustomer && bookings.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">✈️</div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">No bookings yet</h2>
          <p className="text-muted-foreground mb-4">Browse our tours and packages to book your next adventure!</p>
          <Button variant="brand" onClick={() => window.location.href = "/tours"}>Explore Tours</Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Reference</TableHead><TableHead>Title</TableHead><TableHead className="hidden md:table-cell">Type</TableHead><TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Destination</TableHead><TableHead className="hidden lg:table-cell">Pax</TableHead><TableHead className="hidden sm:table-cell">Amount</TableHead><TableHead className="hidden lg:table-cell">Paid</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
              bookings.map((b) => {
                const meta = (b.metadata && typeof b.metadata === 'object' && !Array.isArray(b.metadata)) ? b.metadata as Record<string, any> : {};
                return (
                <TableRow key={b.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{b.reference_number}</TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{b.title}</p>
                    {meta.customer_name && <p className="text-xs text-muted-foreground">{meta.customer_name}</p>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground capitalize">{b.booking_type}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[b.status as BookingStatus]}>{b.status}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{b.destination || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{b.pax}</TableCell>
                  <TableCell className="hidden sm:table-cell text-foreground font-medium">${Number(b.total_amount).toLocaleString()}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">${Number(b.paid_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(b.id)}><Eye className="h-3.5 w-3.5" /></Button>
                      {!isCustomer && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this booking?")) remove.mutate(b.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Booking Details</DialogTitle></DialogHeader>
          {viewBooking && (() => {
            const meta = (viewBooking.metadata && typeof viewBooking.metadata === 'object' && !Array.isArray(viewBooking.metadata)) ? viewBooking.metadata as Record<string, any> : {};
            return (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Reference</p><p className="font-mono text-primary">{viewBooking.reference_number}</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge variant="secondary" className={statusColors[viewBooking.status as BookingStatus]}>{viewBooking.status}</Badge></div>
                <div><p className="text-muted-foreground">Title</p><p className="font-medium text-foreground">{viewBooking.title}</p></div>
                <div><p className="text-muted-foreground">Type</p><p className="text-foreground capitalize">{viewBooking.booking_type}</p></div>
                <div><p className="text-muted-foreground">Total Amount</p><p className="text-foreground font-semibold">${Number(viewBooking.total_amount).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Paid Amount</p><p className="text-foreground">${Number(viewBooking.paid_amount).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground">Payment Status</p><p className="text-foreground capitalize">{viewBooking.payment_status || "pending"}</p></div>
                <div><p className="text-muted-foreground">Destination</p><p className="text-foreground">{viewBooking.destination || "—"}</p></div>
                <div><p className="text-muted-foreground">Travelers</p><p className="text-foreground">{viewBooking.pax}</p></div>
                <div><p className="text-muted-foreground">Check-in</p><p className="text-foreground">{viewBooking.check_in || "—"}</p></div>
                <div><p className="text-muted-foreground">Check-out</p><p className="text-foreground">{viewBooking.check_out || "—"}</p></div>
                <div><p className="text-muted-foreground">Created</p><p className="text-foreground">{new Date(viewBooking.created_at).toLocaleDateString()}</p></div>
              </div>
              {(meta.customer_name || meta.customer_email || meta.customer_phone) && (
                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground font-medium mb-2">Customer Info</p>
                  <div className="grid grid-cols-2 gap-3">
                    {meta.customer_name && <div><p className="text-muted-foreground text-xs">Name</p><p className="text-foreground">{meta.customer_name}</p></div>}
                    {meta.customer_email && <div><p className="text-muted-foreground text-xs">Email</p><p className="text-foreground">{meta.customer_email}</p></div>}
                    {meta.customer_phone && <div><p className="text-muted-foreground text-xs">Phone</p><p className="text-foreground">{meta.customer_phone}</p></div>}
                    {meta.adults != null && <div><p className="text-muted-foreground text-xs">Adults</p><p className="text-foreground">{meta.adults}</p></div>}
                    {meta.children != null && <div><p className="text-muted-foreground text-xs">Children</p><p className="text-foreground">{meta.children}</p></div>}
                  </div>
                </div>
              )}
              {viewBooking.description && <div className="border-t border-border pt-3"><p className="text-muted-foreground">Description</p><p className="text-foreground whitespace-pre-wrap">{viewBooking.description}</p></div>}
            </div>
          );})()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
