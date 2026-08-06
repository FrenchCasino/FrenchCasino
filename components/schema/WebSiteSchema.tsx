import React from 'react'

export function WebSiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "FrenchCasino",
          "url": "https://frenchcasino.net",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://frenchcasino.net/top-casino?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })
      }}
    />
  )
}
