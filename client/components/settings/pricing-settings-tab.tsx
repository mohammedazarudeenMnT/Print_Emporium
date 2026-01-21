"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Truck,
  Package,
  Plus,
  Trash2,
  Save,
  Loader2,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { axiosInstance } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

interface Threshold {
  minAmount: number;
  charge: number;
}

interface PricingSettings {
  deliveryThresholds: Threshold[];
  packingThresholds: Threshold[];
  isDeliveryEnabled: boolean;
  isPackingEnabled: boolean;
}

interface PricingSettingsTabProps {
  onMessage: (message: { type: "success" | "error"; text: string }) => void;
}

export function PricingSettingsTab({ onMessage }: PricingSettingsTabProps) {
  const [settings, setSettings] = useState<PricingSettings>({
    deliveryThresholds: [],
    packingThresholds: [],
    isDeliveryEnabled: true,
    isPackingEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/settings/pricing");
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load pricing settings:", error);
      onMessage({ type: "error", text: "Failed to load pricing settings" });
    } finally {
      setIsLoading(false);
    }
  }, [onMessage]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleAddThreshold = (type: "delivery" | "packing") => {
    const key = type === "delivery" ? "deliveryThresholds" : "packingThresholds";
    setSettings((prev) => ({
      ...prev,
      [key]: [...prev[key], { minAmount: 0, charge: 0 }],
    }));
  };

  const handleRemoveThreshold = (type: "delivery" | "packing", index: number) => {
    const key = type === "delivery" ? "deliveryThresholds" : "packingThresholds";
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleThresholdChange = (
    type: "delivery" | "packing",
    index: number,
    field: keyof Threshold,
    value: number
  ) => {
    const key = type === "delivery" ? "deliveryThresholds" : "packingThresholds";
    setSettings((prev) => {
      const newThresholds = [...prev[key]];
      newThresholds[index] = { ...newThresholds[index], [field]: value };
      return { ...prev, [key]: newThresholds };
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Sort thresholds by minAmount before saving for consistency
      const sortedSettings = {
        ...settings,
        deliveryThresholds: [...settings.deliveryThresholds].sort((a, b) => a.minAmount - b.minAmount),
        packingThresholds: [...settings.packingThresholds].sort((a, b) => a.minAmount - b.minAmount),
      };

      const response = await axiosInstance.put("/api/settings/pricing", sortedSettings);
      if (response.data.success) {
        onMessage({ type: "success", text: "Pricing settings updated successfully" });
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error("Failed to save pricing settings:", error);
      onMessage({ type: "error", text: "Failed to save pricing settings" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading pricing settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delivery Charges Configuration */}
      <Card className="overflow-hidden border-primary/10 shadow-lg">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Delivery Charges</CardTitle>
                <CardDescription>
                  Configure dynamic delivery fees based on order subtotal
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background/50 px-3 py-1.5 rounded-full border border-primary/10">
              <span className="text-sm font-medium">Enabled</span>
              <Switch
                checked={settings.isDeliveryEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, isDeliveryEnabled: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Price Thresholds</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddThreshold("delivery")}
                className="gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
              >
                <Plus className="h-4 w-4" />
                Add Threshold
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence mode="popLayout">
                {settings.deliveryThresholds.map((threshold, index) => (
                  <motion.div
                    key={`delivery-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-end gap-4 p-4 rounded-xl bg-muted/30 border border-border group relative transition-all hover:bg-muted/50"
                  >
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs text-muted-foreground ml-1">Minimum Order Amount (₹)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</div>
                        <Input
                          type="number"
                          value={threshold.minAmount}
                          onChange={(e) =>
                            handleThresholdChange("delivery", index, "minAmount", Number(e.target.value))
                          }
                          className="pl-7 bg-background"
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs text-muted-foreground ml-1">Delivery Charge (₹)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</div>
                        <Input
                          type="number"
                          value={threshold.charge}
                          onChange={(e) =>
                            handleThresholdChange("delivery", index, "charge", Number(e.target.value))
                          }
                          className={`pl-7 bg-background ${threshold.charge === 0 ? 'border-green-500/50 text-green-600 font-medium' : ''}`}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveThreshold("delivery", index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {settings.deliveryThresholds.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-muted rounded-xl bg-muted/10">
                <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm font-medium">No delivery thresholds defined.</p>
                <p className="text-xs text-muted-foreground/70">Orders will have ₹0 delivery charge by default.</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
            <div className="p-1.5 h-fit bg-primary/10 rounded-full">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-primary">Pro Tip: Free Delivery</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Set a threshold with <span className="font-bold">₹0 charge</span> to offer free delivery (e.g., Min Amount ₹500, Charge ₹0). This encourages users to buy more to reach the threshold!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packing Charges Configuration */}
      <Card className="overflow-hidden border-indigo-500/10 shadow-lg">
        <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Package className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <CardTitle>Packing Charges</CardTitle>
                <CardDescription>
                  Configure dynamic packing fees based on order value
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background/50 px-3 py-1.5 rounded-full border border-indigo-500/10">
              <span className="text-sm font-medium">Enabled</span>
              <Switch
                checked={settings.isPackingEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, isPackingEnabled: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Packing Tiers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddThreshold("packing")}
                className="gap-2 border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/5"
              >
                <Plus className="h-4 w-4" />
                Add Tier
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence mode="popLayout">
                {settings.packingThresholds.map((threshold, index) => (
                  <motion.div
                    key={`packing-${index}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-end gap-4 p-4 rounded-xl bg-muted/30 border border-border group relative transition-all hover:bg-muted/50"
                  >
                    <div className="flex-1 space-y-2">
                       <Label className="text-xs text-muted-foreground ml-1">Order Value From (₹)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</div>
                        <Input
                          type="number"
                          value={threshold.minAmount}
                          onChange={(e) =>
                            handleThresholdChange("packing", index, "minAmount", Number(e.target.value))
                          }
                          className="pl-7 bg-background"
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs text-muted-foreground ml-1">Packing Fee (₹)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</div>
                        <Input
                          type="number"
                          value={threshold.charge}
                          onChange={(e) =>
                            handleThresholdChange("packing", index, "charge", Number(e.target.value))
                          }
                          className="pl-7 bg-background"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveThreshold("packing", index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

             {settings.packingThresholds.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-muted rounded-xl bg-muted/10">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm font-medium">No packing tiers defined.</p>
                <p className="text-xs text-muted-foreground/70">Packing will be free for all orders.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border sticky bottom-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          Thresholds are automatically sorted from lowest to highest amount.
        </div>
        <Button
          onClick={saveSettings}
          disabled={isSaving}
          className="gap-2 px-8 font-semibold shadow-lg shadow-primary/20"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Pricing Configuration"}
        </Button>
      </div>
    </div>
  );
}
