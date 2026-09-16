import React from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  ArrowRight,
  Zap,
  ShieldCheck,
  Smartphone,
  Globe,
  BarChart3,
  Clock,
  FileText,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">IziFacture</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link href="#features" className="hover:text-indigo-600 transition-colors">Fonctionnalités</Link>
              <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">Comment ça marche</Link>
              <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Tarifs</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Connexion
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide uppercase border border-indigo-100 animate-bounce">
            🚀 Lancement officiel en Afrique
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Facturez vos clients <br />
            <span className="text-indigo-600">en un éclair.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
            L'outil de facturation conçu spécifiquement pour les entrepreneurs africains.
            Simple, rapide et adapté au FCFA. Gagnez du temps et soyez payé plus vite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 group"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Voir la démo
            </Link>
          </div>
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afbe65ae8364?auto=format&fit=crop&q=80&w=2426"
                alt="IziFacture Dashboard Preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">
            Ils nous font déjà confiance
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {['Samba Services', 'Afrique Tech', 'Koffi Consulting', 'Moussa Logistics'].map(company => (
              <span key={company} className="text-2xl font-bold text-gray-600">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Plus besoin de fichiers Excel complexes ou de papier. IziFacture centralise tout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-indigo-600" />,
                title: "Création Rapide",
                description: "Générez une facture professionnelle en moins de 2 minutes avec des lignes dynamiques."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
                title: "Conformité Locale",
                description: "Calcul automatique de la TVA à 18% et formatage natif en FCFA."
              },
              {
                icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
                title: "Accès Mobile",
                description: "Gérez vos clients et envoyez vos factures directement depuis votre smartphone."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
                title: "Suivi des Paiements",
                description: "Sachez instantanément qui a payé et qui est en retard grâce au dashboard."
              },
              {
                icon: <Globe className="w-6 h-6 text-indigo-600" />,
                title: "Cloud Sécurisé",
                description: "Vos données sont sauvegardées et cryptées. Accédez-y de n'importe où."
              },
              {
                icon: <Clock className="w-6 h-6 text-indigo-600" />,
                title: "Gain de Temps",
                description: "Automatisez vos tâches répétitives et concentrez-vous sur votre croissance."
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-white border border-gray-100 rounded-3xl hover:border-indigo-200 transition-all hover:shadow-lg group">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-indigo-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500 skew-x-12 translate-x-20 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto">Trois étapes simples pour reprendre le contrôle de votre trésorerie.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Configurez", desc: "Remplissez les détails de votre entreprise et importez vos clients." },
              { step: "02", title: "Facturez", desc: "Créez vos factures en quelques clics avec calcul automatique de la TVA." },
              { step: "03", title: "Encaissez", desc: "Suivez les paiements et relancez vos clients en un clic." },
            ].map((item, idx) => (
              <div key={idx} className="relative space-y-4 text-center">
                <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-indigo-100 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Une tarification simple</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Commencez gratuitement, passez au Pro quand votre business décolle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 bg-white border border-gray-200 rounded-3xl space-y-6 hover:border-indigo-300 transition-all">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Starter</h3>
              <p className="text-sm text-gray-500">Pour les freelances et micro-entreprises</p>
            </div>
            <div className="text-4xl font-black text-gray-900">Gratuit <span className="text-lg font-medium text-gray-400">/ mois</span></div>
            <ul className="space-y-4">
              {['5 factures par mois', 'Gestion de 10 clients', 'Export PDF basique', 'Support communautaire'].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 text-center rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Commencer maintenant
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="p-8 bg-white border-2 border-indigo-600 rounded-3xl space-y-6 relative shadow-xl shadow-indigo-100">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Recommandé
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <p className="text-sm text-gray-500">Pour les entreprises en croissance</p>
            </div>
            <div className="text-4xl font-black text-gray-900">4.900 FCFA <span className="text-lg font-medium text-gray-400">/ mois</span></div>
            <ul className="space-y-4">
              {['Factures illimitées', 'Clients illimités', 'Export PDF personnalisé', 'Support prioritaire', 'Statistiques avancées'].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-indigo-500" />
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 text-center rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Passer au Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Questions fréquentes</h2>
            <p className="text-gray-500">Tout ce que vous devez savoir sur IziFacture</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "Est-ce vraiment gratuit ?", a: "Oui, le plan Starter est 100% gratuit pour toujours. Vous ne payez que si vous avez besoin de fonctionnalités avancées." },
              { q: "Puis-je personnaliser mes factures ?", a: "Oui, dans le plan Pro, vous pouvez ajouter votre logo et personnaliser les couleurs de vos documents." },
              { q: "Mes données sont-elles sécurisées ?", a: "Absolument. Nous utilisons Supabase avec un cryptage SSL et des politiques de sécurité strictes (RLS)." },
              { q: "Comment fonctionne la TVA ?", a: "IziFacture applique par défaut la TVA de 18%, mais vous pouvez la modifier dans vos paramètres entreprise." },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-gray-900">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">I</span>
            </div>
            <span className="text-lg font-bold text-gray-900">IziFacture</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/login" className="hover:text-indigo-600 transition-colors">Connexion</Link>
            <Link href="/signup" className="hover:text-indigo-600 transition-colors">Inscription</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</Link>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 IziFacture. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
