"use client";

import { useState, useEffect } from "react";
import { getPublicSettings } from "@/lib/settings-api";

interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyDescription: string;
  companyLogo: string | null;
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getPublicSettings();
        if (response.success) {
          setSettings(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch company settings:", err);
        setError(err.message || "Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
