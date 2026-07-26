'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, ChevronDown, LayoutDashboard, Target, ShieldCheck } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Ne pas afficher le header du site public sur l'application Dashboard et Admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/recruiter')) {
    return null
  }

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Bonus sans dépôt', href: '/bonus-sans-depot', animated: true },
    { name: 'Bonus dépôt', href: '/bonus-depot' },
    { name: 'Top Casinos', href: '/top-casino' },
    { name: 'Actus & Guide', href: '/actus' },
    { name: 'Devenir Affilié', href: '/devenir-affilie', highlight: true },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-surface-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Minimaliste Sans Icone Machine à sous */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                French<span className="text-gradient-gold">Casino</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Guide & Comparateur 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — Épurée & Espacée */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-200 py-1.5 flex items-center gap-2 ${
                    active
                      ? 'text-white font-semibold'
                      : link.animated
                      ? 'text-purple-300 hover:text-white font-semibold'
                      : link.highlight
                      ? 'text-gold hover:text-gold-light'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {/* Puce Animée Lumineuse pour Bonus sans dépôt */}
                  {link.animated && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  )}

                  <span>{link.name}</span>

                  {/* Underline indicateur actif */}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-gold shadow-sm" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Menu Compte avec Dropdown */}
          <div className="hidden lg:flex items-center relative group">
            <button
              className="px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-700 hover:from-primary-hover hover:to-purple-800 shadow-purple-glow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Accéder à mon compte</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-surface-card border border-slate-800 rounded-xl shadow-xl w-52 overflow-hidden flex flex-col p-2">
                <Link href="/dashboard" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  Espace Affilié
                </Link>
                <Link href="/recruiter" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-2">
                  <Target className="w-4 h-4 text-gold" />
                  Espace Recruteur
                </Link>
                <Link href="/admin" className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  Espace Admin
                </Link>
              </div>
            </div>
          </div>

          {/* Bouton Hamburger Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-surface-card focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Menu Mobile Minimaliste */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-card border-b border-surface-border px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-primary/20 text-white font-semibold'
                  : link.animated
                  ? 'text-purple-300 font-semibold'
                  : 'text-slate-300 hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                {link.animated && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                )}
                <span>{link.name}</span>
              </div>
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">Accéder à mon compte</div>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/50"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              Espace Affilié
            </Link>
            <Link
              href="/recruiter"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/50"
            >
              <Target className="w-4 h-4 text-gold" />
              Espace Recruteur
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald" />
              Espace Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
