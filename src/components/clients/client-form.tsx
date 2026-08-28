"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createClient, updateClient } from "@/app/(app)/clients/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import type { Client } from "@/types";

const empty = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Sénégal",
  taxId: "",
  notes: "",
};

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const [form, setForm] = useState(client ? { ...empty, ...client } : empty);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (patch: Partial<typeof empty>) => {
    setForm((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const payload = {
    name: form.name,
    companyName: form.companyName,
    email: form.email,
    phone: form.phone,
    address: form.address,
    city: form.city,
    country: form.country,
    taxId: form.taxId,
    notes: form.notes,
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = client
            ? await updateClient(client.id, payload)
            : await createClient(payload);

          if (result.ok) router.push("/clients");
          else setError(result.error);
        });
      }}
    >
      <PageHeader
        title={client ? "Modifier le client" : "Nouveau client"}
        description="Ces informations apparaissent sur les factures adressées au client."
        actions={
          <Button type="submit" size="sm" variant="primary" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-status-overdue/30 bg-status-overdueSoft px-4 py-3 text-sm text-status-overdue"
        >
          {error}
        </div>
      )}

      <Card>
        <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
          <Field label="Contact">
            <Input
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
              required
            />
          </Field>
          <Field label="Entreprise">
            <Input
              value={form.companyName}
              onChange={(event) => update({ companyName: event.target.value })}
            />
          </Field>
          <Field label="E-mail">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
            />
          </Field>
          <Field label="Téléphone">
            <Input
              value={form.phone}
              onChange={(event) => update({ phone: event.target.value })}
            />
          </Field>
          <Field label="Adresse" className="sm:col-span-2">
            <Input
              value={form.address}
              onChange={(event) => update({ address: event.target.value })}
            />
          </Field>
          <Field label="Ville">
            <Input
              value={form.city}
              onChange={(event) => update({ city: event.target.value })}
            />
          </Field>
          <Field label="Pays">
            <Input
              value={form.country}
              onChange={(event) => update({ country: event.target.value })}
            />
          </Field>
          <Field label="Identifiant fiscal (NINEA / RCCM)">
            <Input
              value={form.taxId}
              onChange={(event) => update({ taxId: event.target.value })}
            />
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(event) => update({ notes: event.target.value })}
            />
          </Field>
        </CardContent>
      </Card>
    </form>
  );
}
