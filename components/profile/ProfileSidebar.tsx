"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  LogOut,
  CreditCard,
  Calendar,
  Tag,
  Mail,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

export function ProfileSidebar() {
  const pathname = usePathname();
  const { signOut, profile } = useAuth();

  const links = [
    {
      href: "/profile",
      label: "Overview",
      icon: User,
      exact: true,
    },
    {
      href: "/profile/packages",
      label: "Packages",
      icon: Package,
      exact: false,
    },
    {
      href: "/profile/payments",
      label: "Payments",
      icon: CreditCard,
      exact: false,
    },
    {
      href: "/profile/calendar",
      label: "Calendar",
      icon: Calendar,
      exact: false,
    },
  ];

  if (profile?.role === "admin") {
    links.push(
      {
        href: "/profile/tiers",
        label: "Tiers & Codes",
        icon: Tag,
        exact: false,
      },
      {
        href: "/profile/announcements",
        label: "Announcements",
        icon: Mail,
        exact: false,
      },
      {
        href: "/profile/users",
        label: "Users List",
        icon: User,
        exact: false,
      }
    );
  }

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-24 shadow-sm">
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-(--primary) text-black font-bold shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
