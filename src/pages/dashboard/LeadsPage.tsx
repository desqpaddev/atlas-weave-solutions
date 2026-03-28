import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type LeadStatus = Database["public"]["Enums"]["lead_status"];

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  quoted: "bg-purple-500/20 text-purple-400",
  negotiating: "bg-orange-500/20 text-orange-400",
  won: "bg-green-500/20 text-green-400",
  lost: "bg-red-500/20 text-red-400",
};

export default function LeadsPage() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", destination: "", budget: "", notes: "", source: "website",
  });

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createLead = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) {
        throw new Error("You need to be associated with a company first.");
      }
      const { error } = await supabase.from("leads").insert({
        company_id: profile.company_id,
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone || null,
        destination: form.destination || null,
        budget: form.budget ? parseFloat(form.budget) : null,
        notes: form.notes || null,
        source: form.source,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created!");
      setOpen(false);
      setForm({ full_name: "", email: "", phone: "", destination: "", budget: "", notes: "", source: "website" });
    },
    onError: (e) => toast.error(e.message),
  });

  const filteredLeads = leads.filter(
    (l) =>
      l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (l.destination?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground text-sm">Track and manage your sales pipeline.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">New Lead</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); createLead.mutate(); }}
              className="space-y-4"
            >
              <div>
                <Label>Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Destination</Label>
                  <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Budget</Label>
                  <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" />
              </div>
              <Button variant="brand" className="w-full" disabled={createLead.isPending}>
                {createLead.isPending ? "Creating..." : "Create Lead"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Budget</TableHead>
              <TableHead className="hidden lg:table-cell">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No leads found. Click "Add Lead" to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{lead.full_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{lead.email || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{lead.destination || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[lead.status as LeadStatus]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{lead.source || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
