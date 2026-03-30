import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Eye, Search, Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const emptyForm = { full_name: "", email: "", phone: "", nationality: "", passport_number: "", date_of_birth: "", notes: "" };

export default function CustomersPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [sendDialogCustomer, setSendDialogCustomer] = useState<any>(null);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [selectedDepartures, setSelectedDepartures] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"], queryFn: async () => { const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const { data: tours = [] } = useQuery({
    queryKey: ["all-tours"], queryFn: async () => { const { data, error } = await supabase.from("tours").select("id, title, destination, adult_price, currency, cover_image, slug").eq("is_active", true).order("title"); if (error) throw error; return data; },
  });

  const { data: departures = [] } = useQuery({
    queryKey: ["all-departures"], queryFn: async () => { const { data, error } = await supabase.from("tour_departures").select("id, departure_date, return_date, total_seats, booked_seats, price_override, status, tours(title, destination, adult_price, currency)").eq("status", "open").order("departure_date"); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("No company assigned");
      const payload = { company_id: profile.company_id, full_name: form.full_name, email: form.email || null, phone: form.phone || null, nationality: form.nationality || null, passport_number: form.passport_number || null, date_of_birth: form.date_of_birth || null, notes: form.notes || null };
      if (editId) { const { error } = await supabase.from("customers").update(payload).eq("id", editId); if (error) throw error; }
      else { const { error } = await supabase.from("customers").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); toast.success(editId ? "Customer updated!" : "Customer created!"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("customers").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); toast.success("Customer deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const sendEmail = useMutation({
    mutationFn: async () => {
      if (!sendDialogCustomer || !profile?.company_id) throw new Error("Missing data");
      if (selectedTours.length === 0 && selectedDepartures.length === 0) throw new Error("Please select at least one tour or departure");
      if (!sendDialogCustomer.email) throw new Error("Customer has no email address");

      const { data, error } = await supabase.functions.invoke("send-customer-email", {
        body: {
          customer_id: sendDialogCustomer.id,
          company_id: profile.company_id,
          tour_ids: selectedTours.length > 0 ? selectedTours : undefined,
          departure_ids: selectedDepartures.length > 0 ? selectedDepartures : undefined,
          subject: emailSubject || undefined,
          custom_message: emailMessage || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Email sent successfully!");
      closeSendDialog();
    },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setOpen(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ full_name: c.full_name, email: c.email || "", phone: c.phone || "", nationality: c.nationality || "", passport_number: c.passport_number || "", date_of_birth: c.date_of_birth || "", notes: c.notes || "" }); setOpen(true); };
  const viewCustomer = customers.find(c => c.id === viewId);
  const filtered = customers.filter(c => c.full_name.toLowerCase().includes(search.toLowerCase()) || (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false));

  const openSendDialog = (c: any) => {
    setSendDialogCustomer(c);
    setSelectedTours([]);
    setSelectedDepartures([]);
    setEmailSubject("");
    setEmailMessage("");
  };
  const closeSendDialog = () => { setSendDialogCustomer(null); setSelectedTours([]); setSelectedDepartures([]); };

  const toggleTour = (id: string) => setSelectedTours(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const toggleDeparture = (id: string) => setSelectedDepartures(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  const buildWhatsAppMessage = () => {
    const selectedTourItems = tours.filter(t => selectedTours.includes(t.id));
    const selectedDepartureItems = departures.filter((d: any) => selectedDepartures.includes(d.id));
    
    let msg = emailMessage ? `${emailMessage}\n\n` : `Hi ${sendDialogCustomer?.full_name}! 🌍\n\nWe have some amazing travel offers for you:\n\n`;
    
    selectedTourItems.forEach((t) => {
      msg += `🏖️ *${t.title}*\n📍 ${t.destination || "Various destinations"}\n💰 ${t.currency} ${Number(t.adult_price).toLocaleString()}\n\n`;
    });
    
    selectedDepartureItems.forEach((d: any) => {
      msg += `📅 *${d.tours?.title || "Tour"}*\n🗓️ Departure: ${new Date(d.departure_date).toLocaleDateString()}\n🪑 ${d.total_seats - d.booked_seats} seats available\n\n`;
    });
    
    msg += `For bookings & enquiries, feel free to reach out!\n🌐 joannaholidays.uk`;
    return msg;
  };

  const sendViaWhatsApp = () => {
    if (!sendDialogCustomer?.phone) {
      toast.error("Customer has no phone number");
      return;
    }
    if (selectedTours.length === 0 && selectedDepartures.length === 0) {
      toast.error("Please select at least one tour or departure");
      return;
    }
    const phone = sendDialogCustomer.phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    toast.success("WhatsApp opened with tour details!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Customers</h1><p className="text-muted-foreground text-sm">Manage your customer database.</p></div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild><Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Customer</Button></DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display">{editId ? "Edit Customer" : "New Customer"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
              <div><Label>Full Name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nationality</Label><Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="mt-1" /></div>
                <div><Label>Passport No.</Label><Input value={form.passport_number} onChange={(e) => setForm({ ...form, passport_number: e.target.value })} className="mt-1" /></div>
              </div>
              <div><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="mt-1" /></div>
              <div><Label>Notes</Label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <Button variant="brand" className="w-full" disabled={save.isPending}>{save.isPending ? "Saving..." : editId ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Email</TableHead><TableHead className="hidden sm:table-cell">Phone</TableHead><TableHead className="hidden lg:table-cell">Nationality</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow> :
            filtered.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No customers yet.</TableCell></TableRow> :
            filtered.map((c) => (
              <TableRow key={c.id} className="border-border">
                <TableCell className="font-medium text-foreground">{c.full_name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{c.email || "—"}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{c.phone || "—"}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{c.nationality || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewId(c.id)} title="View"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => openSendDialog(c)} title="Send Tours" disabled={!c.email}><Send className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete this customer?")) remove.mutate(c.id); }} title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
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
          <DialogHeader><DialogTitle className="font-display">Customer Details</DialogTitle></DialogHeader>
          {viewCustomer && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Name</p><p className="font-medium text-foreground">{viewCustomer.full_name}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="text-foreground">{viewCustomer.email || "—"}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="text-foreground">{viewCustomer.phone || "—"}</p></div>
                <div><p className="text-muted-foreground">Nationality</p><p className="text-foreground">{viewCustomer.nationality || "—"}</p></div>
                <div><p className="text-muted-foreground">Passport</p><p className="text-foreground">{viewCustomer.passport_number || "—"}</p></div>
                <div><p className="text-muted-foreground">DOB</p><p className="text-foreground">{viewCustomer.date_of_birth || "—"}</p></div>
              </div>
              {viewCustomer.notes && <div><p className="text-muted-foreground">Notes</p><p className="text-foreground">{viewCustomer.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Tours/Departures Dialog */}
      <Dialog open={!!sendDialogCustomer} onOpenChange={() => closeSendDialog()}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Send Tours to {sendDialogCustomer?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Subject (optional)</Label>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Exclusive Travel Offers..." className="mt-1" />
            </div>
            <div>
              <Label>Custom Message (optional)</Label>
              <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} rows={2} placeholder="We have curated some amazing travel experiences just for you..." className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <Tabs defaultValue="tours">
              <TabsList className="w-full">
                <TabsTrigger value="tours" className="flex-1">Tours ({tours.length})</TabsTrigger>
                <TabsTrigger value="departures" className="flex-1">Fixed Departures ({departures.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="tours" className="mt-3 max-h-60 overflow-y-auto space-y-2">
                {tours.length === 0 ? <p className="text-muted-foreground text-sm py-4 text-center">No active tours</p> :
                  tours.map((t) => (
                    <label key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer transition-colors">
                      <Checkbox checked={selectedTours.includes(t.id)} onCheckedChange={() => toggleTour(t.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground">📍 {t.destination || "Various"} · {t.currency} {Number(t.adult_price).toLocaleString()}</p>
                      </div>
                    </label>
                  ))
                }
              </TabsContent>

              <TabsContent value="departures" className="mt-3 max-h-60 overflow-y-auto space-y-2">
                {departures.length === 0 ? <p className="text-muted-foreground text-sm py-4 text-center">No open departures</p> :
                  departures.map((d: any) => (
                    <label key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer transition-colors">
                      <Checkbox checked={selectedDepartures.includes(d.id)} onCheckedChange={() => toggleDeparture(d.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{d.tours?.title || "Tour"}</p>
                        <p className="text-xs text-muted-foreground">📅 {new Date(d.departure_date).toLocaleDateString()} · {d.total_seats - d.booked_seats} seats left</p>
                      </div>
                    </label>
                  ))
                }
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {selectedTours.length + selectedDepartures.length} items selected
              </p>
              <Button variant="brand" onClick={() => sendEmail.mutate()} disabled={sendEmail.isPending || (selectedTours.length === 0 && selectedDepartures.length === 0)}>
                {sendEmail.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send Email</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
