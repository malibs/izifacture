"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#fonctionnalites", label: "Fonctionnalités" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#temoignages", label: "À propos" },
  ];

  return (
    <>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-primary-fixed-dim/30 via-secondary-fixed/25 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[60vh] -right-20 w-72 h-72 bg-tertiary-fixed/15 blur-[90px] rounded-full" />
      </div>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container-high/30">
        <div className="h-16 sm:h-18 max-w-[1200px] mx-auto px-5 sm:px-gutter flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(79,70,229,0.35)] group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-on-primary text-[20px]">bolt</span>
              </div>
              <span className="font-bold text-[19px] tracking-tight text-on-surface">
                izi<span className="text-primary">Facture</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center text-[14px] font-semibold text-primary px-4 py-2.5 rounded-xl hover:bg-surface-container-high/60 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center text-[13px] sm:text-[14px] font-semibold text-on-primary bg-primary-container px-4 sm:px-5 py-2.5 rounded-xl shadow-[0_8px_18px_-4px_rgba(79,70,229,0.35)] hover:bg-primary hover:-translate-y-0.5 transition-all"
            >
              Essai gratuit
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-surface-container-high/50 flex items-center justify-center text-on-surface"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[22px]">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-surface-container-high/30">
            <div className="px-gutter py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[15px] font-semibold text-on-surface-variant hover:text-on-surface px-4 py-3 rounded-xl hover:bg-surface-container-high/40 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-semibold text-primary px-4 py-3 rounded-xl hover:bg-surface-container-high/40 transition-colors sm:hidden"
              >
                Se connecter
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* ===== MAIN ===== */}
      <main className="relative z-10 w-full pt-16 sm:pt-18 max-w-[1200px] mx-auto px-5 sm:px-gutter">
        {/* ===== HERO ===== */}
        <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high/70 border border-surface-container-high mb-6">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-[12px] font-semibold text-on-surface tracking-wide">
                Rejoint par +2 000 entrepreneurs ce mois-ci
              </span>
            </div>

            <h1 className="font-extrabold text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.1] tracking-tight text-on-surface">
              Faites-vous payer{" "}
              <span className="text-primary">immédiatement.</span>
            </h1>

            <p className="mt-5 text-[16px] sm:text-[18px] leading-relaxed text-on-surface-variant max-w-lg">
              En envoyant à vos clients les factures les plus élégantes et
              professionnelles du marché. Conçu pour l'Afrique, en FCFA.
            </p>

            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-on-primary bg-primary-container shadow-[0_14px_28px_-6px_rgba(79,70,229,0.4)] hover:bg-primary hover:-translate-y-0.5 transition-all"
            >
              Commencer gratuitement
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            {/* Trust banner */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {["#4F46E5", "#0051D5", "#005338", "#637bff", "#316bf3"].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-surface flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: c }}
                  >
                    {["FD", "IT", "MC", "AN", "KY"][i]}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-on-surface-variant leading-tight max-w-[200px]">
                Fait confiance par plus de <strong className="text-on-surface">5 000 entreprises</strong> dans 12 pays.
              </p>
            </div>
          </div>

          {/* Right: Invoice mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary-fixed-dim/30 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative bg-surface-container-lowest rounded-2xl shadow-[0_30px_60px_-15px_rgba(79,70,229,0.18)] p-7 border border-surface-container-high/30">
              {/* Invoice header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary text-[16px]">bolt</span>
                    </div>
                    <span className="font-bold text-[14px] text-on-surface">iziFacture</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Facture #2025-089</p>
                  <p className="text-[13px] text-on-surface font-semibold mt-0.5">Agence Créative Fatou</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-tertiary text-[11px] font-bold">Payée</span>
                  <p className="text-[11px] text-on-surface-variant mt-2">25 Oct 2025</p>
                </div>
              </div>

              <div className="border-t border-surface-container-high/50 pt-4 space-y-2.5">
                {[
                  ["Design logo & identité visuelle", "450 000"],
                  ["Déclinaisons réseaux sociaux", "180 000"],
                  ["Site vitrine (3 pages)", "720 000"],
                ].map(([label, amount]) => (
                  <div key={label} className="flex items-center justify-between text-[13px]">
                    <span className="text-on-surface-variant">{label}</span>
                    <span className="text-on-surface font-medium">{amount} F</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-container-high/50 mt-4 pt-4 space-y-1.5">
                <div className="flex justify-between text-[12px] text-on-surface-variant">
                  <span>Sous-total HT</span>
                  <span>1 144 067 F</span>
                </div>
                <div className="flex justify-between text-[12px] text-on-surface-variant">
                  <span>TVA (18%)</span>
                  <span>205 933 F</span>
                </div>
                <div className="flex justify-between text-[15px] font-bold text-on-surface pt-1">
                  <span>Total TTC</span>
                  <span className="text-primary">1 350 000 FCFA</span>
                </div>
              </div>

              {/* Payment badge */}
              <div className="mt-5 flex items-center gap-2.5 bg-tertiary/5 rounded-xl px-4 py-3">
                <div className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary text-[16px]">check</span>
                </div>
                <div className="text-[12px]">
                  <p className="font-bold text-tertiary">Payé via Wave</p>
                  <p className="text-on-surface-variant">Encaissé en 14 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BRAND STRIP ===== */}
        <div className="pb-16 lg:pb-20">
          <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant/70 mb-7">
            Paiements compatibles avec les opérateurs africains
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
            {[
              { label: "Wave", bg: "#4F46E5", text: "W" },
              { label: "Orange Money", bg: "#f97316", text: "OM" },
              { label: "MTN MoMo", bg: "#facc15", text: "M", dark: true },
              { label: "Ecobank", bg: "#1d4ed8", text: "ECO" },
              { label: "PayPal", bg: "#003087", text: "P" },
            ].map((brand) => (
              <div key={brand.label} className="flex items-center gap-2 font-bold text-[16px] text-on-surface">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${brand.dark ? "text-black" : "text-white"}`}
                  style={{ background: brand.bg }}
                >
                  {brand.text}
                </span>
                {brand.label}
              </div>
            ))}
          </div>
        </div>

        {/* ===== PROBLEM SECTION ===== */}
        <section id="pourquoi" className="py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] font-bold text-primary mb-3">Pourquoi iziFacture ?</p>
            <h2 className="font-bold text-[28px] sm:text-[36px] leading-tight tracking-tight text-on-surface">
              Le chaos administratif freine votre croissance.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-variant">
              Voici les obstacles que nous supprimons pour vous.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "description",
                title: "Factures peu professionnelles",
                desc: "L'image de votre marque en souffre. Vos clients hésitent à payer des documents bricolés sur Excel.",
                stat: "+38 j de retard moyen",
              },
              {
                icon: "percent",
                title: "Calculs de TVA manuels",
                desc: "Les erreurs de calcul coûtent cher. Un oubli de TVA de 18% peut grignoter toute votre marge.",
                stat: "Risque de redressement",
              },
              {
                icon: "visibility_off",
                title: "Suivi impossible",
                desc: "Ne plus savoir qui vous doit quoi est la cause numéro 1 des problèmes de trésorerie en Afrique.",
                stat: "Trésorerie bloquée",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface-container-lowest p-7 rounded-2xl border border-surface-container-high/30 hover:border-primary/20 hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-error-container/40 text-error flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </div>
                <h3 className="font-bold text-[17px] text-on-surface mb-2">{item.title}</h3>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{item.desc}</p>
                <p className="mt-5 text-[12px] font-semibold text-error flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">close</span>
                  {item.stat}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="fonctionnalites" className="py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] font-bold text-primary mb-3">La solution complète</p>
            <h2 className="font-bold text-[28px] sm:text-[36px] leading-tight tracking-tight text-on-surface">
              Tout ce dont vous avez besoin pour dominer votre marché.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "receipt_long", title: "Factures Pro en 2 clics", desc: "Modèles designés professionnellement pour votre entreprise.", color: "primary" },
              { icon: "calculate", title: "TVA 18% automatique", desc: "Plus d'erreurs de calcul, iziFacture s'occupe de tout.", color: "secondary" },
              { icon: "trending_up", title: "Suivi en temps réel", desc: "Sachez exactement qui vous doit quoi et quand.", color: "tertiary" },
              { icon: "groups", title: "Gestion Clients", desc: "Votre base de données clients à portée de main.", color: "primary" },
              { icon: "verified", title: "Conforme aux standards OHADA", desc: "Vos factures respectent les exigences légales régionales.", color: "secondary" },
              { icon: "lock", title: "Sécurité bancaire", desc: "Vos données financières protégées par un chiffrement de bout en bout.", color: "tertiary" },
            ].map((feat) => {
              const colors: Record<string, string> = {
                primary: "bg-primary-fixed text-primary",
                secondary: "bg-secondary-fixed text-secondary",
                tertiary: "bg-tertiary-fixed/40 text-tertiary",
              };
              return (
                <div
                  key={feat.title}
                  className="bg-surface-container-lowest p-7 rounded-2xl border border-surface-container-high/30 hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(79,70,229,0.1)] transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl ${colors[feat.color]} flex items-center justify-center mb-5`}>
                    <span className="material-symbols-outlined text-[24px]">{feat.icon}</span>
                  </div>
                  <h3 className="font-bold text-[16px] text-on-surface mb-1.5">{feat.title}</h3>
                  <p className="text-[14px] text-on-surface-variant leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Onboarding highlight */}
          <div className="mt-10 bg-gradient-to-br from-primary-fixed/50 via-surface-container-low to-secondary-fixed/30 rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[20px] text-on-surface">Prêt en moins de 2 minutes</h3>
              <p className="text-[14px] text-on-surface-variant mt-1">
                Pas de formation nécessaire. Une interface pensée pour vous.
              </p>
            </div>
            <Link
              href="/signup"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] text-on-primary bg-primary-container hover:bg-primary transition-all"
            >
              Démarrer maintenant
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] font-bold text-primary mb-3">Comment ça marche</p>
            <h2 className="font-bold text-[28px] sm:text-[36px] leading-tight tracking-tight text-on-surface">
              Trois étapes, c'est tout.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-0.5 border-t-2 border-dashed border-surface-container-high" />
            {[
              {
                num: "1",
                title: "Créez votre compte",
                desc: "Inscrivez-vous gratuitement sans carte bancaire requise.",
                color: "bg-primary text-on-primary",
              },
              {
                num: "2",
                title: "Ajoutez votre client",
                desc: "Entrez les détails de votre client une seule fois pour toujours.",
                color: "bg-secondary text-on-secondary",
              },
              {
                num: "3",
                title: "Envoyez la facture",
                desc: "Téléchargez ou envoyez par email en un clic. C'est fini !",
                color: "bg-tertiary text-on-tertiary",
              },
            ].map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center font-bold text-[20px] mb-5 shadow-[0_8px_18px_rgba(0,0,0,0.12)] relative z-10`}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-[17px] text-on-surface mb-2">{step.title}</h3>
                <p className="text-[14px] text-on-surface-variant max-w-[240px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section id="temoignages" className="py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] font-bold text-primary mb-3">Ils ont choisi l'excellence</p>
            <h2 className="font-bold text-[28px] sm:text-[36px] leading-tight tracking-tight text-on-surface">
              Ce que disent nos entrepreneurs.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Simple, beau et surtout efficace. Mes clients me prennent beaucoup plus au sérieux maintenant.",
                name: "Fatou Diop",
                role: "Agence Créative — Dakar",
                initials: "FD",
                color: "#4F46E5",
              },
              {
                quote: "Enfin une solution qui gère le FCFA correctement. Le gain de crédibilité est immédiat.",
                name: "Ibrahim Traoré",
                role: "Freelance — Abidjan",
                initials: "IT",
                color: "#0051D5",
              },
              {
                quote: "Le gain de temps est incroyable. Plus besoin de vérifier les calculs trois fois.",
                name: "Moussa Camara",
                role: "Tech Startup — Douala",
                initials: "MC",
                color: "#005338",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-surface-container-lowest p-7 rounded-2xl border border-surface-container-high/30 flex flex-col"
              >
                <div className="flex items-center gap-1 text-tertiary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                  ))}
                </div>
                <p className="text-[15px] text-on-surface-variant italic leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-surface-container-high/40">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-on-surface">{t.name}</p>
                    <p className="text-[12px] text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="tarifs" className="py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[13px] font-bold text-primary mb-3">Un prix pour chaque étape</p>
            <h2 className="font-bold text-[28px] sm:text-[36px] leading-tight tracking-tight text-on-surface">
              Commencez gratuitement, évoluez selon vos besoins.
            </h2>
            <p className="mt-3 text-[15px] text-on-surface-variant">Pas d'engagement. Pas de frais cachés.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
            {/* Starter */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-high/30 flex flex-col">
              <h3 className="font-bold text-[18px] text-on-surface mb-1">Starter</h3>
              <p className="text-[13px] text-on-surface-variant mb-5">Pour démarrer en douceur</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-extrabold text-[36px] text-on-surface">0</span>
                <span className="text-[14px] text-on-surface-variant font-medium">FCFA /mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["5 factures / mois", "1 utilisateur", "Calcul TVA 18% automatique", "Support par email"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="w-full text-center py-3.5 rounded-xl font-semibold text-[15px] text-primary bg-primary-fixed hover:bg-primary-fixed-dim transition-colors"
              >
                Choisir
              </Link>
            </div>

            {/* Pro — Highlighted */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_25px_50px_-10px_rgba(79,70,229,0.2)] flex flex-col relative lg:-translate-y-3 border-2 border-primary/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                Plus Populaire
              </div>
              <h3 className="font-bold text-[18px] text-primary mb-1">Pro</h3>
              <p className="text-[13px] text-on-surface-variant mb-5">Pour les pros ambitieux</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-extrabold text-[40px] text-on-surface">5 000</span>
                <span className="text-[14px] text-on-surface-variant font-medium">FCFA /mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Factures illimitées", "3 utilisateurs", "Relances automatiques", "Logo personnalisé", "Multi-devises (FCFA, EUR, USD)"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-on-surface font-medium">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="w-full text-center py-4 rounded-xl font-semibold text-[15px] text-on-primary bg-primary-container shadow-[0_12px_24px_-4px_rgba(79,70,229,0.4)] hover:bg-primary transition-all"
              >
    Choisir Pro
              </Link>
            </div>

            {/* Business */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-high/30 flex flex-col">
              <h3 className="font-bold text-[18px] text-on-surface mb-1">Business</h3>
              <p className="text-[13px] text-on-surface-variant mb-5">Pour les équipes en croissance</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-extrabold text-[36px] text-on-surface">15 000</span>
                <span className="text-[14px] text-on-surface-variant font-medium">FCFA /mois</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Multi-compte", "Support Prioritaire", "Exports comptables", "Jusqu'à 10 collaborateurs", "Accès API & webhooks"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="w-full text-center py-3.5 rounded-xl font-semibold text-[15px] text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
              >
    Choisir
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-12 lg:py-20">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary-container via-primary to-secondary-container text-on-primary p-8 sm:p-14 text-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(79,70,229,0.35)]">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-extrabold text-[28px] sm:text-[40px] leading-tight tracking-tight mb-4">
                Rejoignez les entrepreneurs qui facturent comme des pros.
              </h2>
              <p className="text-[16px] text-on-primary/85 max-w-lg mx-auto mb-8">
                Pas d'engagement. Pas de frais cachés.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[15px] text-primary bg-surface-container-lowest shadow-xl hover:bg-surface hover:scale-[1.02] transition-all"
                >
    Créer mon compte gratuit
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <a
                  href="mailto:contact@izifacture.com"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-[15px] text-on-primary bg-on-primary/10 hover:bg-on-primary/15 backdrop-blur-sm transition-all"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-surface-container-high/30 mt-12">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-gutter py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <span className="font-bold text-[17px] text-on-surface">izi<span className="text-primary">Facture</span></span>
              </div>
              <p className="text-[14px] text-on-surface-variant leading-relaxed max-w-xs">
                La solution de facturation leader en Afrique francophone. Nous
                aidons les entrepreneurs à professionnaliser leur activité et à
                se faire payer plus rapidement.
              </p>
            </div>
            <div>
              <p className="font-bold text-[13px] uppercase tracking-wider text-on-surface mb-3">Produit</p>
              <div className="flex flex-col gap-2.5">
                <a href="#fonctionnalites" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Fonctionnalités</a>
                <a href="#tarifs" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Tarifs</a>
                <a href="#temoignages" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Témoignages</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Démo en direct</a>
              </div>
            </div>
            <div>
              <p className="font-bold text-[13px] uppercase tracking-wider text-on-surface mb-3">Entreprise</p>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">À propos</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Blog</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Carrières</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Presse</a>
              </div>
            </div>
            <div>
              <p className="font-bold text-[13px] uppercase tracking-wider text-on-surface mb-3">Légal</p>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Conditions d'utilisation</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Confidentialité</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Mentions légales</a>
                <a href="#" className="text-[14px] text-on-surface-variant hover:text-primary transition-colors">Cookies</a>
              </div>
            </div>
          </div>

          {/* City markers */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-surface-container-high/40">
            <div className="flex items-center gap-5 sm:gap-8">
              {["Dakar", "Abidjan", "Douala", "Paris"].map((city) => (
                <div key={city} className="flex items-center gap-1.5 text-[13px] font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                  {city}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-on-surface-variant">
              © 2025 iziFacture. Fait avec fierté en Afrique pour le monde.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}