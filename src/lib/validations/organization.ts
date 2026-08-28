import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default("");

export const organizationInputSchema = z.object({
  name: z.string().trim().min(1, "Nom de l'entreprise requis").max(160),
  legalName: optionalText(160),
  address: optionalText(200),
  city: optionalText(80),
  country: optionalText(80),
  email: z
    .union([z.literal(""), z.string().trim().email("E-mail invalide")])
    .optional()
    .default(""),
  phone: optionalText(40),
  ninea: optionalText(60),
  rccm: optionalText(60),
  currency: z.enum(["XOF", "XAF"]),
  defaultVatRate: z.number().min(0).max(100),
  invoicePrefix: z
    .string()
    .trim()
    .min(1, "Préfixe requis")
    .max(12)
    .regex(/^[A-Z0-9-]+$/, "Lettres majuscules, chiffres et tirets uniquement"),
  paymentTermsDays: z.number().int().min(0).max(365),
  invoiceFooterNote: optionalText(500),
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
