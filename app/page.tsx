"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pricePro = isAnnual ? "4 000" : "5 000";
  const priceBiz = isAnnual ? "12 000" : "15 000";

  const navLinks = [
    { href: "#fonctionnalites", label: "Fonctionnalités" },
    { href: "#avantages", label: "Avantages" },
    { href: "#comment-ca-marche", label: "Comment ça marche" },
    { href: "#temoignages", label: "Témoignages" },
    { href: "#tarifs", label: "Tarifs" },
  ];

  return (
    <>
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[920px] h-[480px] bg-gradient-to-tr from-primary-fixed-dim/35 via-secondary-fixed/40 to-tertiary-fixed/20 blur-[130px] rounded-full" />
        <div className="absolute top-96 -left-32 w-80 h-80 bg-surface-container-highest/60 blur-[100px] rounded-full" />
      </div>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 sm:h-20 max-w-[1240px] mx-auto px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_10px_20px_-4px_rgba(79,70,229,0.35)] group-hover:bg-primary-container transition-all">
                <span className="material-symbols-outlined text-on-primary text-[20px] sm:text-[22px]">
                  bolt
                </span>
              </div>
              <div className="flex items-baseline tracking-tight">
                <span className="font-headline-sm sm:font-headline-md text-headline-sm sm:text-headline-md text-on-surface">
                  izi
                </span>
                <span className="font-headline-sm sm:font-headline-md text-headline-sm sm:text-headline-md text-primary">
                  Facture
                </span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-space-sm">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center font-label-lg text-label-lg text-primary px-space-md py-2.5 rounded-xl hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center font-label-md sm:font-label-lg text-label-md sm:text-label-lg text-on-primary bg-primary-container px-3 sm:px-space-md py-2 sm:py-2.5 rounded-xl shadow-[0_10px_20px_-4px_rgba(79,70,229,0.35)] hover:bg-primary hover:-translate-y-0.5 transition-all"
            >
              <span className="hidden sm:inline">Commencer gratuitement</span>
              <span className="sm:hidden">S'inscrire</span>
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-surface-container-high/60 flex items-center justify-center text-on-surface transition-colors"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-surface/95 backdrop-blur-xl border-t border-surface-container-high/40">
            <div className="px-gutter py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 px-4 py-3 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="font-label-lg text-label-lg text-primary px-4 py-3 rounded-xl hover:bg-surface-container-high/40 transition-colors sm:hidden"
              >
                Connexion
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* ===== MAIN ===== */}
      <main className="relative z-10 w-full pt-20 max-w-[1240px] mx-auto px-gutter">
        <div className="flex flex-col w-full">
          {/* Ambient line pattern */}
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
              <svg
                className="w-full h-full text-primary-fixed-dim"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 1440 900"
              >
                <path
                  d="M-100 200 C 300 120, 600 320, 1100 160 C 1300 100, 1500 250, 1600 220"
                  opacity="0.6"
                  stroke="currentColor"
                  strokeDasharray="6 8"
                  strokeWidth="1.2"
                />
                <path
                  d="M-60 380 C 340 260, 720 480, 1200 320 C 1400 260, 1540 360, 1640 330"
                  opacity="0.45"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M-80 560 C 280 440, 800 620, 1260 490 C 1460 420, 1580 510, 1680 480"
                  opacity="0.3"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* ===== 1. HERO ===== */}
            <section className="relative pt-6 pb-20 lg:pt-14 lg:pb-32 flex flex-col items-center text-center">
              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/80 text-primary mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="font-label-sm text-label-sm tracking-wide">
                  La facturation nouvelle génération en Afrique de l'Ouest &
                  Centrale
                </span>
              </div>

              {/* Headline */}
              <div className="max-w-4xl mx-auto px-4">
                <h1 className="font-display-hero text-display-hero-mobile sm:text-display-hero text-on-surface tracking-tight leading-[1.12]">
                  Fini les factures sur Word et Excel.
                  <br className="hidden sm:inline" />
                  Facturez avec l'élégance{" "}
                  <span className="relative inline-block text-primary whitespace-nowrap">
                    des grands
                    <svg
                      className="absolute -bottom-2 sm:-bottom-3 left-0 w-full overflow-visible text-secondary-container"
                      fill="none"
                      viewBox="0 0 240 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 13C62 4.5 174 2.8 237 11.2C188 6.5 102 6.5 12 16"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4.5"
                      />
                    </svg>
                  </span>
                  .
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto">
                  La solution de facturation moderne conçue pour les
                  entrepreneurs africains : créez des factures professionnelles
                  en 3 clics, calculez automatiquement la TVA 18% et encaissez
                  plus vite en FCFA.
                </p>

                {/* CTA Buttons */}
                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-label-lg text-label-lg text-on-primary bg-primary-container shadow-[0_14px_30px_-6px_rgba(79,70,229,0.4)] hover:bg-primary hover:-translate-y-0.5 transition-all"
                  >
                    <span>Commencer gratuitement</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </Link>
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-label-lg text-label-lg text-on-surface bg-surface-container-lowest shadow-sm hover:bg-surface-container transition-all"
                    type="button"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[16px]">
                        play_arrow
                      </span>
                    </span>
                    <span>Voir la démo en 1 min</span>
                  </button>
                </div>
              </div>

              {/* Hero Composition — 3 Floating Cards */}
              <div className="relative w-full max-w-6xl mt-16 sm:mt-20 px-2 lg:px-4">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-4/5 h-80 bg-gradient-to-r from-primary-fixed-dim/40 via-secondary-fixed/50 to-tertiary-fixed/30 blur-[90px] rounded-full pointer-events-none -z-10" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Recurring Invoice Card */}
                  <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-4">
                    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_16px_36px_-8px_rgba(79,70,229,0.08)] text-left hover:-translate-y-1 transition-transform">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-headline-sm text-[16px] text-on-surface font-semibold">
                          Facture Récurrente
                        </span>
                        <span className="w-2 h-2 rounded-full bg-secondary-container" />
                      </div>
                      <div className="flex flex-col gap-2.5 mb-4">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest" />
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface">
                            Envoyer maintenant
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer opacity-70">
                          <span className="w-4 h-4 rounded-full bg-surface-container-high" />
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Programmer date fixe
                          </span>
                        </label>
                      </div>
                      <div className="mb-3.5">
                        <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1">
                          Fréquence d'envoi
                        </span>
                        <div className="h-9 px-3 rounded-lg bg-surface-container-low flex items-center justify-between text-on-surface font-body-sm text-body-sm">
                          <span>Mensuelle (le 1er)</span>
                          <span className="material-symbols-outlined text-[16px] text-outline">
                            expand_more
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1">
                          Nombre d'échéances
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="h-9 flex-1 px-3 rounded-lg bg-surface-container-low flex items-center font-body-sm text-body-sm text-on-surface">
                            <span>12 fois</span>
                          </div>
                          <div className="h-9 px-3 rounded-lg bg-primary-fixed text-primary flex items-center gap-1 font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[14px]">
                              all_inclusive
                            </span>
                            <span>Infini</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between gap-3 text-left">
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface">
                          Devis #DEV-042 validé
                        </p>
                        <p className="font-body-sm text-[11px] text-tertiary">
                          Signé électroniquement
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center font-label-sm text-primary">
                        MD
                      </div>
                    </div>
                  </div>

                  {/* Center: Analytics Chart Card */}
                  <div className="lg:col-span-6 order-1 lg:order-2">
                    <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-3xl shadow-[0_24px_50px_-10px_rgba(79,70,229,0.12)] text-left relative overflow-hidden">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant block mb-0.5">
                            Trésorerie encaissée (FCFA)
                          </span>
                          <h3 className="font-headline-lg text-[30px] text-on-surface tracking-tight font-bold">
                            14 280 000{" "}
                            <span className="font-body-md text-body-md text-outline font-normal">
                              FCFA
                            </span>
                          </h3>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-[16px]">
                            trending_up
                          </span>
                          <span>+28.4% ce mois</span>
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="relative w-full h-56 sm:h-64 mt-2">
                        <div className="absolute left-[54%] top-3 bottom-8 flex flex-col items-center pointer-events-none z-20">
                          <div className="bg-on-surface text-surface-container-lowest px-3 py-1 rounded-lg shadow-lg font-label-sm text-[12px] whitespace-nowrap mb-1 flex items-center gap-1">
                            <span>4 850 000 FCFA</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed" />
                          </div>
                          <div className="w-0.5 h-full border-l-2 border-dashed border-primary" />
                        </div>
                        <svg
                          className="w-full h-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 540 220"
                        >
                          <defs>
                            <linearGradient
                              id="chartGradient"
                              x1="0"
                              x2="0"
                              y1="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#4F46E5"
                                stopOpacity="0.3"
                              />
                              <stop
                                offset="100%"
                                stopColor="#4F46E5"
                                stopOpacity="0.0"
                              />
                            </linearGradient>
                          </defs>
                          <line
                            stroke="#E2E8F0"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                            x1="40"
                            x2="520"
                            y1="30"
                            y2="30"
                          />
                          <line
                            stroke="#E2E8F0"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                            x1="40"
                            x2="520"
                            y1="80"
                            y2="80"
                          />
                          <line
                            stroke="#E2E8F0"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                            x1="40"
                            x2="520"
                            y1="130"
                            y2="130"
                          />
                          <line
                            stroke="#E2E8F0"
                            strokeWidth="1"
                            x1="40"
                            x2="520"
                            y1="180"
                            y2="180"
                          />
                          <text
                            fill="#94A3B8"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="10"
                            x="5"
                            y="34"
                          >
                            16M
                          </text>
                          <text
                            fill="#94A3B8"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="10"
                            x="5"
                            y="84"
                          >
                            10M
                          </text>
                          <text
                            fill="#94A3B8"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="10"
                            x="12"
                            y="134"
                          >
                            5M
                          </text>
                          <text
                            fill="#94A3B8"
                            fontFamily="Plus Jakarta Sans"
                            fontSize="10"
                            x="18"
                            y="184"
                          >
                            0
                          </text>
                          <path
                            d="M 40 170 C 90 160, 130 90, 180 120 C 230 150, 260 50, 300 70 C 350 95, 380 30, 430 85 C 470 135, 490 60, 520 75 L 520 180 L 40 180 Z"
                            fill="url(#chartGradient)"
                          />
                          <path
                            d="M 40 170 C 90 160, 130 90, 180 120 C 230 150, 260 50, 300 70 C 350 95, 380 30, 430 85 C 470 135, 490 60, 520 75"
                            stroke="#3525cd"
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="180"
                            cy="120"
                            fill="#3525cd"
                            r="4.5"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <circle
                            cx="300"
                            cy="70"
                            fill="#3525cd"
                            r="6"
                            stroke="#ffffff"
                            strokeWidth="3"
                          />
                          <circle
                            cx="430"
                            cy="85"
                            fill="#3525cd"
                            r="4.5"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </svg>
                        <div className="flex justify-between px-8 text-on-surface-variant font-label-sm text-[11px] mt-1">
                          <span>Lun</span>
                          <span>Mar</span>
                          <span>Mer</span>
                          <span className="font-semibold text-primary">
                            Jeu
                          </span>
                          <span>Ven</span>
                          <span>Sam</span>
                          <span>Dim</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/50 px-3 py-2 rounded-xl">
                        <span className="font-body-sm text-[12px] text-on-surface-variant">
                          Facture la plus rapide : payée en 14 min via Wave
                        </span>
                        <span className="font-label-sm text-[12px] text-primary flex items-center gap-1 font-semibold">
                          Détails{" "}
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment Tracking Timeline */}
                  <div className="lg:col-span-3 order-3 flex flex-col gap-4">
                    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_16px_36px_-8px_rgba(79,70,229,0.08)] text-left hover:-translate-y-1 transition-transform">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-headline-sm text-[16px] text-on-surface font-semibold">
                          Suivi des Règlements
                        </span>
                        <span className="font-label-sm text-[11px] text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                          En direct
                        </span>
                      </div>
                      <div className="space-y-3.5 relative">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              description
                            </span>
                          </div>
                          <div>
                            <p className="font-label-sm text-[13px] text-on-surface leading-tight">
                              Facture créée
                            </p>
                            <p className="font-body-sm text-[11px] text-on-surface-variant">
                              25 Oct, 09:32 • 850 000 FCFA
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              visibility
                            </span>
                          </div>
                          <div>
                            <p className="font-label-sm text-[13px] text-on-surface leading-tight">
                              Consultée sur WhatsApp
                            </p>
                            <p className="font-body-sm text-[11px] text-on-surface-variant">
                              25 Oct, 09:44 • Client en ligne
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              schedule
                            </span>
                          </div>
                          <div>
                            <p className="font-label-sm text-[13px] text-on-surface leading-tight">
                              Relance auto J+3
                            </p>
                            <p className="font-body-sm text-[11px] text-on-surface-variant">
                              Prête si non-paiement
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-tertiary/5 p-2 rounded-xl">
                          <div className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              check
                            </span>
                          </div>
                          <div>
                            <p className="font-label-sm text-[13px] text-tertiary font-bold leading-tight">
                              Payée via Wave
                            </p>
                            <p className="font-body-sm text-[11px] text-tertiary font-medium">
                              Reçu instantané émis
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md flex items-center gap-3 text-left">
                      <div className="w-7 h-7 rounded-full bg-secondary-container text-on-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">
                          send
                        </span>
                      </div>
                      <div className="leading-tight">
                        <p className="font-label-sm text-label-sm text-on-surface">
                          Facture transmise
                        </p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">
                          Orange Money & MoMo actifs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof Brand Strip */}
              <div className="mt-20 w-full max-w-5xl px-4">
                <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant/80 mb-8">
                  Rejoint par plus de 5 000+ entrepreneurs, agences et PME à
                  Dakar, Abidjan, Douala et Yaoundé
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center opacity-75 grayscale hover:grayscale-0 transition-all">
                  <div className="flex items-center gap-2 font-headline-sm text-on-surface font-extrabold text-[19px]">
                    <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs">
                      W
                    </span>
                    <span>Wave</span>
                  </div>
                  <div className="flex items-center gap-2 font-headline-sm text-on-surface font-extrabold text-[19px]">
                    <span className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs">
                      OM
                    </span>
                    <span>OrangeMoney</span>
                  </div>
                  <div className="flex items-center gap-2 font-headline-sm text-on-surface font-extrabold text-[19px]">
                    <span className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center text-black text-xs font-bold">
                      M
                    </span>
                    <span>MTN MoMo</span>
                  </div>
                  <div className="flex items-center gap-2 font-headline-sm text-on-surface font-extrabold text-[19px]">
                    <span className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs">
                      ECO
                    </span>
                    <span>Ecobank</span>
                  </div>
                  <div className="flex items-center gap-2 font-headline-sm text-on-surface font-extrabold text-[19px]">
                    <span className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-white text-xs">
                      PRO
                    </span>
                    <span>Prosuma</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ===== 2. PROBLEM SECTION ===== */}
          <section id="avantages" className="py-16 lg:py-24">
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Le constat quotidien
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-2">
                La facturation traditionnelle freine votre croissance
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mt-3">
                Vos heures précieuses sont aspirées par des tâches
                administratives manuelles et des retards d'encaissement
                évitables.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-error-container/40 text-error flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      grid_off
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                    Factures Word & Excel bricolées
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Mises en page brisées sur mobile, logos pixelisés et absence
                    de standard OHADA qui font douter les directions financières
                    de vos clients grands comptes.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-surface-container-low px-4 py-2.5 rounded-xl font-label-sm text-[12px] text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                  Perte de crédibilité commerciale
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-error-container/40 text-error flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      percent
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                    Casse-tête du calcul de la TVA 18%
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Erreurs d'arrondi sur les totaux HT/TTC, confusion avec
                    l'AIRSI et risques inutiles lors de vos déclarations d'impôts
                    mensuelles.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-surface-container-low px-4 py-2.5 rounded-xl font-label-sm text-[12px] text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    warning
                  </span>
                  Risque de redressement fiscal
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-error-container/40 text-error flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      timer_off
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
                    Retards de paiement chroniques
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Pas de visibilité sur qui a ouvert quoi, timidité pour
                    relancer manuellement, et trésorerie qui stagne alors que
                    vous avez livré le travail.
                  </p>
                </div>
                <div className="mt-6 pt-4 bg-surface-container-low px-4 py-2.5 rounded-xl font-label-sm text-[12px] text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    hourglass_empty
                  </span>
                  +38 jours de retard moyen
                </div>
              </div>
            </div>
          </section>

          {/* ===== 3. FEATURES BENTO ===== */}
          <section id="fonctionnalites" className="py-16 lg:py-24">
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Puissance & Simplicité
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-2">
                Tout pour piloter votre facturation comme une entreprise d'élite
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mt-3">
                Une suite d'outils taillée sur mesure pour les réalités
                opérationnelles des entreprises en Afrique.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1: Factures en 2 clics */}
              <div className="md:col-span-7 bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-[0_14px_35px_rgba(79,70,229,0.06)] flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      receipt_long
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    Standard Conforme OHADA
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1 mb-3">
                    Factures professionnelles en 2 clics
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-6">
                    Insérez votre logo, mentionnez votre NINEA / RCCM, et
                    choisissez votre modèle épuré. Exportez des PDF nets et
                    légers directement partageables avec vos donneurs d'ordre.
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl">
                  <div className="flex items-center justify-between pb-3 mb-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold">
                        INV
                      </span>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface">
                          Facture #2025-089
                        </p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">
                          Société Générale Sénégal
                        </p>
                      </div>
                    </div>
                    <span className="font-headline-sm text-headline-sm text-primary">
                      2 450 000 FCFA
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-body-sm">
                    <div className="bg-surface-container-lowest py-2 rounded-lg text-on-surface-variant">
                      HT: 2 076 271 F
                    </div>
                    <div className="bg-surface-container-lowest py-2 rounded-lg text-primary font-semibold">
                      TVA (18%): 373 729 F
                    </div>
                    <div className="bg-tertiary-fixed/30 py-2 rounded-lg text-tertiary font-bold">
                      Statut: Conforme
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: TVA 18% */}
              <div className="md:col-span-5 bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-[0_14px_35px_rgba(79,70,229,0.06)] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      calculate
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">
                    Zéro prise de tête
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1 mb-3">
                    TVA 18% & taxes locales automatiques
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    Fini les tableurs et les formules Excel corrompues. Le
                    moteur calcule immédiatement le Hors Taxe, la TVA et les
                    retenues à la source selon la fiscalité de votre pays.
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">
                      Option activée
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      Zone UEMOA / CEMAC (18%)
                    </span>
                  </div>
                  <span className="w-9 h-5 rounded-full bg-primary flex items-center justify-end px-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-on-primary" />
                  </span>
                </div>
              </div>

              {/* Feature 3: Suivi WhatsApp */}
              <div className="md:col-span-5 bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-[0_14px_35px_rgba(79,70,229,0.06)] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      mark_chat_unread
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                    Moins d'impayés
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1 mb-3">
                    Suivi en temps réel & relances WhatsApp
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    Sachez précisément quand votre client consulte votre devis
                    ou facture. Déclenchez des relances courtoises programmées
                    par e-mail et WhatsApp en 1 tap.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-2xl">
                  <span className="w-9 h-9 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      chat
                    </span>
                  </span>
                  <div className="text-left text-body-sm">
                    <p className="font-label-sm text-on-surface font-semibold">
                      Message WhatsApp automatique
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      "Bonjour M. Traoré, votre facture #304 arrive à
                      échéance..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4: CRM Client */}
              <div className="md:col-span-7 bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-[0_14px_35px_rgba(79,70,229,0.06)] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed-dim text-primary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      groups
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    Vision 360° Trésorerie
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1 mb-3">
                    Répertoire commercial & encours client
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-6">
                    Gardez l'historique complet de chaque client : total
                    facturé à date, devis en attente, acomptes déjà versés et
                    délais moyens de règlement.
                  </p>
                </div>
                <div className="space-y-2 bg-surface-container-low p-3.5 rounded-2xl">
                  <div className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-xs">
                        BK
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface">
                        Bamba & Konsortium
                      </span>
                    </div>
                    <span className="font-label-sm text-[12px] text-tertiary">
                      Payé (100%)
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                      3 200 000 FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                        AG
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface">
                        Atlantic Global CI
                      </span>
                    </div>
                    <span className="font-label-sm text-[12px] text-secondary font-medium">
                      Échéance J-2
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                      1 850 000 FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 4. HOW IT WORKS ===== */}
          <section
            id="comment-ca-marche"
            className="py-16 lg:py-24 bg-surface-container-low/60 rounded-3xl p-6 sm:p-12 my-6"
          >
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Fluidité Absolue
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-2">
                Comment ça marche ?
              </h2>
              <p className="text-on-surface-variant font-body-md text-body-md mt-2">
                De l'inscription à l'encaissement de vos premiers FCFA en moins
                de 3 minutes chrono.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm mb-5 shadow-[0_8px_16px_rgba(79,70,229,0.3)]">
                  1
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Inscris-toi en 30 secondes
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Aucun moyen de paiement requis. Configure le nom de ton
                  entreprise, ton logo et choisis ta devise locale de travail.
                </p>
              </div>
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-headline-sm text-headline-sm mb-5 shadow-[0_8px_16px_rgba(0,81,213,0.3)]">
                  2
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Crée ta première facture en FCFA
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Sélectionne ton client, ajoute tes prestations et laisse
                  iziFacture calculer automatiquement la TVA 18% et les totaux.
                </p>
              </div>
              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-headline-sm text-headline-sm mb-5 shadow-[0_8px_16px_rgba(0,83,56,0.3)]">
                  3
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Envoie et sois payé plus vite
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Partage le lien de paiement direct, le PDF officiel ou
                  transmets la facture par WhatsApp. Encaisse par Mobile Money
                  ou Virement.
                </p>
              </div>
            </div>
          </section>

          {/* ===== 5. TESTIMONIALS ===== */}
          <section id="temoignages" className="py-16 lg:py-24">
            <div className="text-center max-w-3xl mx-auto mb-16 px-4">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Retour d'expérience
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-2">
                Ils ont fait décoller leur trésorerie
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mt-3">
                Découvrez pourquoi des centaines d'entrepreneurs africains ont
                définitivement abandonné les tableurs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Testimonial 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-tertiary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px]"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mb-6 leading-relaxed">
                    « Nous perdions des jours à courir après les règlements.
                    Avec iziFacture et les relances WhatsApp, nos clients nous
                    paient en moyenne 9 jours plus vite. C'est le jour et la
                    nuit pour notre BFR. »
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-surface-container-high/40">
                  <img
                    className="w-11 h-11 rounded-full object-cover"
                    alt="Portrait professionnel de Amadou Ndiaye"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcr4uFWLIt_LPvccrThZ2y_LkBp8jxqwnlV-dxp2_vai3d0LuMlkjKRFY_FR-7LxNi3TsU1zTX-VCd2HqIGTToAYMdQ_S3nO_rTnNfFWjJcTb9Qr1V3FCJfFP50oes63jXPHer2AHDl4y3LLX6yXb3aSZt0CdU6i2q_q1G9JDC-0lZLCiDh7m5wySnz3rBlDPYWMkfbQ0aY4wRU4lVs9KCt4bKNQLGHHJSazPIa6jj3mcWjqIJrJ7y"
                  />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Amadou Ndiaye
                    </p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      Fondateur, Teranga Digital (Dakar, Sénégal)
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-tertiary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px]"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mb-6 leading-relaxed">
                    « La gestion de la TVA 18% et les devis transformés en
                    facture d'un clic nous ont évité des erreurs comptables
                    coûteuses. Les formats PDF sont immédiatement acceptés par
                    nos clients industriels. »
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-surface-container-high/40">
                  <img
                    className="w-11 h-11 rounded-full object-cover"
                    alt="Portrait souriant de Kouamé Yao"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlISQK9kxsHlye-JVDO7RGOk486HH_pLUl6xUWP4FWYQTRHXko6kD62P8NgI_nwMvGX2DRDswn_IHZHZwN_jof7HKlMZxp0Li5q0ZsjrxHPnVXXSZTMw1qiNUIgsHB8tT8_103SPW_q9eDsMJx5EY2m4RkQblu2zMJfkKxWEn4OwRkBQ465MMjjBHWK9sZCBDfjlmVoQP1-nZ_UQGKcecw_6aWpKutYNOMpjMVllSNDINUUNKF4-fa"
                  />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Kouamé Yao
                    </p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      Directeur, BTP & Équipements (Abidjan, CI)
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-tertiary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px]"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant italic mb-6 leading-relaxed">
                    « L'image de ma structure s'est immédiatement
                    professionnalisée. Mes clients reçoivent désormais des
                    factures impeccables dignes d'une grande multinationale. Je
                    ne pourrais plus revenir en arrière. »
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-surface-container-high/40">
                  <img
                    className="w-11 h-11 rounded-full object-cover"
                    alt="Portrait élégant de Estelle Mballa"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs2xvC5RN8dVXpdMcqzlcI3CC0K9nNDLNVaknFWH5nitOtAG-vaymOEhBgvZSgA0EeghrhE8S8t6_7_T2q1eod6iECpy1emCbazliLPo6eFIf1FlO1v_nGkV8afZ_BDR-3a-8txI0-7SYetdO7nOMFPXVl9ETUZhIgBTjSXUOJzkPLoKXvTs13BIcw8hQGa-yLjgnB---MH-vbzOC9d9B12ZOR9CkdaTo5R19jHmkUrTUwGHwDNTQe"
                  />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">
                      Estelle Mballa
                    </p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      Consultante RH & Formatrice (Douala, Cameroun)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 6. PRICING ===== */}
          <section id="tarifs" className="py-16 lg:py-24">
            <div className="text-center max-w-2xl mx-auto mb-12 px-4">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Transparence Totale
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-2">
                Des forfaits simples adaptés à votre volume
              </h2>
              <p className="text-on-surface-variant font-body-md text-body-md mt-2">
                Commencez gratuitement, changez d'avis à tout moment. Paiement
                par Mobile Money ou Carte.
              </p>

              {/* Billing Period Toggle */}
              <div className="inline-flex items-center gap-2 mt-8 p-1.5 rounded-full bg-surface-container">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-full font-label-sm text-label-sm font-semibold transition-all ${
                    !isAnnual
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Facturation Mensuelle
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2 rounded-full font-label-sm text-label-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isAnnual
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span>Annuel</span>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[10px]">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {/* Plan 1: Gratuit */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div>
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block mb-2">
                    Découverte
                  </span>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-headline-lg text-[38px] text-on-surface font-extrabold">
                      0
                    </span>
                    <span className="font-headline-sm text-on-surface-variant">
                      FCFA /mois
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    Idéal pour les indépendants et débutants qui démarrent leur
                    activité.
                  </p>
                  <ul className="space-y-3.5 mb-8">
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Jusqu'à 5 factures & devis /mois</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Calcul automatique TVA 18%</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Export PDF standard</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface-variant opacity-60">
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        remove
                      </span>
                      <span>Logo iziFacture sur le pied de page</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full text-center py-3.5 rounded-xl font-label-lg text-label-lg text-primary bg-primary-fixed hover:bg-primary-fixed-dim transition-colors"
                >
                  Activer le plan gratuit
                </Link>
              </div>

              {/* Plan 2: Pro (HIGHLIGHTED) */}
              <div className="bg-surface-container-lowest p-8 sm:p-9 rounded-3xl shadow-[0_25px_50px_-10px_rgba(79,70,229,0.2)] flex flex-col justify-between relative transform lg:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary font-label-sm text-[11px] uppercase tracking-wider font-bold shadow-md">
                  Le Plus Populaire
                </div>
                <div>
                  <span className="font-label-md text-label-md text-primary uppercase tracking-wider block mb-2 font-bold">
                    Entrepreneurs & PME
                  </span>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-headline-lg text-[40px] text-on-surface font-extrabold">
                      {pricePro}
                    </span>
                    <span className="font-headline-sm text-on-surface-variant">
                      FCFA /mois
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    Pour accélérer vos paiements et automatiser l'ensemble de
                    votre suivi client.
                  </p>
                  <ul className="space-y-3.5 mb-8">
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface font-medium">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        check_circle
                      </span>
                      <span>
                        <strong>Factures & Devis illimités</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        check_circle
                      </span>
                      <span>Relances automatiques par WhatsApp & Email</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        check_circle
                      </span>
                      <span>Lien de paiement Mobile Money & CB</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        check_circle
                      </span>
                      <span>Suppression complète du logo iziFacture</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        check_circle
                      </span>
                      <span>Multi-devises (FCFA, EUR, USD)</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full text-center py-4 rounded-xl font-label-lg text-label-lg text-on-primary bg-primary-container shadow-[0_12px_24px_-4px_rgba(79,70,229,0.4)] hover:bg-primary transition-all"
                >
                  Essayer Pro 14 jours gratuits
                </Link>
              </div>

              {/* Plan 3: Business */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div>
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block mb-2">
                    Grandes Équipes
                  </span>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="font-headline-lg text-[38px] text-on-surface font-extrabold">
                      {priceBiz}
                    </span>
                    <span className="font-headline-sm text-on-surface-variant">
                      FCFA /mois
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    Gestion collaborative, contrôle des droits et intégration
                    avec votre comptable.
                  </p>
                  <ul className="space-y-3.5 mb-8">
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Jusqu'à 10 collaborateurs & rôles avancés</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Rapports exportables pour expert-comptable</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Accès API & webhooks personnalisés</span>
                    </li>
                    <li className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        check_circle
                      </span>
                      <span>Gestionnaire de compte dédié via WhatsApp</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full text-center py-3.5 rounded-xl font-label-lg text-label-lg text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  Sélectionner Business
                </Link>
              </div>
            </div>
          </section>

          {/* ===== 7. FINAL CTA ===== */}
          <section className="py-12 lg:py-20">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-container via-primary to-secondary-container text-on-primary p-8 sm:p-14 lg:p-16 text-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(79,70,229,0.35)]">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-on-primary/10 text-on-primary font-label-sm text-label-sm mb-6 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    verified
                  </span>
                  Offre spéciale de lancement • 14 jours d'essai offerts
                </span>
                <h2 className="font-display-hero text-headline-lg-mobile sm:text-headline-lg text-on-primary font-extrabold tracking-tight mb-4">
                  Rejoins les entrepreneurs qui facturent comme des pros.
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary/85 max-w-xl mx-auto mb-9">
                  Commence gratuitement aujourd'hui sans aucun engagement. Crée
                  ta première facture conforme en moins de deux minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl font-label-lg text-label-lg text-primary bg-surface-container-lowest shadow-xl hover:bg-surface-container hover:scale-[1.02] transition-all font-bold"
                  >
                    <span>Créer ma première facture gratuite</span>
                    <span className="material-symbols-outlined text-[20px]">
                      bolt
                    </span>
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-on-primary/80 font-label-sm text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      credit_card_off
                    </span>
                    <span>Pas de carte requise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      verified_user
                    </span>
                    <span>Conforme fiscalement UEMOA / CEMAC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      support_agent
                    </span>
                    <span>Support WhatsApp réactif 7j/7</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 w-full bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_-1px_12px_rgba(0,0,0,0.03)] mt-space-xl">
        <div className="max-w-[1240px] mx-auto px-gutter py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-space-lg mb-space-xl">
            <div className="lg:col-span-2 flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    bolt
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  izi<span className="text-primary">Facture</span>
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                La solution de facturation et de suivi de trésorerie ultra-rapide
                conçue pour les entrepreneurs, indépendants et PME africaines en
                pleine expansion.
              </p>
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  public
                </span>
                <span>Fait avec fierté en Afrique 🌍</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface">
                Produit
              </p>
              <a href="#fonctionnalites" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Facturation électronique
              </a>
              <a href="#fonctionnalites" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Paiements Mobile Money
              </a>
              <a href="#tarifs" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Multi-devises (FCFA, EUR, USD)
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Gestion des devis
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface">
                Entreprise
              </p>
              <a href="#avantages" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                À propos d'iziFacture
              </a>
              <a href="#temoignages" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Témoignages clients
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Carrières
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Presse & Médias
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface">
                Ressources
              </p>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Centre d'aide
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Modèles de facture gratuits
              </a>
              <a href="#tarifs" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Documentation API
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Statut du service
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface">
                Légal & Sécurité
              </p>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Confidentialité
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Conformité fiscale
              </a>
              <a href="#comment-ca-marche" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Sécurité bancaire
              </a>
            </div>
          </div>
          <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm bg-surface-container-low/40 px-space-md py-space-sm rounded-xl">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2025 iziFacture Technologies SAS. Tous droits réservés.
            </p>
            <div className="flex items-center gap-space-md">
              <a
                aria-label="Support"
                className="text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  support_agent
                </span>
              </a>
              <a
                aria-label="Global Network"
                className="text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  language
                </span>
              </a>
              <a
                aria-label="Secured Cloud"
                className="text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}