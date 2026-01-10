"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Sidebar, SidebarLink, SidebarUser } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Home, Settings, Users, Package, Briefcase } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  // Base links available to all authenticated users
  const baseSidebarLinks: SidebarLink[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: <Package className="w-5 h-5" />,
      isActive: pathname === "/dashboard/orders",
    },
  ];

  // Admin-only links
  const adminLinks: SidebarLink[] = [
    {
      label: "Services",
      href: "/dashboard/services",
      icon: <Briefcase className="w-5 h-5" />,
      isActive: pathname === "/dashboard/services",
    },
    {
      label: "Employees",
      href: "/dashboard/employees",
      icon: <Users className="w-5 h-5" />,
      isActive: pathname === "/dashboard/employees",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      isActive: pathname === "/dashboard/settings",
    },
  ];

  // Combine links based on user role
  const sidebarLinks = user.role === "admin" 
    ? [...baseSidebarLinks, ...adminLinks]
    : baseSidebarLinks;

  const sidebarUser: SidebarUser = {
    name: user.name || "User",
    email: user.email || "user@example.com",
    role: user.role,
    avatar: user.image,
  };

  const handleLinkClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        links={sidebarLinks}
        user={sidebarUser}
        onLinkClick={handleLinkClick}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
