import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function Page({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <AuthCard
      title="Connexion"
      description="Accédez à vos factures et à vos clients."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-brand-600">
            Créer un compte
          </Link>
        </>
      }
    >
      <LoginForm next={searchParams.next ?? null} />
    </AuthCard>
  );
}
