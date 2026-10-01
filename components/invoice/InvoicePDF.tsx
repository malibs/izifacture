'use client';

import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { Invoice, Profile } from '@/lib/types';

// Utiliser la police Helvetica (intégrée à react-pdf) — pas besoin de charger des fonts externes

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    color: '#1e293b',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#3525cd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3525cd',
    textAlign: 'right',
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
  },

  // Émetteur & Client
  parties: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 20,
  },
  partyBox: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  partyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  partyLine: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },

  // Table des articles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colDescription: { flex: 6 },
  colQty: { flex: 1.5, textAlign: 'center' },
  colPrice: { flex: 2.5, textAlign: 'right' },
  colTotal: { flex: 2.5, textAlign: 'right' },
  tableCell: {
    fontSize: 10,
    color: '#334155',
  },
  tableCellBold: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold',
  },

  // Totaux
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalsBox: {
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#3525cd',
    borderRadius: 8,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Notes
  notes: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: '#64748b',
  },

  // Pied de page
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
  branding: {
    fontSize: 8,
    color: '#cbd5e1',
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  profile: Profile | null;
  customer?: { name: string; email: string; phone: string; address: string } | null;
}

export function InvoicePDF({ invoice, profile, customer }: InvoicePDFProps) {
  const currency = profile?.currency || 'XOF';
  const formatMoney = (amount: number) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    return currency === 'XOF' ? `${formatted} FCFA` : `${formatted} ${currency}`;
  };

  const companyName = profile?.company_name || 'Mon Entreprise';
  const companyInitial = companyName.charAt(0).toUpperCase() || 'M';
  const vatRate = profile?.vat_rate ?? 18;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.brand}>
            {profile?.company_logo_url ? (
              <View style={styles.brandLogo}>
                {/* react-pdf ne charge pas d'images distantes via URL directement dans tous les cas,
                    on affiche l'initiale comme fallback robuste */}
                <Text style={styles.brandLetter}>{companyInitial}</Text>
              </View>
            ) : (
              <View style={styles.brandLogo}>
                <Text style={styles.brandLetter}>{companyInitial}</Text>
              </View>
            )}
            <View>
              <Text style={styles.brandName}>{companyName}</Text>
              {profile?.company_email && <Text style={styles.partyLine}>{profile.company_email}</Text>}
              {profile?.company_phone && <Text style={styles.partyLine}>{profile.company_phone}</Text>}
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceMeta}>{invoice.invoice_number}</Text>
            <Text style={styles.invoiceMeta}>
              Émise le {new Date(invoice.date_issue).toLocaleDateString('fr-FR')}
            </Text>
            <Text style={styles.invoiceMeta}>
              Échéance : {new Date(invoice.date_due).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Émetteur & Client */}
        <View style={styles.parties}>
          <View style={styles.partyBox}>
            <Text style={styles.partyLabel}>De</Text>
            <Text style={styles.partyName}>{companyName}</Text>
            {profile?.company_address && <Text style={styles.partyLine}>{profile.company_address}</Text>}
            {profile?.company_email && <Text style={styles.partyLine}>{profile.company_email}</Text>}
            {profile?.company_phone && <Text style={styles.partyLine}>{profile.company_phone}</Text>}
            {profile?.ninea_rccm && <Text style={styles.partyLine}>NINEA/RCCM : {profile.ninea_rccm}</Text>}
          </View>
          <View style={styles.partyBox}>
            <Text style={styles.partyLabel}>Facturé à</Text>
            <Text style={styles.partyName}>{invoice.client_name}</Text>
            {customer?.address && <Text style={styles.partyLine}>{customer.address}</Text>}
            {customer?.email && <Text style={styles.partyLine}>{customer.email}</Text>}
            {customer?.phone && <Text style={styles.partyLine}>{customer.phone}</Text>}
          </View>
        </View>

        {/* Table des articles */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colDescription]}>Description</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Qté</Text>
          <Text style={[styles.tableHeaderCell, styles.colPrice]}>Prix unit.</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
        </View>

        {invoice.items.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
            <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>{formatMoney(item.price)}</Text>
            <Text style={[styles.tableCellBold, styles.colTotal]}>
              {formatMoney(item.quantity * item.price)}
            </Text>
          </View>
        ))}

        {/* Totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total HT</Text>
              <Text style={styles.totalValue}>{formatMoney(invoice.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA ({vatRate}%)</Text>
              <Text style={styles.totalValue}>{formatMoney(invoice.vat)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total TTC</Text>
              <Text style={styles.grandTotalValue}>{formatMoney(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Pied de page */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {companyName} — {profile?.company_email || ''}
            {profile?.ninea_rccm ? ` — NINEA/RCCM : ${profile.ninea_rccm}` : ''}
          </Text>
          {PLAN_HAS_BRANDING(profile?.subscription_plan) && (
            <Text style={styles.branding}>Généré avec IziFacture</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

function PLAN_HAS_BRANDING(plan?: string): boolean {
  return !plan || plan === 'free';
}