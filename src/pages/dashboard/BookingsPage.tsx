import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-purple-500/20 text-purple-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  refunded: "bg-gray-500/20 text-gray-400",
};

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground text-sm">Manage all travel bookings across channels.</p>
        </div>
        <Button variant="hero" size="sm" className="gap-1"><Plus className="h-4 w-4" /> New Booking</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Reference</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : bookings.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No bookings yet.</TableCell></TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id} className="border-border">
                  <TableCell className="font-mono text-xs text-gold">{b.reference_number}</TableCell>
                  <TableCell className="font-medium text-foreground">{b.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground capitalize">{b.booking_type}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[b.status as BookingStatus]}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-foreground font-medium">
                    ${Number(b.total_amount).toLocaleString()}
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
