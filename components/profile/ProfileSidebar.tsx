"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, LogOut, CreditCard, Calendar, Tag } from "lucide-react";
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
    links.push({
      href: "/profile/tiers",
      label: "Tiers & Codes",
      icon: Tag,
      exact: false,
    });
  }

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sticky top-24">
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
                    ? "bg-(--primary) text-black font-bold shadow-[0_0_20px_rgba(255,214,0,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
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
