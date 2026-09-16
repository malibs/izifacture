import { z } from 'zod';

export const InvoiceSchema = z.object({
  client_id: z.string().min(1, 'Veuillez sélectionner un client'),
  invoice_number: z.string().min(1, 'Le numéro de facture est requis'),
  date_issue: z.string().min(1, 'La date d\'émission est requise'),
  date_due: z.string().min(1, 'La date d\'échéance est requise'),
  items: z.array(
    z.object({
      description: z.string().min(1, 'La description est requise'),
      quantity: z.coerce.number().min(1, 'La quantité doit être d\'au moins 1'),
      price: z.coerce.number().min(0, 'Le prix ne peut pas être négatif'),
    })
  ).min(1, 'Ajoutez au moins un article'),
  notes: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof InvoiceSchema>;
