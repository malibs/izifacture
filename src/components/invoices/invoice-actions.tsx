"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Download, Send, Wallet } from "lucide-react";

import { markInvoiceSent, recordPayment } from "@/app/(app)/invoices/actions";
import { Button, buttonStyles } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import type { InvoiceStatus } from "@/types";

const METHODS = [
  { value: "mobile_money", label: "Mobile money" },
  { value: "bank_transfer", label: "Virement bancaire" },
  { value: "cash", label: "Espèces" },
  { value: "cheque", label: "Chèque" },
  { value: "card", label: "Carte" },
  { value: "other", label: "Autre" },
] as const;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function InvoiceActions({
  invoiceId,
  status,
  outstanding,
}: {
  invoiceId: string;
  status: InvoiceStatus;
  outstanding: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [amount, setAmount] = useState(String(outstanding));
  const [paidAt, setPaidAt] = useState(today());
  const [method, setMethod] = useState<string>("mobile_money");
  const [reference, setReference] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/invoices/${invoiceId}/print`}
          target="_blank"
          rel="noopener"
          className={buttonStyles({ size: "sm" })}
        >
          <Download className="h-4 w-4" />
          Télécharger le PDF
        </Link>

        {status === "draft" && (
          <Button
            size="sm"
            variant="primary"
            type="button"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await markInvoiceSent(invoiceId);
                if (!result.ok) setError(result.error);
              });
            }}
          >
            <Send className="h-4 w-4" />
            Marquer comme envoyée
          </Button>
        )}

        {status !== "draft" && status !== "paid" && (
          <Button
            size="sm"
            variant="primary"
            type="button"
            onClick={() => setPaymentOpen((open) => !open)}
          >
            <Wallet className="h-4 w-4" />
            Enregistrer un paiement
          </Button>
        )}
      </div>

      {paymentOpen && (
        <form
          className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await recordPayment({
                invoiceId,
                amount: Number.parseInt(amount, 10),
                paidAt,
                method,
                reference,
              });

              if (result.ok) setPaymentOpen(false);
              else setError(result.error);
            });
          }}
        >
          <Field label="Montant encaissé (FCFA)">
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <Field label="Date de paiement">
            <Input
              type="date"
              value={paidAt}
              onChange={(event) => setPaidAt(event.target.value)}
            />
          </Field>
          <Field label="Moyen de paiement">
            <Select
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              {METHODS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Référence">
            <Input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={pending}
            >
              {pending ? "Enregistrement…" : "Valider le paiement"}
            </Button>
          </div>
        </form>
      )}

      {error && (
        <p role="alert" className="text-sm text-status-overdue">
          {error}
        </p>
      )}
    </div>
  );
}
