import React from 'react'
import { Casino } from '@/lib/data/casinos'

interface ReviewSchemaProps {
  casino: Casino
}

export function ReviewSchema({ casino }: ReviewSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "Product"],
          "name": casino.name,
          "applicationCategory": "GameApplication",
          "operatingSystem": "All",
          "image": casino.logoUrl,
          "description": casino.description,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": casino.noteFiabilite.toFixed(1),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "1",
            "reviewCount": "1"
          },
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": casino.noteFiabilite.toFixed(1),
              "bestRating": "5",
              "worstRating": "1"
            },
            "author": {
              "@type": "Organization",
              "name": "FrenchCasino Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "FrenchCasino",
              "url": "https://frenchcasino.net"
            },
            "reviewBody": `Revue et test expert du casino ${casino.name}. Licence ${casino.licence}, support client et conditions de retrait analysés.`
          }
        })
      }}
    />
  )
}
