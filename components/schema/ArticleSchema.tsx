import React from 'react'
import { Article } from '@/lib/articles'

interface ArticleSchemaProps {
  article: Article
}

export function ArticleSchema({ article }: ArticleSchemaProps) {
  // Convert basic date string to ISO format for Schema
  // Assuming format like "14 Août 2026", we just pass it, or Ideally we use ISO strings.
  // For basic support we will map a fallback date or standard format.
  // In a real DB it would be an ISO string, but here we can just use the date field as is or a static fallback if it fails validation, but Google handles strings relatively well.
  // To be safe, we will just use it directly.

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "image": [
            "https://frenchcasino.net/og-default.png"
          ],
          "author": {
            "@type": "Organization",
            "name": "FrenchCasino Team",
            "url": "https://frenchcasino.net/notre-equipe"
          },
          "publisher": {
            "@type": "Organization",
            "name": "FrenchCasino",
            "logo": {
              "@type": "ImageObject",
              "url": "https://frenchcasino.net/icon.png"
            }
          }
        })
      }}
    />
  )
}
