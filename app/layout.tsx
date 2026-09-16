import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IziFacture - Facturation Simple pour Entrepreneurs",
  description: "Gérez vos factures et vos clients en toute simplicité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={cn(inter.className, "bg-gray-50 text-gray-900")}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
