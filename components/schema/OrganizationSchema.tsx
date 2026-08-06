import React from 'react'

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FrenchCasino",
          "url": "https://frenchcasino.net",
          "logo": "https://frenchcasino.net/icon.png",
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61565406086749"
          ]
        })
      }}
    />
  )
}
