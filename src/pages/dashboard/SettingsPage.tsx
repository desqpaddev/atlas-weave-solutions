import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Settings</h1>
      <p className="text-muted-foreground text-sm mb-6">Manage your account and company settings.</p>
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="font-display text-lg">Company Settings</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">Company configuration and API settings coming soon.</p></CardContent>
      </Card>
    </div>
  );
}
