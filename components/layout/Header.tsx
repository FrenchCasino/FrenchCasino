'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, X, ChevronDown, LayoutDashboard, Target, 
  ShieldCheck, Crown, User, ArrowUpRight
} from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/recruiter')) {
    return null
  }

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Bonus sans dépôt', href: '/bonus-sans-depot', badge: true },
    { name: 'Bonus dépôt', href: '/bonus-depot' },
    { name: 'Top Casinos', href: '/top-casino' },
    { name: 'Actus & Guide', href: '/actus' },
    { name: 'Devenir Affilié', href: '/devenir-affilie', gold: true },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled 
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg py-2' 
          : 'bg-slate-950/40 backdrop-blur-md border-b border-white/5 py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          
          {/* Logo Minimaliste & Épuré */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="French Casino Partners" className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation — Épurée, Fine, Sans Gros Blocs */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs sm:text-sm font-medium transition-colors py-1 flex items-center gap-1.5 group ${
                    active
                      ? 'text-gold font-semibold'
                      : link.gold
                      ? 'text-amber-400 hover:text-gold font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {/* Puce Lumineuse discrète pour Bonus sans dépôt */}
                  {link.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                  )}

                  <span>{link.name}</span>

                  {/* Soulignement actif ultra fin */}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-amber-300 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bouton Mon Espace Pro — Slim Pill Design */}
          <div className="hidden lg:flex items-center relative group">
            <button
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-purple-950/60 border border-purple-500/30 hover:border-purple-400/60 transition-all flex items-center gap-2 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Mon Espace Pro</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform shrink-0" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl w-52 overflow-hidden backdrop-blur-xl p-1.5 space-y-1">
                <Link 
                  href="/dashboard" 
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Espace Affilié</span>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                </Link>

                <Link 
                  href="/recruiter" 
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-amber-900/20 rounded-lg transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>Espace Recruteur</span>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                </Link>

                <Link 
                  href="/admin" 
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-emerald-900/20 rounded-lg transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Espace Admin</span>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    active
                      ? 'bg-purple-900/30 text-gold border border-purple-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider px-3">Espaces Pro</div>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Espace Affilié</span>
            </Link>
            <Link
              href="/recruiter"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900"
            >
              <Target className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Espace Recruteur</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Espace Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
