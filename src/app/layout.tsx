import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Baraka — Facturation pour entrepreneurs africains",
    template: "%s · Baraka",
  },
  description:
    "Créez, envoyez et suivez vos factures en FCFA. Pensé pour les entrepreneurs africains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${sans.variable} font-sans`}>{children}</body>
    </html>
  );
}
