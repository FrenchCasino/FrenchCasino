import React from 'react'
import { Casino } from '@/lib/data/casinos'

interface ItemListSchemaProps {
  casinos: Casino[]
  name?: string
  description?: string
  url?: string
}

export function ItemListSchema({ 
  casinos, 
  name = "Classement des Casinos en Ligne les Plus Fiables",
  description = "Liste des meilleurs casinos en ligne en France.",
  url = "https://frenchcasino.net/top-casino"
}: ItemListSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": name,
          "description": description,
          "url": url,
          "itemListElement": casinos.map((casino, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "SoftwareApplication",
              "name": casino.name,
              "url": `https://frenchcasino.net/casino/${casino.slug}`
            }
          }))
        })
      }}
    />
  )
}
