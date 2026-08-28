"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Search, X } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { navSections } from "@/lib/nav";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  organizationName,
  user,
  onNavigate,
}: {
  organizationName: string;
  user: { fullName: string; email: string };
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-line bg-surface">
      <div className="flex items-center justify-between px-5 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
            {organizationName.charAt(0).toUpperCase()}
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            {organizationName.split(" ")[0]}
          </span>
        </Link>
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-lg p-1.5 text-ink-faint hover:bg-surface-sunken lg:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4">
        <label className="flex h-9 items-center gap-2 rounded-xl border border-line bg-surface-muted px-3 text-sm text-ink-faint focus-within:border-brand-300">
          <Search className="h-4 w-4" />
          <input
            type="search"
            placeholder="Rechercher…"
            className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
          />
          <kbd className="hidden rounded border border-line-strong px-1 text-[10px] text-ink-faint sm:block">
            ⌘F
          </kbd>
        </label>
      </div>

      <nav className="mt-5 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navSections.map((section, index) => (
          <div key={section.title ?? `section-${index}`}>
            {section.title && (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-surface-sunken text-ink"
                          : "text-ink-soft hover:bg-surface-muted hover:text-ink",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px]",
                          active ? "text-brand-500" : "text-ink-faint",
                        )}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-surface-muted"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
              {initials(user.fullName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {user.fullName}
              </span>
              <span className="block truncate text-xs text-ink-faint">
                {user.email}
              </span>
            </span>
            <LogOut className="h-4 w-4 shrink-0 text-ink-faint" />
          </button>
        </form>
      </div>
    </div>
  );
}
