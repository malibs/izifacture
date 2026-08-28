import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function Page() {
  return (
    <AuthCard
      title="Créer un compte"
      description="Votre espace de facturation en FCFA, prêt en une minute."
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-brand-600">
            Se connecter
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
