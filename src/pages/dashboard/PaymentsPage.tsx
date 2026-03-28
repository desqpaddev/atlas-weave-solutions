import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Payments</h1>
      <p className="text-muted-foreground text-sm mb-6">Track payment transactions.</p>
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-lg">Payment Tracking</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">Payment tracking will appear here once bookings with payments are created.</p></CardContent>
      </Card>
    </div>
  );
}
