/**
 * Génère supabase/seed.sql à partir des fixtures TypeScript, pour que la base de
 * démonstration reste alignée avec les données utilisées en développement.
 *
 *   node scripts/generate-seed.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url).pathname;

async function loadModule(relativePath) {
  // On ne garde que les déclarations de données : les helpers typés qui suivent
  // ne sont pas exécutables tels quels par Node.
  const source = readFileSync(join(ROOT, relativePath), "utf8")
    .split(/^export function/m)[0]
    .replace(/^import type .*$/gm, "")
    .replace(/^import .*from "@\/.*$/gm, "")
    .replace(/: [A-Za-z<>[\]]+ =/g, " =");

  const dir = mkdtempSync(join(tmpdir(), "seed-"));
  const file = join(dir, "fixture.mjs");
  writeFileSync(file, source);

  return import(pathToFileURL(file).href);
}

const quote = (value) =>
  value === null || value === undefined
    ? "null"
    : `'${String(value).replace(/'/g, "''")}'`;

const lineTotal = (item) => Math.round(item.quantity * item.unitPrice);

function totals(invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + lineTotal(item), 0);
  const vatBase = invoice.items
    .filter((item) => item.vatApplicable)
    .reduce((sum, item) => sum + lineTotal(item), 0);
  const vat = Math.round((vatBase * invoice.vatRate) / 100);

  return { subtotal, vat, total: subtotal + vat };
}

const { clients } = await loadModule("src/lib/data/clients.ts");
const { invoices } = await loadModule("src/lib/data/invoices.ts");
const { company } = await loadModule("src/lib/data/company.ts");

const ORG_ID = "00000000-0000-4000-8000-000000000001";
const uuid = (prefix, index) =>
  `${prefix}-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;

const clientIds = new Map(
  clients.map((client, index) => [client.id, uuid("11111111", index)]),
);

const lines = [
  "-- Généré par scripts/generate-seed.mjs — ne pas éditer à la main.",
  "-- Données de démonstration : une organisation, ses clients et ses factures.",
  "",
  "begin;",
  "",
  `delete from organizations where id = '${ORG_ID}';`,
  "",
  "insert into organizations (id, name, legal_name, address, city, country, email, phone, ninea, rccm, currency, default_vat_rate, invoice_prefix, next_invoice_number)",
  `values ('${ORG_ID}', ${quote(company.name)}, ${quote(company.legalName)}, ${quote(company.address)}, ${quote(company.city)}, ${quote(company.country)}, ${quote(company.email)}, ${quote(company.phone)}, ${quote(company.ninea)}, ${quote(company.rccm)}, ${quote(company.currency)}, ${company.defaultVatRate}, ${quote(company.invoicePrefix)}, ${
    invoices.reduce(
      (max, invoice) => Math.max(max, Number(invoice.number.split("-")[1])),
      0,
    ) + 1
  });`,
  "",
  "insert into clients (id, organization_id, name, company_name, email, phone, address, city, country) values",
];

lines.push(
  clients
    .map(
      (client) =>
        `  ('${clientIds.get(client.id)}', '${ORG_ID}', ${quote(client.name)}, ${quote(client.companyName)}, ${quote(client.email)}, ${quote(client.phone)}, ${quote(client.address)}, ${quote(client.city)}, ${quote(client.country)})`,
    )
    .join(",\n") + ";",
  "",
  // Les factures sont d'abord insérées en brouillon : le verrou applicatif
  // interdit d'ajouter des lignes à une facture déjà envoyée ou payée.
  "insert into invoices (id, organization_id, client_id, number, status, issue_date, due_date, vat_rate, subtotal, vat_amount, total, amount_paid, project_name) values",
);

const invoiceIds = new Map(
  invoices.map((invoice, index) => [invoice.id, uuid("22222222", index)]),
);

lines.push(
  invoices
    .map((invoice) => {
      const { subtotal, vat, total } = totals(invoice);
      return `  ('${invoiceIds.get(invoice.id)}', '${ORG_ID}', '${clientIds.get(invoice.clientId)}', ${quote(invoice.number)}, 'draft', ${quote(invoice.issueDate)}, ${quote(invoice.dueDate)}, ${invoice.vatRate}, ${subtotal}, ${vat}, ${total}, ${invoice.amountPaid}, ${quote(invoice.projectName)})`;
    })
    .join(",\n") + ";",
  "",
  "insert into invoice_items (invoice_id, position, description, quantity, unit_price, vat_applicable, line_total) values",
);

lines.push(
  invoices
    .flatMap((invoice) =>
      invoice.items.map(
        (item, position) =>
          `  ('${invoiceIds.get(invoice.id)}', ${position}, ${quote(item.description)}, ${item.quantity}, ${item.unitPrice}, ${item.vatApplicable}, ${lineTotal(item)})`,
      ),
    )
    .join(",\n") + ";",
  "",
);

// Le statut « en retard » est dérivé de l'échéance, il n'est donc pas stocké.
const storedStatus = (invoice) =>
  invoice.status === "overdue" ? "sent" : invoice.status;

lines.push(
  ...invoices
    .filter((invoice) => storedStatus(invoice) !== "draft")
    .map(
      (invoice) =>
        `update invoices set status = ${quote(storedStatus(invoice))}, sent_at = ${quote(`${invoice.issueDate}T08:00:00Z`)}${
          storedStatus(invoice) === "paid"
            ? `, paid_at = ${quote(`${invoice.dueDate}T08:00:00Z`)}`
            : ""
        } where id = '${invoiceIds.get(invoice.id)}';`,
    ),
  "",
  "commit;",
  "",
);

writeFileSync(join(ROOT, "supabase/seed.sql"), lines.join("\n"));
console.log("supabase/seed.sql généré.");
