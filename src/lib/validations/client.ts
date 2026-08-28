import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default("");

export const clientInputSchema = z.object({
  name: z.string().trim().min(1, "Nom du contact requis").max(120),
  companyName: optionalText(160),
  email: z
    .union([z.literal(""), z.string().trim().email("E-mail invalide")])
    .optional()
    .default(""),
  phone: optionalText(40),
  address: optionalText(200),
  city: optionalText(80),
  country: optionalText(80),
  taxId: optionalText(60),
  notes: optionalText(2000),
});

export type ClientInput = z.infer<typeof clientInputSchema>;
