"use client";

import { useState, useTransition } from "react";

import { signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirmationSent) {
    return (
      <p className="text-sm text-ink-soft">
        Compte créé. Ouvre l&apos;e-mail de confirmation que nous venons de
        t&apos;envoyer, puis connecte-toi.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await signUp(formData);
          if (!result) return;
          if (!result.ok) setError(result.error);
          else if ("pendingConfirmation" in result) setConfirmationSent(true);
        });
      }}
    >
      <Field label="Votre nom">
        <Input name="fullName" autoComplete="name" required />
      </Field>
      <Field label="Nom de l'entreprise">
        <Input name="companyName" autoComplete="organization" required />
      </Field>
      <Field label="E-mail">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Mot de passe" hint="8 caractères minimum.">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-status-overdue">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center"
        disabled={pending}
      >
        {pending ? "Création…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
