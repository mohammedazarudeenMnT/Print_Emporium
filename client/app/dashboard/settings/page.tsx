"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Building2,
  Settings as SettingsIcon,
  Loader2,
  Mail,
  Send,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { getSettings, updateGeneralSettings } from "@/lib/settings-api";
import {
  getEmailConfiguration,
  updateEmailConfiguration,
  testEmailConfiguration,
} from "@/lib/email-config-api";

// Simple Image Upload Component (Placeholder)
const ImageUpload = ({ label, value, onChange }: any) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just a placeholder or base64 conversion simulation
      // In a real app, upload to Cloudinary/S3 and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {value && (
          <img
            src={value}
            alt="Logo"
            className="w-16 h-16 object-contain border rounded-md"
          />
        )}
        <Input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
};

type TabType = "general" | "email";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingEmailChange, setPendingEmailChange] = useState<string | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyDescription: "",
    companyLogo: "" as string | null,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
    senderEmail: "",
  });

  const [testEmail, setTestEmail] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [response, emailResponse] = await Promise.all([
        getSettings(),
        getEmailConfiguration(),
      ]);

      if (response.success && response.data) {
        setGeneralSettings({
            companyName: response.data.companyName || "",
            companyEmail: response.data.companyEmail || "",
            companyPhone: response.data.companyPhone || "",
            companyAddress: response.data.companyAddress || "",
            companyDescription: response.data.companyDescription || "",
            companyLogo: response.data.companyLogo || "",
        });
        setPendingEmailChange(response.data.pendingEmailChange || null);
      }

      if (emailResponse.success && emailResponse.emailConfig) {
        setEmailSettings({
            smtpHost: emailResponse.emailConfig.smtpHost || "",
            smtpPort: emailResponse.emailConfig.smtpPort || "",
            smtpUsername: emailResponse.emailConfig.smtpUsername || "",
            smtpPassword: emailResponse.emailConfig.smtpPassword || "",
            senderEmail: emailResponse.emailConfig.senderEmail || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let response;
      if (activeTab === "general") {
        response = await updateGeneralSettings(generalSettings);
      } else {
        response = await updateEmailConfiguration(emailSettings);
      }

      if (response?.success) {
        if (response.data && activeTab === "general") {
             setPendingEmailChange(response.data.pendingEmailChange || null);
        }
        toast.success(response.message || "Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <div className="flex gap-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === "general" ? "border-b-2 border-primary font-bold" : ""}`}
          onClick={() => setActiveTab("general")}
        >
            <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4"/> General
            </div>
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "email" ? "border-b-2 border-primary font-bold" : ""}`}
          onClick={() => setActiveTab("email")}
        >
             <div className="flex items-center gap-2">
                <Mail className="w-4 h-4"/> Email
            </div>
        </button>
      </div>

      {activeTab === "general" && (
        <div className="space-y-6 max-w-2xl text-[var(--foreground)]">
            {pendingEmailChange && (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
                    Pending email verification for: {pendingEmailChange}
                </div>
            )}
          
          <ImageUpload
            label="Company Logo"
            value={generalSettings.companyLogo}
            onChange={(val: string) => setGeneralSettings({ ...generalSettings, companyLogo: val })}
          />

          <div className="grid gap-2">
            <Label>Company Name</Label>
            <Input
              value={generalSettings.companyName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Company Email</Label>
            <Input
              value={generalSettings.companyEmail}
              onChange={(e) => setGeneralSettings({ ...generalSettings, companyEmail: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
             <Label>Company Phone</Label>
             <Input
                value={generalSettings.companyPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, companyPhone: e.target.value })}
             />
          </div>

          <div className="grid gap-2">
             <Label>Company Address</Label>
             <Input
                value={generalSettings.companyAddress}
                onChange={(e) => setGeneralSettings({ ...generalSettings, companyAddress: e.target.value })}
             />
          </div>

          <div className="grid gap-2">
             <Label>Description</Label>
            <Textarea
              value={generalSettings.companyDescription}
              onChange={(e) => setGeneralSettings({ ...generalSettings, companyDescription: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeTab === "email" && (
        <div className="space-y-6 max-w-2xl text-[var(--foreground)]">
           <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>SMTP Host</Label>
                <Input value={emailSettings.smtpHost} onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>SMTP Port</Label>
                <Input value={emailSettings.smtpPort} onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>SMTP Username</Label>
                <Input value={emailSettings.smtpUsername} onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>SMTP Password</Label>
                <Input type="password" value={emailSettings.smtpPassword} onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})} />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <Label>Sender Email</Label>
                <Input value={emailSettings.senderEmail} onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})} />
              </div>
           </div>

           <div className="p-4 border rounded-md space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Send className="w-4 h-4"/> Test Email</h3>
              <div className="flex gap-2">
                 <Input 
                    placeholder="Test email address" 
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                 />
                 <Button 
                    onClick={async () => {
                        setTestingEmail(true);
                        try {
                            await testEmailConfiguration({ testEmail, message: "Test from admin" });
                            toast.success("Test email sent");
                        } catch(e) {
                            toast.error("Failed to send test email");
                        } finally {
                            setTestingEmail(false);
                        }
                    }}
                    disabled={testingEmail || !testEmail}
                 >
                    {testingEmail ? <Loader2 className="animate-spin" /> : "Send"}
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
