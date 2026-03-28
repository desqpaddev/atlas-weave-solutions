import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Globe, Upload, Save, Image } from "lucide-react";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface CompanySettings {
  footer_text?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
}

export default function SettingsPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [company, setCompany] = useState({
    id: "", name: "", email: "", phone: "", address: "", website: "", logo_url: "",
  });
  const [settings, setSettings] = useState<CompanySettings>({});

  useEffect(() => {
    if (profile?.company_id) loadCompany();
  }, [profile?.company_id]);

  const loadCompany = async () => {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("id", profile!.company_id!)
      .single();
    if (data) {
      setCompany({
        id: data.id, name: data.name, email: data.email || "",
        phone: data.phone || "", address: data.address || "",
        website: data.website || "", logo_url: data.logo_url || "",
      });
      setSettings((data.settings as CompanySettings) || {});
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${company.id}/logo.${ext}`;
      const { error: upErr } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
      const logoUrl = urlData.publicUrl + "?t=" + Date.now();
      setCompany({ ...company, logo_url: logoUrl });
      await supabase.from("companies").update({ logo_url: logoUrl }).eq("id", company.id);
      toast.success("Logo uploaded successfully");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const saveCompanyProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("companies").update({
        name: company.name, email: company.email, phone: company.phone,
        address: company.address, website: company.website, logo_url: company.logo_url,
      }).eq("id", company.id);
      if (error) throw error;
      toast.success("Company profile saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("companies").update({
        settings: settings as unknown as Json,
      }).eq("id", company.id);
      if (error) throw error;
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Settings</h1>
      <p className="text-muted-foreground text-sm mb-6">Manage your company profile, branding, and email configuration.</p>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company"><Building2 className="h-4 w-4 mr-1" /> Company</TabsTrigger>
          <TabsTrigger value="branding"><Image className="h-4 w-4 mr-1" /> Branding</TabsTrigger>
          <TabsTrigger value="email"><Mail className="h-4 w-4 mr-1" /> Email / SMTP</TabsTrigger>
          <TabsTrigger value="footer"><Globe className="h-4 w-4 mr-1" /> Footer</TabsTrigger>
        </TabsList>

        {/* Company Profile */}
        <TabsContent value="company">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Company Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Company Name</label>
                  <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Website</label>
                  <Input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Address</label>
                <Textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} rows={2} />
              </div>
              <Button onClick={saveCompanyProfile} disabled={saving} variant="brand">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding / Logo */}
        <TabsContent value="branding">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Logo & Branding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-secondary">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">Company Logo</p>
                  <p className="text-xs text-muted-foreground mb-3">Recommended: 200x200px, PNG or SVG</p>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" disabled={uploading} asChild>
                      <span><Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Logo"}</span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP Config */}
        <TabsContent value="email">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">SMTP Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Configure your email server for sending booking confirmations and notifications.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">SMTP Host</label>
                  <Input value={settings.smtp_host || ""} onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })} placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">SMTP Port</label>
                  <Input value={settings.smtp_port || ""} onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })} placeholder="587" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">SMTP Username</label>
                  <Input value={settings.smtp_user || ""} onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })} placeholder="your-email@gmail.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">SMTP Password</label>
                  <Input type="password" value={settings.smtp_password || ""} onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })} placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">From Email</label>
                  <Input value={settings.smtp_from_email || ""} onChange={(e) => setSettings({ ...settings, smtp_from_email: e.target.value })} placeholder="noreply@yourcompany.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">From Name</label>
                  <Input value={settings.smtp_from_name || ""} onChange={(e) => setSettings({ ...settings, smtp_from_name: e.target.value })} placeholder="Joanna Holidays" />
                </div>
              </div>
              <Button onClick={saveSettings} disabled={saving} variant="brand">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save SMTP Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Config */}
        <TabsContent value="footer">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Footer Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Footer Text</label>
                <Textarea
                  value={settings.footer_text || ""}
                  onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                  placeholder="© 2026 Your Company. All rights reserved."
                  rows={3}
                />
              </div>
              <Button onClick={saveSettings} disabled={saving} variant="brand">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Footer Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
