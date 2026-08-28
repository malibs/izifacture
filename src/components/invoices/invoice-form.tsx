"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { clients } from "@/lib/data/clients";
import { company } from "@/lib/data/company";
import { formatFCFA } from "@/lib/format";
import { computeTotals, lineTotal } from "@/lib/invoice-math";
import type { InvoiceItem } from "@/types";

/** Ligne en cours de saisie : les champs numériques peuvent être vides. */
interface DraftItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  vatApplicable: boolean;
}

function emptyItem(): DraftItem {
  return {
    id: Math.random().toString(36).slice(2),
    description: "",
    quantity: "1",
    unitPrice: "",
    vatApplicable: true,
  };
}

/** Les montants sont des entiers de FCFA : toute saisie est tronquée. */
function toInteger(value: string) {
  const parsed = Number.parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toQuantity(value: string) {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function toDomainItem(item: DraftItem): InvoiceItem {
  return {
    id: item.id,
    description: item.description,
    quantity: toQuantity(item.quantity),
    unitPrice: toInteger(item.unitPrice),
    vatApplicable: item.vatApplicable,
  };
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function InvoiceForm({ nextNumber }: { nextNumber: string }) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [projectName, setProjectName] = useState("");
  const [issueDate, setIssueDate] = useState(todayIso);
  const [dueDate, setDueDate] = useState(() => addDaysIso(30));
  const [vatRate, setVatRate] = useState(String(company.defaultVatRate));
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([emptyItem()]);
  const [saved, setSaved] = useState(false);

  const totals = useMemo(
    () => computeTotals(items.map(toDomainItem), toInteger(vatRate)),
    [items, vatRate],
  );

  const updateItem = (id: string, patch: Partial<DraftItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    setSaved(false);
  };

  const removeItem = (id: string) => {
    setItems((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current,
    );
  };

  const client = clients.find((item) => item.id === clientId);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <PageHeader
        title="Nouvelle facture"
        description={`Brouillon ${nextNumber} — les totaux se recalculent à la saisie.`}
        actions={
          <>
            <Link href="/invoices" className={buttonStyles({ size: "sm" })}>
              Annuler
            </Link>
            <Button type="submit" size="sm" variant="primary">
              Enregistrer le brouillon
            </Button>
          </>
        }
      />

      {saved && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Facture calculée et validée côté client. La persistance arrive avec
          Supabase à la phase suivante.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Client">
                <Select
                  value={clientId}
                  onChange={(event) => setClientId(event.target.value)}
                >
                  {clients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.companyName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Projet">
                <Input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Refonte du site vitrine"
                />
              </Field>
              <Field label="Date d'émission">
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                />
              </Field>
              <Field label="Date d'échéance">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </Field>
              <Field
                label="Taux de TVA (%)"
                hint="18 % par défaut, ajustable selon le pays."
              >
                <Input
                  inputMode="numeric"
                  value={vatRate}
                  onChange={(event) => setVatRate(event.target.value)}
                />
              </Field>
              <Field label="Numéro">
                <Input value={nextNumber} readOnly disabled />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lignes de facturation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-line bg-surface-muted/60 p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <Field label={`Description ${index + 1}`}>
                        <Input
                          value={item.description}
                          onChange={(event) =>
                            updateItem(item.id, {
                              description: event.target.value,
                            })
                          }
                          placeholder="Prestation, livrable…"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Quantité">
                        <Input
                          inputMode="decimal"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(item.id, { quantity: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-4">
                      <Field label="Prix unitaire (FCFA)">
                        <Input
                          inputMode="numeric"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateItem(item.id, {
                              unitPrice: event.target.value,
                            })
                          }
                          placeholder="0"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-[13px] text-ink-soft">
                      <input
                        type="checkbox"
                        checked={item.vatApplicable}
                        onChange={(event) =>
                          updateItem(item.id, {
                            vatApplicable: event.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-line-strong text-brand-500 focus:ring-brand-200"
                      />
                      Soumis à la TVA
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium tabular">
                        {formatFCFA(lineTotal(toDomainItem(item)))}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        aria-label={`Supprimer la ligne ${index + 1}`}
                        className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-status-overdueSoft hover:text-status-overdue disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                size="sm"
                onClick={() => setItems((current) => [...current, emptyItem()])}
              >
                <Plus className="h-4 w-4" />
                Ajouter une ligne
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes et conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Conditions de règlement, coordonnées bancaires, mentions légales…"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-surface-muted p-3 text-sm">
              <p className="font-medium">{client?.companyName}</p>
              <p className="text-ink-soft">{client?.name}</p>
              <p className="text-ink-faint">
                {client?.city}, {client?.country}
              </p>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Sous-total</dt>
                <dd className="font-medium tabular">
                  {formatFCFA(totals.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  TVA ({toInteger(vatRate)}&nbsp;%)
                </dt>
                <dd className="font-medium tabular">{formatFCFA(totals.vat)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5 text-base">
                <dt className="font-medium">Total</dt>
                <dd className="font-semibold tabular">
                  {formatFCFA(totals.total)}
                </dd>
              </div>
            </dl>

            <p className="text-xs text-ink-faint">
              Montants en FCFA, sans décimale. Le total de TVA est arrondi une
              seule fois, jamais ligne par ligne.
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
