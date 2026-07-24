'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Bonus sans dépôt', href: '/bonus-sans-depot', badge: 'Populaire' },
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
          
          {/* Logo Minimaliste Élégan */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl filter drop-shadow">🎰</span>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
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
                  className={`relative text-sm font-medium transition-all duration-200 py-1.5 flex items-center gap-1.5 ${
                    active
                      ? 'text-white font-semibold'
                      : link.highlight
                      ? 'text-gold hover:text-gold-light'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>

                  {/* Underline indicateur actif */}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-gold shadow-sm" />
                  )}

                  {link.badge && (
                    <span className="text-[9px] bg-primary/20 border border-primary/40 text-primary-light px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Seul Bouton CTA Principal */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary to-purple-700 hover:from-primary-hover hover:to-purple-800 shadow-purple-glow hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Espace Affilié</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
                  : 'text-slate-300 hover:bg-surface'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-purple-glow"
            >
              Accéder à l&apos;Espace Affilié
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
