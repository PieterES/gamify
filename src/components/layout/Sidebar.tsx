"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCert } from "@/components/CertProvider";
import { CERT_IDS, CERTIFICATIONS } from "@/lib/certifications";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Layers,
  Swords,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Study Notes", icon: BookOpen },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/boss-fight", label: "Boss Fight", icon: Swords },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { cert, certId, setCertId } = useCert();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-cyber-border">
        <div className="text-cyber-primary font-mono font-bold text-xl text-glow-cyan">{cert.code}</div>
        <div className="text-cyber-muted text-xs tracking-widest uppercase mt-1">{cert.subtitle}</div>

        {/* Certificate switcher */}
        <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-lg bg-cyber-bg border border-cyber-border">
          {CERT_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setCertId(id)}
              className={cn(
                "py-1.5 rounded-md text-xs font-mono transition-colors",
                id === certId
                  ? "bg-cyber-primary/15 text-cyber-primary"
                  : "text-cyber-muted hover:text-cyber-text"
              )}
            >
              {CERTIFICATIONS[id].code}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-cyber-primary/10 text-cyber-primary border-l-2 border-cyber-primary pl-2.5"
                : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface-2"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-cyber-border">
        <div className="text-cyber-muted text-xs mb-2 truncate">{session?.user?.email}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-cyber-muted hover:text-cyber-danger text-sm transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 min-h-screen bg-cyber-surface border-r border-cyber-border flex-col">
        {navContent}
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-cyber-surface border-b border-cyber-border">
        <div className="text-cyber-primary font-mono font-bold text-lg text-glow-cyan">{cert.code}</div>
        <button onClick={() => setOpen(!open)} className="text-cyber-muted hover:text-cyber-text">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="w-64 bg-cyber-surface border-r border-cyber-border flex flex-col mt-14">
            {navContent}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
