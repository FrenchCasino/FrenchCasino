import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCasinos } from '@/lib/data/casinos'
import { Star, ShieldCheck, Zap, Gift, ExternalLink, Check, Clock, FileText, ArrowLeft } from 'lucide-react'
import ReviewSection from '@/components/casino/ReviewSection'
import { FlagIcon } from '@/components/ui/FlagIcon'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'
import { ReviewSchema } from '@/components/schema/ReviewSchema'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props) {
  const casinos = await getCasinos()
  const casino = casinos.find(c => c.slug === params.slug)
  if (!casino) return { title: 'Casino non trouvé — FrenchCasino' }
  return {
    title: `Avis ${casino.name} (2026) : Test, Note & Bonus ${casino.bonusSansDepot || casino.bonusDepot}`,
    description: `Découvrez notre avis détaillé sur ${casino.name}. Licence ${casino.licence}, retraits en ${casino.delaiRetrait}, wager ${casino.wager} et bonus exclusifs.`,
    alternates: {
      canonical: `https://frenchcasino.net/casino/${params.slug}`,
    }
  }
}

export default async function CasinoDetailPage({ params }: Props) {
  const casinos = await getCasinos()
  const casino = casinos.find(c => c.slug === params.slug)

  if (!casino) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back Button */}
      <Link href="/top-casino" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au classement des casinos</span>
      </Link>

      {/* Header Fiche Casino */}
      <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-surface-border space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-900/50 to-slate-900 border border-slate-700 p-4 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-3xl">🎰</span>
              <span className="text-xs font-bold text-white mt-1">{casino.name.split(' ')[0]}</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-2">
                {casino.name}
                <div className="flex gap-1.5 items-center ml-2">
                  {casino.allowedCountries?.includes('FR') && <FlagIcon country="FR" />}
                  {casino.allowedCountries?.includes('BE') && <FlagIcon country="BE" />}
                  {casino.allowedCountries?.includes('LU') && <FlagIcon country="LU" />}
                </div>
              </h1>
              
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  <span>{casino.noteFiabilite.toFixed(1)} / 5.0</span>
                </div>
                <span className="text-slate-400">{casino.licence}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {casino.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-0.5 rounded bg-surface border border-slate-700 text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-2">
            <a
              href={casino.lienAffilie}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-purple-glow transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Obtenir le Bonus Mégapack</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-[11px] text-center text-slate-400">
              Incitations & bonus soumis aux T&C de l&apos;opérateur
            </span>
          </div>

        </div>

        {/* Mini Grid Offres */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
          <div className="bg-surface/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Bonus Sans Dépôt</span>
            <span className="text-sm font-bold text-gradient-purple block">
              {casino.bonusSansDepot || 'Aucun actuellement'}
            </span>
          </div>
          <div className="bg-surface/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Bonus de Dépôt</span>
            <span className="text-sm font-bold text-gradient-gold block">
              {casino.bonusDepot}
            </span>
          </div>
          <div className="bg-surface/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Délai & Wager</span>
            <span className="text-sm font-bold text-white block">
              {casino.delaiRetrait} | Wager {casino.wager}
            </span>
          </div>
        </div>
      </div>

      {/* Description & Points Forts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-xl text-white">
              Avis Rédactionnel sur {casino.name}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {casino.description}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Notre équipe d&apos;évaluation a testé l&apos;ensemble du parcours joueur sur {casino.name} : de l&apos;inscription jusqu&apos;à la demande de retrait des gains. Les résultats démontrent une grande fiabilité opérationnelle et un respect strict des conditions annoncées.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald" />
              Points Forts Vérifiés
            </h3>
            <ul className="space-y-2.5">
              {casino.pointsForts.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* SECTION AVIS DÉTAILLÉ (SEO) */}
      {casino.longReviewContent && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 relative mt-12 mb-12">
          <div 
            className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-slate-300 prose-li:my-2 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: casino.longReviewContent }}
          />
        </div>
      )}

      {/* Section des Avis Joueurs */}
      <ReviewSection casinoSlug={casino.slug} />

      {/* DONNÉES STRUCTURÉES DE REVUE CASINO JSON-LD */}
      <BreadcrumbSchema 
        items={[
          { name: "Accueil", url: "https://frenchcasino.net/" },
          { name: "Casinos", url: "https://frenchcasino.net/top-casino" },
          { name: casino.name, url: `https://frenchcasino.net/casino/${casino.slug}` }
        ]} 
      />
      <ReviewSchema casino={casino} />

    </div>
  )
}
