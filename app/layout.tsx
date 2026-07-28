import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FrenchCasino V2 — Le Comparateur & Guide Casino N°1 en France (2026)",
  description: "Découvrez les meilleurs casinos en ligne fiables, bonus sans dépôt exclusifs, bonus de dépôt négociés et classement de sécurité 2026. Rejoignez aussi le programme affilié N°1.",
  keywords: [
    "bonus casino sans depot",
    "meilleur casino en ligne fiable",
    "classement casino 2026",
    "avis casino en ligne",
    "devenir affilie casino",
    "frenchcasino"
  ],
  authors: [{ name: "FrenchCasino Team" }],
  openGraph: {
    title: "FrenchCasino V2 — Comparateur Casino & Affiliation N°1",
    description: "Bonus sans dépôt, avis vérifiés et programme d'affiliation casino d'exception.",
    type: "website",
    locale: "fr_FR",
    siteName: "FrenchCasino",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary/40 selection:text-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f0f17',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f8f8f8',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            },
          }}
        />
      </body>
    </html>
  );
}
