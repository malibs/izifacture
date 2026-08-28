"use client";

import { useState, useTransition } from "react";

import { signIn } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function LoginForm({ next }: { next: string | null }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await signIn(formData, next);
          if (result && !result.ok) setError(result.error);
        });
      }}
    >
      <Field label="E-mail">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Mot de passe">
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
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
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
