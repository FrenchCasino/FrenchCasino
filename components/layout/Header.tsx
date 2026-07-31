'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, X, ChevronDown, LayoutDashboard, Target, 
  ShieldCheck, Crown, User, ArrowUpRight, Sparkles,
  Gift, Trophy, Newspaper, Users, Gem
} from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [proDropdown, setProDropdown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setProDropdown(false)
  }, [pathname])

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/recruiter')) {
    return null
  }

  const navLinks = [
    { name: 'Accueil', href: '/', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { name: 'Bonus sans dépôt', href: '/bonus-sans-depot', icon: <Gift className="w-3.5 h-3.5" />, badge: true },
    { name: 'Bonus dépôt', href: '/bonus-depot', icon: <Gem className="w-3.5 h-3.5" /> },
    { name: 'Top Casinos', href: '/top-casino', icon: <Trophy className="w-3.5 h-3.5" /> },
    { name: 'Actus & Guide', href: '/actus', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { name: 'Devenir Affilié', href: '/devenir-affilie', icon: <Users className="w-3.5 h-3.5" />, gold: true },
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled 
            ? 'header-scrolled' 
            : 'header-top'
        }`}
      >
        {/* Gold accent line at the very top */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo — Premium Casino Style */}
            <Link href="/" className="flex items-center gap-2.5 group relative">
              {/* Subtle glow behind logo on hover */}
              <div className="absolute -inset-3 bg-gold/0 group-hover:bg-gold/5 rounded-2xl transition-all duration-500 blur-xl" />
              
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-gold/30 group-hover:border-gold/60 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Crown className="w-4 h-4 text-gold group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <span className="relative font-display font-extrabold text-lg sm:text-xl tracking-tight">
                <span className="text-white group-hover:text-slate-100 transition-colors">French</span>
                <span className="text-gradient-gold">Casino</span>
              </span>
            </Link>

            {/* Desktop Navigation — Premium Pill Style */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                {navLinks.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 flex items-center gap-2 group whitespace-nowrap ${
                        active
                          ? 'text-gold bg-gold/[0.08] shadow-[inset_0_1px_0_rgba(212,175,55,0.15)]'
                          : link.gold
                          ? 'text-amber-400/90 hover:text-gold hover:bg-gold/[0.05]'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Nav icon */}
                      <span className={`transition-colors duration-300 ${
                        active ? 'text-gold' : link.gold ? 'text-amber-500/70' : 'text-slate-500 group-hover:text-slate-300'
                      }`}>
                        {link.icon}
                      </span>

                      <span>{link.name}</span>

                      {/* Live pulse dot for Bonus sans dépôt */}
                      {link.badge && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                        </span>
                      )}

                      {/* Active indicator bar */}
                      {active && (
                        <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Desktop — CTA Mon Espace Pro */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setProDropdown(!proDropdown)}
                  onBlur={() => setTimeout(() => setProDropdown(false), 200)}
                  className="group relative px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 flex items-center gap-2
                    text-white bg-gradient-to-r from-purple-600/80 to-purple-800/80 
                    border border-purple-500/40 hover:border-purple-400/70
                    shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)]
                    hover:from-purple-600 hover:to-purple-700"
                >
                  <User className="w-3.5 h-3.5 text-purple-200" />
                  <span>Mon Espace</span>
                  <ChevronDown className={`w-3 h-3 text-purple-300 transition-transform duration-300 ${proDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <div className={`absolute right-0 top-full mt-2 transition-all duration-300 z-50 ${
                  proDropdown 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <div className="w-56 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-purple-900/20">
                    {/* Glass background */}
                    <div className="bg-[#0d0c18]/95 backdrop-blur-2xl p-2 space-y-0.5">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                        Espaces Pro
                      </div>

                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-purple-500/10 transition-all group"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:border-purple-400/40 transition-colors">
                          <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div>Espace Affilié</div>
                          <div className="text-[10px] text-slate-500 font-normal">Stats & commissions</div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
                      </Link>

                      <Link 
                        href="/recruiter" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-amber-500/10 transition-all group"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-400/40 transition-colors">
                          <Target className="w-3.5 h-3.5 text-gold" />
                        </div>
                        <div className="flex-1">
                          <div>Espace Recruteur</div>
                          <div className="text-[10px] text-slate-500 font-normal">Gérer votre équipe</div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-gold transition-colors" />
                      </Link>

                      <Link 
                        href="/admin" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-emerald-500/10 transition-all group"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-400/40 transition-colors">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div>Espace Admin</div>
                          <div className="text-[10px] text-slate-500 font-normal">Panneau de contrôle</div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger — Animated */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Toggle Navigation"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className={`absolute w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                }`} />
                <span className={`absolute w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                }`} />
                <span className={`absolute w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                }`} />
              </div>
            </button>

          </div>
        </div>

        {/* Bottom gold accent */}
        <div className={`h-[1px] w-full transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-30'}`}>
          <div className="h-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>
      </header>

      {/* Mobile Menu — Full Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-in panel */}
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm transition-transform duration-500 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-full bg-[#0a0914]/98 backdrop-blur-2xl border-l border-white/[0.06] flex flex-col">
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-gold/30">
                  <Crown className="w-4 h-4 text-gold" />
                </div>
                <span className="font-display font-extrabold text-lg">
                  <span className="text-white">French</span>
                  <span className="text-gradient-gold">Casino</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
              {navLinks.map((link, i) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-gold/[0.08] text-gold border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.05)]'
                        : link.gold 
                        ? 'text-amber-400/80 hover:text-gold hover:bg-gold/[0.04]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className={`${active ? 'text-gold' : link.gold ? 'text-amber-500/60' : 'text-slate-600'}`}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="relative flex h-2 w-2 ml-auto">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Pro Spaces */}
            <div className="border-t border-white/[0.06] px-4 py-5 space-y-2">
              <div className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">
                Espaces Pro
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-purple-500/10 transition-all"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div>Espace Affilié</div>
                  <div className="text-[10px] text-slate-600 font-normal">Stats & commissions</div>
                </div>
              </Link>

              <Link
                href="/recruiter"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-amber-500/10 transition-all"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Target className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div>Espace Recruteur</div>
                  <div className="text-[10px] text-slate-600 font-normal">Gérer votre équipe</div>
                </div>
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-emerald-500/10 transition-all"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div>Espace Admin</div>
                  <div className="text-[10px] text-slate-600 font-normal">Panneau de contrôle</div>
                </div>
              </Link>
            </div>

            {/* Mobile Footer Branding */}
            <div className="px-5 py-4 border-t border-white/[0.04]">
              <div className="text-[10px] text-slate-600 text-center">
                © 2026 FrenchCasino · Le guide casino N°1 en France
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
