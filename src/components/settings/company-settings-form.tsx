"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { company } from "@/lib/data/company";

export function CompanySettingsForm() {
  const [form, setForm] = useState({
    name: company.name,
    legalName: company.legalName,
    email: company.email,
    phone: company.phone,
    address: company.address,
    city: company.city,
    country: company.country,
    ninea: company.ninea,
    rccm: company.rccm,
    currency: company.currency,
    defaultVatRate: String(company.defaultVatRate),
    invoicePrefix: company.invoicePrefix,
    paymentTermsDays: "30",
    footerNote:
      "Règlement par virement ou mobile money sous 30 jours. Pénalités de retard : 1,5 % par mois.",
  });
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<typeof form>) => {
    setForm((current) => ({ ...current, ...patch }));
    setSaved(false);
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <PageHeader
        title="Paramètres"
        description="Informations reprises sur toutes vos factures."
        actions={
          <Button type="submit" size="sm" variant="primary">
            Enregistrer
          </Button>
        }
      />

      {saved && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Modifications validées côté client. La persistance arrive avec
          Supabase à la phase suivante.
        </div>
      )}

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Identité de l&apos;entreprise</CardTitle>
          <CardDescription>
            Nom commercial, logo et coordonnées de contact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={form.name} className="h-14 w-14 text-base" />
            <div>
              <Button type="button" size="sm">
                <Upload className="h-4 w-4" />
                Changer le logo
              </Button>
              <p className="mt-1.5 text-xs text-ink-faint">
                PNG ou SVG, 512×512 px recommandé.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom commercial">
              <Input
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
              />
            </Field>
            <Field label="Raison sociale">
              <Input
                value={form.legalName}
                onChange={(event) => update({ legalName: event.target.value })}
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Identifiants légaux</CardTitle>
          <CardDescription>
            Mentions obligatoires sur les factures.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="NINEA">
            <Input
              value={form.ninea}
              onChange={(event) => update({ ninea: event.target.value })}
            />
          </Field>
          <Field label="RCCM">
            <Input
              value={form.rccm}
              onChange={(event) => update({ rccm: event.target.value })}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Facturation</CardTitle>
          <CardDescription>
            Devise, TVA et numérotation appliquées par défaut.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Devise" hint="Le FCFA ne comporte pas de décimale.">
            <Select
              value={form.currency}
              onChange={(event) => update({ currency: event.target.value })}
            >
              <option value="XOF">XOF — Franc CFA (UEMOA)</option>
              <option value="XAF">XAF — Franc CFA (CEMAC)</option>
            </Select>
          </Field>
          <Field label="Taux de TVA par défaut (%)">
            <Input
              inputMode="numeric"
              value={form.defaultVatRate}
              onChange={(event) =>
                update({ defaultVatRate: event.target.value })
              }
            />
          </Field>
          <Field label="Préfixe des numéros">
            <Input
              value={form.invoicePrefix}
              onChange={(event) =>
                update({ invoicePrefix: event.target.value })
              }
            />
          </Field>
          <Field label="Délai de paiement (jours)">
            <Input
              inputMode="numeric"
              value={form.paymentTermsDays}
              onChange={(event) =>
                update({ paymentTermsDays: event.target.value })
              }
            />
          </Field>
          <Field label="Mentions de bas de facture" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={form.footerNote}
              onChange={(event) => update({ footerNote: event.target.value })}
            />
          </Field>
        </CardContent>
      </Card>
    </form>
  );
}
