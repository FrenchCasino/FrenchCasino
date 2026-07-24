import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || 're_T4RsSBeR_9bdnhJ8cPnwys4L7ZNgcBxqj'
export const resend = new Resend(resendApiKey)

export const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'FrenchCasino <contact@frenchcasino.net>'

/**
 * Envoie un email de bienvenue à l'affilié après inscription
 */
export async function sendWelcomeAffiliateEmail({
  email,
  name,
}: {
  email: string
  name: string
}) {
  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [email],
      subject: '🎰 Bienvenue dans le Réseau d\'Affiliation FrenchCasino !',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #09090e; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <h2 style="color: #D4AF37;">Bonjour ${name},</h2>
          <p>Bienvenue sur <strong>FrenchCasino V2</strong>, le comparateur casino & réseau d'affiliation N°1 en France.</p>
          <p>Votre compte affilié a bien été enregistré avec un taux de commission initial de <strong>30% de RevShare</strong>.</p>
          <p style="margin-top: 20px;">Accédez dès maintenant à votre tableau de bord pour générer vos liens trackés :</p>
          <a href="https://frenchcasino.vercel.app/dashboard" style="display: inline-block; background-color: #7C3AED; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder au Dashboard Affilié →</a>
          <hr style="border: 0; border-top: 1px solid #2c2845; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">L'équipe FrenchCasino — contact@frenchcasino.net</p>
        </div>
      `,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue Resend:', error)
    return { success: false, error }
  }
}

/**
 * Notification de demande ou validation de paiement
 */
export async function sendPayoutNotificationEmail({
  email,
  name,
  amount,
  status,
}: {
  email: string
  name: string
  amount: number
  status: 'pending' | 'paid' | 'rejected'
}) {
  const statusLabel = status === 'paid' ? 'Validé & Payé' : status === 'pending' ? 'En cours de traitement' : 'Refusé'
  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [email],
      subject: `💰 Mise à jour de votre demande de retrait (${amount}€)`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #09090e; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <h2 style="color: #D4AF37;">Bonjour ${name},</h2>
          <p>Votre demande de retrait de commission d'un montant de <strong>${amount}.00 €</strong> est désormais au statut : <strong>${statusLabel}</strong>.</p>
          <p style="margin-top: 20px;">Retrouvez l'historique complet dans votre espace privé :</p>
          <a href="https://frenchcasino.vercel.app/dashboard" style="display: inline-block; background-color: #7C3AED; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Voir mes retraits →</a>
          <hr style="border: 0; border-top: 1px solid #2c2845; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">L'équipe Financière FrenchCasino</p>
        </div>
      `,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de virement Resend:', error)
    return { success: false, error }
  }
}
