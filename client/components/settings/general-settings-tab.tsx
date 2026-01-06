"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/lib/axios";

interface GeneralSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyDescription: string;
  companyLogo: string;
}

interface GeneralSettingsTabProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

export function GeneralSettingsTab({ onMessage }: GeneralSettingsTabProps) {
  const [settings, setSettings] = useState<GeneralSettings>({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyDescription: "",
    companyLogo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/settings");
      if (response.data.success) {
        const generalSettings = response.data.data;
        setSettings({
          companyName: generalSettings.companyName || "",
          companyEmail: generalSettings.companyEmail || "",
          companyPhone: generalSettings.companyPhone || "",
          companyAddress: generalSettings.companyAddress || "",
          companyDescription: generalSettings.companyDescription || "",
          companyLogo: generalSettings.companyLogo || "",
        });
      }
    } catch (error) {
      console.error("Failed to load general settings:", error);
      onMessage({ type: "error", text: "Failed to load general settings" });
    }
  }, [onMessage]);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSettingsChange = (
    field: keyof GeneralSettings,
    value: string
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.put(
        "/api/settings/general",
        settings
      );
      if (response.data.success) {
        onMessage({ type: "success", text: response.data.message });
        await loadSettings(); // Reload to get updated data
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to save general settings";

      onMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleSettingsChange("companyLogo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>
          Update your company details and branding information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Logo */}
        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <div className="flex items-center gap-4">
            {settings.companyLogo && (
              <div className="w-16 h-16 rounded-lg border-2 border-border overflow-hidden">
                <img
                  src={settings.companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("logo")?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 200x200px, PNG or JPG
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company Name
            </Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) =>
                handleSettingsChange("companyName", e.target.value)
              }
              placeholder="Enter company name"
            />
          </div>

          {/* Company Email */}
          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Company Email
            </Label>
            <Input
              id="companyEmail"
              type="email"
              value={settings.companyEmail}
              onChange={(e) =>
                handleSettingsChange("companyEmail", e.target.value)
              }
              placeholder="Enter company email"
            />
          </div>

          {/* Company Phone */}
          <div className="space-y-2">
            <Label htmlFor="companyPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Company Phone
            </Label>
            <Input
              id="companyPhone"
              value={settings.companyPhone}
              onChange={(e) =>
                handleSettingsChange("companyPhone", e.target.value)
              }
              placeholder="Enter company phone"
            />
          </div>

          {/* Company Address */}
          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Company Address
            </Label>
            <Input
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) =>
                handleSettingsChange("companyAddress", e.target.value)
              }
              placeholder="Enter company address"
            />
          </div>
        </div>

        {/* Company Description */}
        <div className="space-y-2">
          <Label
            htmlFor="companyDescription"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Company Description
          </Label>
          <Textarea
            id="companyDescription"
            value={settings.companyDescription}
            onChange={(e) =>
              handleSettingsChange("companyDescription", e.target.value)
            }
            placeholder="Enter company description"
            rows={4}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save General Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
