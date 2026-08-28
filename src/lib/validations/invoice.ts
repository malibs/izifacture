import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date attendue au format AAAA-MM-JJ");

/** Montant en FCFA : entier positif, jamais un flottant. */
const amount = z
  .number()
  .int("Les montants sont en FCFA, sans décimale")
  .min(0, "Montant négatif interdit")
  .max(Number.MAX_SAFE_INTEGER);

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Description requise").max(500),
  quantity: z
    .number()
    .positive("La quantité doit être supérieure à 0")
    .max(1_000_000),
  unitPrice: amount,
  vatApplicable: z.boolean(),
});

export const invoiceInputSchema = z
  .object({
    clientId: z.string().uuid("Client requis"),
    projectName: z.string().trim().max(200).optional().default(""),
    issueDate: isoDate,
    dueDate: isoDate,
    vatRate: z.number().min(0).max(100),
    items: z.array(invoiceItemSchema).min(1, "Ajoutez au moins une ligne"),
    notes: z.string().trim().max(2000).optional().default(""),
    terms: z.string().trim().max(2000).optional().default(""),
  })
  .refine((invoice) => invoice.dueDate >= invoice.issueDate, {
    message: "L'échéance ne peut pas précéder la date d'émission",
    path: ["dueDate"],
  });

export type InvoiceInput = z.infer<typeof invoiceInputSchema>;

export const paymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: amount.refine((value) => value > 0, "Montant requis"),
  paidAt: isoDate,
  method: z.enum([
    "cash",
    "mobile_money",
    "bank_transfer",
    "cheque",
    "card",
    "other",
  ]),
  reference: z.string().trim().max(120).optional().default(""),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
