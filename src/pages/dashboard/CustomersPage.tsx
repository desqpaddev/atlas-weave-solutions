import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage your customer database.</p>
        </div>
        <Button variant="brand" size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Customer</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Nationality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : customers.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No customers yet.</TableCell></TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{c.full_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{c.email || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{c.phone || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{c.nationality || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
