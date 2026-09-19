import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "IziFacture — Facturez avec l'élégance des grands",
  description:
    "Fini les factures sur Word et Excel. Créez des factures professionnelles, automatisez la TVA 18%, suivez vos paiements et relancez vos clients par WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          plusJakarta.variable,
          plusJakarta.className,
          "bg-background text-on-surface min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed"
        )}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}