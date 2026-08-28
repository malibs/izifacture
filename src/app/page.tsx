import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Receipt,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

import { SiteHeader } from "@/components/marketing/site-header";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Baraka — La facturation simple pour les entrepreneurs africains",
  description:
    "Créez vos factures en FCFA, suivez les paiements et relancez vos clients. TVA configurable, NINEA et RCCM sur vos documents, pensé pour le Sénégal, la Côte d'Ivoire, le Bénin et le Cameroun.",
  openGraph: {
    title: "Baraka — La facturation simple pour les entrepreneurs africains",
    description:
      "Créez vos factures en FCFA, suivez les paiements et relancez vos clients.",
    locale: "fr_FR",
    type: "website",
  },
};

const FEATURES = [
  {
    icon: Receipt,
    title: "Factures en FCFA",
    description:
      "Lignes dynamiques, remises et TVA configurable (18 % par défaut). Les totaux sont recalculés côté serveur, jamais d'écart d'arrondi.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord clair",
    description:
      "Montant facturé, encaissé, en attente et en retard. Vous savez en un coup d'œil ce qu'il reste à recouvrer ce mois-ci.",
  },
  {
    icon: Users,
    title: "Fichier clients",
    description:
      "Coordonnées, identifiant fiscal, encours par client et historique complet des factures émises.",
  },
  {
    icon: FileText,
    title: "Mentions légales locales",
    description:
      "NINEA, RCCM, adresse et pied de facture personnalisables : vos documents sont conformes à vos obligations.",
  },
  {
    icon: ShieldCheck,
    title: "Vos données cloisonnées",
    description:
      "Chaque entreprise est isolée au niveau de la base de données, pas seulement dans l'application.",
  },
  {
    icon: Smartphone,
    title: "Utilisable au téléphone",
    description:
      "L'interface s'adapte au mobile : créez une facture depuis un chantier ou une boutique, sans ordinateur.",
  },
];

const STEPS = [
  {
    title: "Paramétrez votre entreprise",
    description:
      "Nom, adresse, NINEA, taux de TVA, préfixe de numérotation et délai de paiement. Cinq minutes, une seule fois.",
  },
  {
    title: "Créez et envoyez vos factures",
    description:
      "Sélectionnez un client, ajoutez vos lignes, la TVA et les totaux se calculent en direct. Le numéro est attribué automatiquement.",
  },
  {
    title: "Suivez les encaissements",
    description:
      "Enregistrez les paiements partiels ou complets. Une facture non réglée après l'échéance passe en retard.",
  },
];

const PLANS = [
  {
    name: "Découverte",
    price: "0 FCFA",
    period: "pour toujours",
    description: "Pour tester et démarrer votre activité.",
    features: [
      "5 factures par mois",
      "Clients illimités",
      "Tableau de bord et suivi des paiements",
    ],
    cta: "Créer mon compte",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9 000 FCFA",
    period: "par mois",
    description: "Pour les indépendants et TPE qui facturent régulièrement.",
    features: [
      "Factures illimitées",
      "Logo et mentions légales personnalisés",
      "Export PDF et envoi par e-mail",
      "Relances des factures en retard",
    ],
    cta: "Commencer",
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "25 000 FCFA",
    period: "par mois",
    description: "Pour les équipes qui facturent à plusieurs.",
    features: [
      "Tout le plan Pro",
      "Plusieurs utilisateurs par entreprise",
      "Rapports détaillés",
      "Support prioritaire",
    ],
    cta: "Nous contacter",
    highlighted: false,
  },
];

const FAQ = [
  {
    question: "Mes factures sont-elles conformes au Sénégal ou en Côte d'Ivoire ?",
    answer:
      "Vous renseignez votre NINEA, votre RCCM, votre adresse et un pied de facture libre : ces mentions apparaissent sur chaque document. Le taux de TVA est configurable, il n'est pas figé à 18 %.",
  },
  {
    question: "Puis-je l'utiliser avec une connexion instable ?",
    answer:
      "L'application est légère et chaque action est confirmée explicitement : en cas de coupure, rien n'est enregistré à moitié. Vos données restent chez Supabase, pas sur votre téléphone.",
  },
  {
    question: "Que se passe-t-il si je me trompe sur une facture envoyée ?",
    answer:
      "Une facture envoyée ou payée n'est pas modifiable, pour éviter toute incohérence comptable. Vous émettez un avoir, comme le veut la pratique.",
  },
  {
    question: "Gérez-vous le mobile money ?",
    answer:
      "Vous pouvez déjà enregistrer un paiement reçu par mobile money, virement, chèque ou espèces. L'encaissement direct via Wave et Orange Money est prévu.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteHeader />

      <main>
        <section className="border-b border-line bg-surface-muted">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 text-center sm:pb-20 sm:pt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
              Pensé pour les entrepreneurs d&apos;Afrique de l&apos;Ouest
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Facturez vos clients en FCFA, sans tableur ni prise de tête
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-ink-soft sm:text-lg">
              Baraka crée vos factures, calcule la TVA, suit les paiements et
              vous dit exactement combien il vous reste à encaisser.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={buttonStyles({ variant: "primary" })}
              >
                Créer mon compte gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className={buttonStyles({ variant: "outline" })}>
                J&apos;ai déjà un compte
              </Link>
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              Sans carte bancaire · 5 factures par mois offertes
            </p>

            <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
              <Image
                src="/apercu-dashboard.png"
                alt="Tableau de bord Baraka : montant facturé, encaissé et en attente en FCFA"
                width={1587}
                height={998}
                priority
                className="w-full"
              />
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tout ce qu&apos;il faut pour facturer proprement
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Pas de fonctionnalité gadget : l&apos;essentiel, bien fait, avec les
            contraintes locales prises au sérieux.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-line bg-surface p-5 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-surface-muted">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Trois étapes, et vous êtes payé
            </h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-line bg-surface p-5 shadow-card"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="tarifs" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Des tarifs en FCFA, sans surprise
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Commencez gratuitement, passez au plan supérieur quand votre volume
            de factures augmente.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.highlighted
                    ? "rounded-2xl border-2 border-brand-500 bg-surface p-6 shadow-raised"
                    : "rounded-2xl border border-line bg-surface p-6 shadow-card"
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
                      Le plus choisi
                    </span>
                  )}
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {plan.price}
                </p>
                <p className="text-sm text-ink-faint">{plan.period}</p>
                <p className="mt-3 text-sm text-ink-soft">{plan.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-paid" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={buttonStyles({
                    variant: plan.highlighted ? "secondary" : "outline",
                    className: "mt-6 w-full justify-center",
                  })}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-line bg-surface-muted">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Questions fréquentes
            </h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-line bg-surface p-5 shadow-card"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm text-ink-soft">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Votre prochaine facture, en deux minutes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
              Créez votre compte, paramétrez votre entreprise et envoyez votre
              première facture dès aujourd&apos;hui.
            </p>
            <Link
              href="/signup"
              className={buttonStyles({
                variant: "secondary",
                className: "mt-7",
              })}
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Baraka. Facturation en FCFA.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-ink">
              Connexion
            </Link>
            <Link href="/signup" className="hover:text-ink">
              Créer un compte
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
