"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Mail, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { MessageDisplay } from "@/components/ui/message-display";
import { GeneralSettingsTab } from "@/components/settings/general-settings-tab";
import { EmailSettingsTab } from "@/components/settings/email-settings-tab";

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleMessage = (newMessage: { type: "success" | "error"; text: string }) => {
    setMessage(newMessage);
    // Auto-clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          icon={Settings}
          title="Dashboard Settings"
          description="Manage your application settings and configuration"
        />

        {/* Message Display */}
        <MessageDisplay message={message} />

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-fit">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                General Settings
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Configuration
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6">
              <GeneralSettingsTab onMessage={handleMessage} />
            </TabsContent>

            {/* Email Configuration Tab */}
            <TabsContent value="email" className="space-y-6">
              <EmailSettingsTab onMessage={handleMessage} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}