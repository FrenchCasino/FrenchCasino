'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Sparkles,
  User,
  Gift,
  Zap,
  Award,
  Newspaper,
  TrendingUp,
  ArrowRight,
  Home,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Bonus sans dépôt', href: '/bonus-sans-depot', icon: Gift, badge: 'OFFERT' },
    { name: 'Bonus dépôt', href: '/bonus-depot', icon: Zap },
    { name: 'Top Casinos', href: '/top-casino', icon: Award },
    { name: 'Actus & Guide', href: '/actus', icon: Newspaper },
    { name: 'Devenir Affilié', href: '/devenir-affilie', icon: TrendingUp, highlight: true },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 py-3 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Floating Capsule Glassmorphism Header */}
        <div className="relative rounded-2xl bg-surface-card/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] px-4 sm:px-6 py-3.5 transition-all">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-purple-700 to-indigo-900 border border-primary-light/40 flex items-center justify-center shadow-purple-glow group-hover:scale-105 transition-all duration-300">
                <span className="text-2xl filter drop-shadow">🎰</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold border-2 border-surface animate-ping" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold border-2 border-surface" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  French<span className="text-gradient-gold">Casino</span>
                  <span className="text-[10px] uppercase font-mono font-bold text-gold bg-gold/10 border border-gold/30 px-1.5 py-0.5 rounded-full shadow-sm">
                    V2
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Comparateur & Affiliation N°1
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-surface/60 p-1.5 rounded-xl border border-slate-800/80">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      active
                        ? 'text-white bg-gradient-to-r from-primary/40 to-purple-600/40 border border-primary/50 shadow-purple-glow'
                        : link.highlight
                        ? 'text-gold hover:text-white bg-gold/10 hover:bg-gold/20 border border-gold/30'
                        : 'text-slate-300 hover:text-white hover:bg-surface-card/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${
                      active ? 'text-primary-light' : link.highlight ? 'text-gold' : 'text-slate-400'
                    }`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[9px] bg-gradient-to-r from-purple-500 to-primary text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider shadow-sm ml-0.5">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* CTA & Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/connexion"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface/50 hover:bg-surface-card border border-slate-800 hover:border-slate-700 transition-all"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Connexion</span>
              </Link>

              <Link
                href="/dashboard"
                className="group relative px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-purple-glow hover:shadow-xl transition-all transform hover:-translate-y-0.5 overflow-hidden flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Espace Affilié</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-surface/80 text-slate-300 hover:text-white hover:bg-surface-card border border-slate-800 transition-colors"
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Drawer Menu Mobile Ultra Modern */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2">
          <div className="rounded-2xl bg-surface-card/95 backdrop-blur-2xl border border-white/10 p-5 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-primary/20 text-white border border-primary/40'
                        : link.highlight
                        ? 'bg-gold/10 text-gold border border-gold/30'
                        : 'text-slate-300 hover:bg-surface/80 border border-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${active ? 'bg-primary/30 text-white' : 'bg-surface/80 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{link.name}</span>
                    </div>

                    {link.badge ? (
                      <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                        {link.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl border border-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider bg-surface/60"
              >
                Connexion Affilié
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-purple-glow"
              >
                Accéder au Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
