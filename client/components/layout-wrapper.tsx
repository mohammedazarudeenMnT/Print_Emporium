"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AccessDeniedDisplay } from "@/components/ui/access-denied-display";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <>
      {!isAuthPage && !isDashboardPage && <Navbar />}
      <AccessDeniedDisplay />
      <main className={!isAuthPage && !isDashboardPage ? "pt-16" : ""}>
        {children}
      </main>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </>
  );
}
