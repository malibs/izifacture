"use client";

import { Bell, CircleHelp, Gift, Menu } from "lucide-react";

export function Topbar({
  title,
  onOpenMenu,
}: {
  title: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="rounded-lg p-2 text-ink-soft hover:bg-surface-sunken lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="truncate text-[15px] font-semibold tracking-tight">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-ink-soft hover:bg-surface-sunken"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-ink-soft hover:bg-surface-sunken"
          aria-label="Nouveautés"
        >
          <Gift className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="ml-1 hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-ink-soft hover:bg-surface-sunken sm:inline-flex"
        >
          <CircleHelp className="h-[18px] w-[18px]" />
          Aide
        </button>
      </div>
    </header>
  );
}
