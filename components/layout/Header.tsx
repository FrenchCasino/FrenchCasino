'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles, User, ShieldCheck, Gift, Award, Newspaper, ArrowRight } from 'lucide-react'

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
    <header className="sticky top-0 z-50 glass-panel border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-900 border border-primary-light/30 flex items-center justify-center shadow-purple-glow group-hover:scale-105 transition-transform">
              <span className="text-xl">🎰</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1">
                French<span className="text-gradient-gold">Casino</span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-primary-light bg-primary/20 border border-primary/30 px-1.5 py-0.2 rounded ml-1">
                  V2
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Le comparateur casino N°1 en France
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-white bg-primary/20 border border-primary/40 shadow-sm'
                      : link.highlight
                      ? 'text-gold hover:text-gold-light bg-gold/10 hover:bg-gold/20 border border-gold/30'
                      : 'text-slate-300 hover:text-white hover:bg-surface-card/60'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-gradient-to-r from-purple-600 to-primary text-white px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Action CTA & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/connexion"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-card border border-transparent hover:border-slate-700 transition-all"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Connexion</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-purple-800 shadow-purple-glow hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Espace Affilié</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-card focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-surface-border p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-primary/20 text-white border border-primary/40'
                  : 'text-slate-300 hover:bg-surface-card'
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
          <div className="pt-4 border-t border-surface-border flex flex-col gap-2">
            <Link
              href="/connexion"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200 font-medium text-sm"
            >
              Connexion Affilié
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-purple-glow"
            >
              Accéder au Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
