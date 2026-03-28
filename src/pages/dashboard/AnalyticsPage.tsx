import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Analytics</h1>
      <p className="text-muted-foreground text-sm mb-6">Sales reports & performance insights.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Revenue Dashboard</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-sm">Revenue charts will appear once bookings are created.</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Booking Trends</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-sm">Trend analysis will populate with booking data.</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
