'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function Verify2FAPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [statusMsg, setStatusMsg] = useState('Envoi du code en cours...')
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    // Demander l'envoi du code au montage du composant
    const sendCode = async () => {
      try {
        const res = await fetch('/api/admin/2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send' }),
        })
        const data = await res.json()
        if (data.success) {
          setIsSent(true)
          setStatusMsg('Un code à 4 chiffres a été envoyé sur votre Telegram.')
        } else {
          setErrorMsg(data.error || "Erreur lors de l'envoi du code.")
          setStatusMsg('')
        }
      } catch (err) {
        setErrorMsg('Erreur réseau.')
        setStatusMsg('')
      }
    }
    
    // Protection pour éviter l'envoi en double en React StrictMode
    if (!isSent) {
      sendCode()
    }
  }, [isSent])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 4) return
    
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code }),
      })
      const data = await res.json()
      
      if (data.success) {
        setStatusMsg('Vérification réussie ! Redirection...')
        window.location.href = '/admin'
      } else {
        setErrorMsg(data.error || 'Code incorrect')
        setLoading(false)
      }
    } catch (err) {
      setErrorMsg('Erreur réseau')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-primary/30 shadow-purple-glow text-center space-y-6 relative overflow-hidden">
        
        {/* Effet lumineux bg */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h1 className="font-display font-bold text-2xl text-white">Sécurité Admin</h1>
          <p className="text-slate-400 text-sm mt-2">{statusMsg}</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center">
            <input
              type="text"
              maxLength={4}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              disabled={!isSent || loading}
              className="w-32 bg-surface text-center border-2 border-slate-700 rounded-xl px-4 py-3 text-2xl tracking-[0.5em] text-white font-mono focus:outline-none focus:border-primary disabled:opacity-50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!isSent || loading || code.length !== 4}
            className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-purple-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Vérifier le Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        <button
          onClick={() => setIsSent(false)}
          disabled={!isSent || loading}
          className="text-xs text-slate-500 hover:text-white underline decoration-slate-700 transition-colors"
        >
          Renvoyer un nouveau code
        </button>

      </div>
    </div>
  )
}
