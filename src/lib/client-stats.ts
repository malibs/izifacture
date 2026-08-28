import { getInvoicesByClient } from "@/lib/data/invoices";
import { effectiveStatus, invoiceTotal, outstandingAmount } from "@/lib/invoice-math";

export interface ClientStats {
  invoiceCount: number;
  invoiced: number;
  outstanding: number;
  overdue: number;
  lastIssueDate?: string;
}

export function getClientStats(clientId: string): ClientStats {
  const clientInvoices = getInvoicesByClient(clientId);

  return clientInvoices.reduce<ClientStats>(
    (stats, invoice) => {
      const status = effectiveStatus(invoice);

      stats.invoiceCount += 1;
      if (status !== "draft") {
        stats.invoiced += invoiceTotal(invoice);
        stats.outstanding += outstandingAmount(invoice);
        if (status === "overdue") {
          stats.overdue += outstandingAmount(invoice);
        }
      }
      if (!stats.lastIssueDate || invoice.issueDate > stats.lastIssueDate) {
        stats.lastIssueDate = invoice.issueDate;
      }

      return stats;
    },
    { invoiceCount: 0, invoiced: 0, outstanding: 0, overdue: 0 },
  );
}
