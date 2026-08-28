import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/cash-flow", label: "Trésorerie", icon: Wallet },
    ],
  },
  {
    title: "Facturation",
    items: [
      { href: "/invoices", label: "Factures", icon: Receipt },
      { href: "/quotes", label: "Devis", icon: FileText },
    ],
  },
  {
    title: "Clients",
    items: [
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/payments", label: "Paiements", icon: Wallet },
    ],
  },
  {
    title: "Outils",
    items: [
      { href: "/reports", label: "Rapports", icon: BarChart3 },
      { href: "/settings", label: "Paramètres", icon: Settings },
    ],
  },
];
