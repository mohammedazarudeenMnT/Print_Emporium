"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "pt-16" : ""}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
