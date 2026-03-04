import { useState } from "react";
import { Bell, Shield, Globe, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    messageAlerts: true,
    weeklyDigest: true,
    
    sessionTimeout: "30",
    language: "en",
    timezone: "america-new-york"
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences</p>
        </div>
        <Button variant="accent" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Control how you receive alerts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Message Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified for new messages</p>
              </div>
              <Switch 
                checked={settings.messageAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, messageAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of your weekly activity</p>
              </div>
              <Switch 
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Protect your account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="font-medium">Session Timeout</Label>
              <Select 
                value={settings.sessionTimeout}
                onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Globe className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="font-medium">Language</Label>
              <Select 
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Timezone</Label>
              <Select 
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new-york">Eastern Time (US)</SelectItem>
                  <SelectItem value="america-los-angeles">Pacific Time (US)</SelectItem>
                  <SelectItem value="europe-london">London (UK)</SelectItem>
                  <SelectItem value="asia-tokyo">Tokyo (Japan)</SelectItem>
                  <SelectItem value="africa-nairobi">East Africa Time (EAT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
