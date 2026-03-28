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
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type PaymentStatus = Database["public"]["Enums"]["payment_status"];
const statusColors: Record<PaymentStatus, string> = { pending: "bg-yellow-500/20 text-yellow-400", partial: "bg-orange-500/20 text-orange-400", paid: "bg-green-500/20 text-green-400", refunded: "bg-gray-500/20 text-gray-400", failed: "bg-red-500/20 text-red-400" };
const emptyForm = { booking_id: "", amount: 0, method: "", status: "pending" as PaymentStatus, transaction_id: "", notes: "", paid_at: "" };

export default function PaymentsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings-list"], queryFn: async () => { const { data } = await supabase.from("bookings").select("id, reference_number, title").order("created_at", { ascending: false }); return data || []; },
  });

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"], queryFn: async () => { const { data, error } = await supabase.from("payments").select("*, bookings(reference_number, title)").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.booking_id) throw new Error("Booking required");
      const payload = { booking_id: form.booking_id, amount: form.amount, method: form.method || null, status: form.status, transaction_id: form.transaction_id || null, notes: form.notes || null, paid_at: form.paid_at || null };
      if (editId) { const { error } = await supabase.from("payments").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("payments").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payments"] }); toast.success(editId ? "Payment updated!" : "Payment recorded!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("payments").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payments"] }); toast.success("Payment deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (p: any) => { setEditId(p.id); setForm({ booking_id: p.booking_id, amount: Number(p.amount), method: p.method || "", status: p.status || "pending", transaction_id: p.transaction_id || "", notes: p.notes || "", paid_at: p.paid_at ? p.paid_at.split("T")[0] : "" }); setOpen(true); };
  const viewPayment = payments.find(p => p.id === viewId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Payments</h1><p className="text-muted-foreground text-sm">Track payment transactions.</p></div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Record Payment</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>{editId ? "Edit Payment" : "Record Payment"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4 py-2">
              <div><Label>Booking *</Label><select value={form.booking_id} onChange={(e) => setForm({ ...form, booking_id: e.target.value })} className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option value="">Select booking</option>{bookings.map(b => <option key={b.id} value={b.id}>{b.reference_number} - {b.title}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount ($) *</Label><Input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label>Method</Label><Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="upi">UPI</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as PaymentStatus })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{(["pending","partial","paid","refunded","failed"] as PaymentStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Paid Date</Label><Input type="date" value={form.paid_at} onChange={(e) => setForm({ ...form, paid_at: e.target.value })} className="mt-1" /></div>
              </div>
              <div><Label>Transaction ID</Label><Input value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })} className="mt-1" /></div>
              <div><Label>Notes</Label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <Button variant="brand" disabled={!form.booking_id || save.isPending}>{save.isPending ? "Saving..." : editId ? "Update" : "Record"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Booking</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
            payments.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments yet.</TableCell></TableRow> :
            payments.map((p: any) => (
              <TableRow key={p.id} className="border-border">
                <TableCell><div><p className="font-mono text-xs text-primary">{p.bookings?.reference_number}</p><p className="text-xs text-muted-foreground">{p.bookings?.title}</p></div></TableCell>
                <TableCell className="font-medium text-foreground">${Number(p.amount).toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{p.method || "—"}</TableCell>
                <TableCell><Badge variant="secondary" className={statusColors[(p.status as PaymentStatus) || "pending"]}>{p.status || "pending"}</Badge></TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{p.paid_at ? format(new Date(p.paid_at), "dd MMM yyyy") : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(p.id)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this payment?")) remove.mutate(p.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="font-display">Payment Details</DialogTitle></DialogHeader>
          {viewPayment && (
            <div className="space-y-3 text-sm grid grid-cols-2 gap-3">
              <div><p className="text-muted-foreground">Booking</p><p className="font-mono text-primary">{(viewPayment as any).bookings?.reference_number}</p></div>
              <div><p className="text-muted-foreground">Amount</p><p className="font-medium text-foreground">${Number(viewPayment.amount).toLocaleString()}</p></div>
              <div><p className="text-muted-foreground">Method</p><p className="text-foreground capitalize">{viewPayment.method || "—"}</p></div>
              <div><p className="text-muted-foreground">Status</p><Badge variant="secondary" className={statusColors[(viewPayment.status as PaymentStatus) || "pending"]}>{viewPayment.status || "pending"}</Badge></div>
              <div><p className="text-muted-foreground">Transaction ID</p><p className="text-foreground">{viewPayment.transaction_id || "—"}</p></div>
              <div><p className="text-muted-foreground">Paid Date</p><p className="text-foreground">{viewPayment.paid_at ? format(new Date(viewPayment.paid_at), "dd MMM yyyy") : "—"}</p></div>
              {viewPayment.notes && <div className="col-span-2"><p className="text-muted-foreground">Notes</p><p className="text-foreground">{viewPayment.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
