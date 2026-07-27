'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, X, ChevronDown, LayoutDashboard, Target, 
  ShieldCheck, Crown, Gift, Trophy, Zap, Newspaper, 
  Sparkles, Flame, User, ArrowUpRight
} from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ne pas afficher le header du site public sur l'application Dashboard, Admin et Recruiter
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/recruiter')) {
    return null
  }

  const navLinks = [
    { name: 'Accueil', href: '/', icon: Crown },
    { name: 'Bonus sans dépôt', href: '/bonus-sans-depot', icon: Gift, badge: 'HOT', animated: true },
    { name: 'Bonus dépôt', href: '/bonus-depot', icon: Zap },
    { name: 'Top Casinos', href: '/top-casino', icon: Trophy, highlight: true },
    { name: 'Actus & Guide', href: '/actus', icon: Newspaper },
    { name: 'Devenir Affilié', href: '/devenir-affilie', icon: Sparkles, gold: true },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/85 backdrop-blur-2xl border-b border-purple-900/30 shadow-2xl shadow-purple-950/20 py-2' 
          : 'bg-slate-950/60 backdrop-blur-xl border-b border-white/5 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo - Premium Modern Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-purple-600 to-indigo-900 p-[1px] shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-gold transition-colors">
                  French<span className="text-gradient-gold">Casino</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-purple-900/50 text-purple-300 border border-purple-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Guide Officiel 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs sm:text-sm font-semibold transition-all duration-300 px-3.5 py-2 rounded-xl flex items-center gap-2 group ${
                    active
                      ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-white shadow-md border border-purple-500/40 font-bold'
                      : link.gold
                      ? 'text-gold hover:text-amber-200 hover:bg-gold/10'
                      : link.animated
                      ? 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    active ? 'text-gold' : link.gold ? 'text-gold' : 'text-slate-400 group-hover:text-purple-300'
                  }`} />

                  <span>{link.name}</span>

                  {/* Badge HOT */}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm flex items-center gap-0.5 animate-pulse">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Account Portal Dropdown Button */}
          <div className="hidden lg:flex items-center relative group">
            <button
              className="px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 shadow-lg shadow-purple-950/50 hover:shadow-purple-600/30 transition-all flex items-center gap-2.5 group-hover:border-gold/50"
            >
              <div className="w-6 h-6 rounded-full bg-slate-950/60 flex items-center justify-center border border-white/20">
                <User className="w-3.5 h-3.5 text-gold" />
              </div>
              <span>Mon Espace Pro</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-slate-950/95 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/80 w-60 overflow-hidden backdrop-blur-2xl p-2 space-y-1">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portail Partenaires</div>
                  <div className="text-xs font-semibold text-white">Connexion rapide</div>
                </div>

                <Link 
                  href="/dashboard" 
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-purple-900/40 rounded-xl transition-all flex items-center justify-between group/item"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-900/50 border border-purple-500/30 text-purple-300">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div>Espace Affilié</div>
                      <div className="text-[10px] text-slate-400 font-normal">Tableau de bord & Stats</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-gold transition-colors" />
                </Link>

                <Link 
                  href="/recruiter" 
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-amber-900/30 rounded-xl transition-all flex items-center justify-between group/item"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-900/40 border border-amber-500/30 text-gold">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <div>Espace Recruteur</div>
                      <div className="text-[10px] text-slate-400 font-normal">Gestion de réseau</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-gold transition-colors" />
                </Link>

                <Link 
                  href="/admin" 
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-900/30 rounded-xl transition-all flex items-center justify-between group/item"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div>Administration CMS</div>
                      <div className="text-[10px] text-slate-400 font-normal">Gestion des casinos</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-gold transition-colors" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:text-white hover:bg-purple-900/30 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-purple-900/40 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-white border border-purple-500/40'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-gold' : 'text-purple-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-red-600 to-amber-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">Accès Espaces Pro</div>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-sm font-medium text-slate-200"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Espace Affilié</span>
              </Link>
              <Link
                href="/recruiter"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-sm font-medium text-slate-200"
              >
                <Target className="w-4 h-4 text-gold" />
                <span>Espace Recruteur</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-sm font-medium text-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Espace Administration</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
