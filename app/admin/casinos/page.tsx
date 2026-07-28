import { getCasinos } from '@/lib/data/casinos'
import CasinosManager from './CasinosManager'

export const dynamic = 'force-dynamic';

export default async function AdminCasinosPage() {
  const casinos = await getCasinos()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            🎰 Gestionnaire de Casinos (CMS)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Modifiez le classement, les offres et les liens en temps réel.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-surface-border">
        <CasinosManager initialCasinos={casinos} />
      </div>
    </div>
  )
}
