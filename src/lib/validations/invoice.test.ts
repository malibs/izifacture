import { describe, expect, it } from "vitest";

import { invoiceInputSchema, paymentSchema } from "@/lib/validations/invoice";

const base = {
  clientId: "6f0b7b3a-4d7a-4d6f-9a2f-6f6f6f6f6f6f",
  projectName: "Refonte site",
  issueDate: "2026-02-01",
  dueDate: "2026-03-03",
  vatRate: 18,
  items: [
    {
      description: "Design",
      quantity: 2,
      unitPrice: 500_000,
      vatApplicable: true,
    },
  ],
};

describe("invoiceInputSchema", () => {
  it("accepte une facture valide", () => {
    expect(invoiceInputSchema.safeParse(base).success).toBe(true);
  });

  it("refuse une échéance antérieure à l'émission", () => {
    const result = invoiceInputSchema.safeParse({
      ...base,
      dueDate: "2026-01-31",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un montant décimal", () => {
    const result = invoiceInputSchema.safeParse({
      ...base,
      items: [{ ...base.items[0], unitPrice: 1000.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("refuse une facture sans ligne", () => {
    expect(invoiceInputSchema.safeParse({ ...base, items: [] }).success).toBe(
      false,
    );
  });
});

describe("paymentSchema", () => {
  it("refuse un paiement de zéro ou négatif", () => {
    const payment = {
      invoiceId: base.clientId,
      paidAt: "2026-02-10",
      method: "mobile_money" as const,
    };
    expect(paymentSchema.safeParse({ ...payment, amount: 0 }).success).toBe(
      false,
    );
    expect(paymentSchema.safeParse({ ...payment, amount: -1 }).success).toBe(
      false,
    );
    expect(
      paymentSchema.safeParse({ ...payment, amount: 250_000 }).success,
    ).toBe(true);
  });
});
