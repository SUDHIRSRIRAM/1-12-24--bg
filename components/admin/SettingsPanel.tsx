"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Settings {
  freeCredits: number;
  maxFileSize: number;
  enableRegistration: boolean;
  maintenanceMode: boolean;
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    freeCredits: 10,
    maxFileSize: 5,
    enableRegistration: true,
    maintenanceMode: false,
  });

  const updateSettings = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: 1, // Single settings record
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">General Settings</h2>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="freeCredits">Free Credits for New Users</Label>
            <Input
              id="freeCredits"
              type="number"
              value={settings.freeCredits}
              onChange={(e) => setSettings({
                ...settings,
                freeCredits: parseInt(e.target.value)
              })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
            <Input
              id="maxFileSize"
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => setSettings({
                ...settings,
                maxFileSize: parseInt(e.target.value)
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableRegistration">Enable User Registration</Label>
            <Switch
              id="enableRegistration"
              checked={settings.enableRegistration}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                enableRegistration: checked
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                maintenanceMode: checked
              })}
            />
          </div>

          <Button 
            className="w-full mt-6"
            onClick={updateSettings}
          >
            Save Settings
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value="************************"
              readOnly
            />
          </div>
          <Button variant="outline">Generate New API Key</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Backup & Restore</h2>
        <div className="space-y-4">
          <Button className="w-full">Export Database Backup</Button>
          <Button variant="outline" className="w-full">Import Backup</Button>
        </div>
      </Card>
    </div>
  );
}