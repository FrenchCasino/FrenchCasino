import React from 'react'

interface PageHeroProps {
  badgeIcon?: React.ReactNode
  badgeText?: string
  title: React.ReactNode
  description: React.ReactNode
  children?: React.ReactNode
}

export function PageHero({
  badgeIcon,
  badgeText,
  title,
  description,
  children
}: PageHeroProps) {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-hero border-b border-surface-border/50 w-full mb-12">
      
      {/* Glow Spheres en fond */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-gold/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card/80 border border-gold/30 text-gold text-xs font-semibold tracking-wider uppercase shadow-gold-glow animate-pulse-glow">
              {badgeIcon}
              <span>{badgeText}</span>
            </div>
          )}

          {/* Titre Impactant H1 */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          {/* Paragraphe d'accroche */}
          <div className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal space-y-4">
            {description}
          </div>

          {/* Additional Content (like lists, buttons, etc) */}
          {children && (
            <div className="pt-6">
              {children}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
