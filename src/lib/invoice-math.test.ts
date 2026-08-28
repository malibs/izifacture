import { describe, expect, it } from "vitest";

import {
  computeTotals,
  effectiveStatus,
  invoiceTotal,
  lineTotal,
  outstandingAmount,
} from "@/lib/invoice-math";
import type { Invoice, InvoiceItem } from "@/types";

function item(partial: Partial<InvoiceItem>): InvoiceItem {
  return {
    id: partial.id ?? "item",
    description: partial.description ?? "Prestation",
    quantity: partial.quantity ?? 1,
    unitPrice: partial.unitPrice ?? 0,
    vatApplicable: partial.vatApplicable ?? true,
  };
}

function invoice(partial: Partial<Invoice>): Invoice {
  return {
    id: "inv",
    number: "INV-1",
    clientId: "client",
    projectName: "Projet",
    status: "sent",
    issueDate: "2026-01-01",
    dueDate: "2026-01-31",
    vatRate: 18,
    items: [item({ quantity: 1, unitPrice: 100_000 })],
    amountPaid: 0,
    owner: "Moi",
    ...partial,
  };
}

describe("lineTotal", () => {
  it("multiplie quantité et prix unitaire sans décimale résiduelle", () => {
    expect(lineTotal(item({ quantity: 2.5, unitPrice: 100_001 }))).toBe(250_003);
  });
});

describe("computeTotals", () => {
  it("applique la TVA sur le total des lignes taxables uniquement", () => {
    const totals = computeTotals(
      [
        item({ quantity: 2, unitPrice: 500_000 }),
        item({ quantity: 1, unitPrice: 200_000, vatApplicable: false }),
      ],
      18,
    );

    expect(totals).toEqual({
      subtotal: 1_200_000,
      vat: 180_000,
      total: 1_380_000,
    });
  });

  it("arrondit une seule fois, sur le total de TVA", () => {
    const totals = computeTotals(
      [
        item({ quantity: 1, unitPrice: 33_333 }),
        item({ quantity: 1, unitPrice: 33_333 }),
        item({ quantity: 1, unitPrice: 33_333 }),
      ],
      18,
    );

    // 99 999 × 18 % = 17 999,82 → 18 000 (et non 3 × 6 000 = 18 000 par hasard)
    expect(totals.vat).toBe(18_000);
    expect(Number.isInteger(totals.total)).toBe(true);
  });

  it("gère un taux de TVA nul", () => {
    const totals = computeTotals([item({ unitPrice: 250_000 })], 0);
    expect(totals).toEqual({ subtotal: 250_000, vat: 0, total: 250_000 });
  });
});

describe("effectiveStatus", () => {
  const today = new Date("2026-02-15T10:00:00Z");

  it("dérive le retard de l'échéance pour une facture envoyée", () => {
    expect(effectiveStatus(invoice({ dueDate: "2026-02-14" }), today)).toBe(
      "overdue",
    );
    expect(effectiveStatus(invoice({ dueDate: "2026-02-15" }), today)).toBe(
      "sent",
    );
  });

  it("ne requalifie jamais un brouillon ni une facture payée", () => {
    expect(
      effectiveStatus(invoice({ status: "draft", dueDate: "2020-01-01" }), today),
    ).toBe("draft");
    expect(
      effectiveStatus(invoice({ status: "paid", dueDate: "2020-01-01" }), today),
    ).toBe("paid");
  });
});

describe("outstandingAmount", () => {
  it("ne descend jamais sous zéro en cas de surpaiement", () => {
    const paid = invoice({ amountPaid: 200_000 });
    expect(invoiceTotal(paid)).toBe(118_000);
    expect(outstandingAmount(paid)).toBe(0);
  });

  it("retourne le solde restant dû", () => {
    expect(outstandingAmount(invoice({ amountPaid: 18_000 }))).toBe(100_000);
  });
});
