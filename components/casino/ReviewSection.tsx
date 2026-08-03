'use client'

import React, { useState, useEffect } from 'react'
import { Star, MessageSquare, Send, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string
  rating: number
  comment: string
  user_name: string
  created_at: string
}

export default function ReviewSection({ casinoSlug }: { casinoSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casinoSlug])

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('casino_reviews')
      .select('*')
      .eq('casino_slug', casinoSlug)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (data) setReviews(data)
    setLoading(false)
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !userName.trim()) {
      setError("Veuillez remplir votre pseudo et votre commentaire.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          casinoSlug,
          rating,
          comment: comment.trim(),
          userName: userName.trim()
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission de l\'avis.')
      }

      setSuccess(true)
      setShowForm(false)
      fetchReviews() // Refresh reviews
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8 mt-8">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Avis des Joueurs
          </h2>
          <p className="text-sm text-slate-400 mt-1">Lisez les retours d'expérience vérifiés sur ce casino.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex flex-col items-end">
              <span className="text-3xl font-display font-extrabold text-white leading-none">{averageRating}</span>
              <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(Number(averageRating)) ? 'fill-amber-400' : 'fill-slate-800 text-slate-800'}`} />
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-1 block">{reviews.length} avis</span>
          </div>
          
          {!showForm && !success && (
            <button 
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-purple-600/20 text-purple-400 font-bold text-sm border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
            >
              Donner mon avis
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 text-center">
          <span className="text-emerald-400 font-bold block mb-1">Merci pour votre avis !</span>
          <span className="text-emerald-300/70 text-sm">Votre commentaire a été publié avec succès.</span>
        </div>
      )}

      {/* Formulaire d'avis */}
      {showForm && !success && (
        <form onSubmit={handleSubmit} className="bg-surface/50 border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500" />
          
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Partagez votre expérience</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-slate-500 hover:text-slate-300">Annuler</button>
          </div>

          {error && <div className="text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">{error}</div>}

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Votre Note</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-800 text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Votre Pseudo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Joueur123"
                    className="w-full bg-slate-900 border border-slate-700 text-sm rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                    maxLength={30}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Votre Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Racontez-nous brièvement comment se sont passés vos dépôts, vos sessions de jeux et surtout vos retraits sur ce casino..."
                className="w-full bg-slate-900 border border-slate-700 text-sm rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors min-h-[100px]"
                maxLength={500}
              />
              <div className="text-[10px] text-right text-slate-500 mt-1">{comment.length}/500 caractères</div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-8 text-sm text-slate-500 font-mono animate-pulse">Chargement des avis...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-slate-800 rounded-xl">
            <span className="text-3xl mb-2 block">💬</span>
            <p className="text-slate-400 text-sm">Soyez le premier à donner votre avis sur ce casino !</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-5 bg-surface/30 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/20 text-purple-300 font-bold text-xs uppercase">
                    {review.user_name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{review.user_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-800 text-slate-800'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
