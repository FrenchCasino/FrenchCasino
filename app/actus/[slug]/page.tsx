import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Newspaper } from 'lucide-react'

import { PageHero } from '@/components/ui/PageHero'
import { ARTICLES_DB } from '@/lib/articles'

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = ARTICLES_DB.find((a) => a.slug === params.slug)
  if (!article) return { title: 'Article non trouvé' }

  return {
    title: `${article.title} - FrenchCasino`,
    description: article.excerpt,
  }
}

export function generateStaticParams() {
  return ARTICLES_DB.map((article) => ({
    slug: article.slug,
  }))
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES_DB.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      <PageHero
        badgeIcon={<Newspaper className="w-4 h-4 text-gold" />}
        badgeText={article.category}
        title={
          <span className="text-3xl sm:text-4xl md:text-5xl leading-tight">
            {article.title}
          </span>
        }
        description={
          <div className="flex items-center justify-center gap-4 text-sm text-slate-300 mt-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold" />
              {article.readTime}
            </span>
          </div>
        }
      />

      <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <Link href="/actus" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 relative">
          <div 
            className="prose prose-invert prose-purple max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-white prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-slate-300 prose-li:my-2 prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
    </>
  )
}
