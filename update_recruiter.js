const fs = require('fs');

const filePath = 'c:\\Users\\Gabin\\Desktop\\FrenchCasino\\app\\recruiter\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
content = content.replace(
  `const [activeTab, setActiveTab] = useState<'team' | 'stats' | 'earnings'>('team')`,
  `const [activeTab, setActiveTab] = useState<'team' | 'stats' | 'earnings' | 'payout'>('team')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d')
  const [payoutAmount, setPayoutAmount] = useState('200')
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [payoutsList, setPayoutsList] = useState<any[]>([])
  const [soldeDisponible, setSoldeDisponible] = useState(0)
  const [filteredClicksCount, setFilteredClicksCount] = useState(0)
  const [filteredCommsCount, setFilteredCommsCount] = useState(0)`
);

// 2. Fetch API data instead of direct DB
const fetchReplacement = `        if (affiliateIds.length > 0) {
          try {
            const res = await fetch('/api/recruiter/team-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ affiliateIds, recruiterId: user.id })
            })
            if (res.ok) {
              const data = await res.json()
              setTeamClicks(data.clicks || [])
              setTeamComms(data.commissions || [])
            }
          } catch (e) {
            console.error('Error fetching team data', e)
          }
        }`;

// Replace the old fetch logic
content = content.replace(
  /if \(affiliateIds\.length > 0\) \{[\s\S]*?setChartData\(formattedChartData\)\s*\}/m,
  fetchReplacement
);

// Add payout list fetch
content = content.replace(
  `      // Fetch recruiter commissions (15% details)`,
  `      // Fetch Payouts
      const { data: payouts } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('affiliate_id', user.id)
      if (payouts) setPayoutsList(payouts)

      // Fetch recruiter commissions (15% details)`
);

// 3. Add useEffect for dynamic filtering
const dynamicFilterCode = `  // Dynamic filter for stats & chart
  useEffect(() => {
    if (loading) return
    const now = new Date()
    let filteredC = teamClicks
    let filteredCo = teamComms

    if (timeRange === '7d') {
      const limit = new Date()
      limit.setDate(now.getDate() - 7)
      filteredC = teamClicks.filter(c => new Date(c.created_at) >= limit)
      filteredCo = teamComms.filter(c => new Date(c.created_at) >= limit)
    } else if (timeRange === '30d') {
      const limit = new Date()
      limit.setDate(now.getDate() - 30)
      filteredC = teamClicks.filter(c => new Date(c.created_at) >= limit)
      filteredCo = teamComms.filter(c => new Date(c.created_at) >= limit)
    }

    setFilteredClicksCount(filteredC.length)
    setFilteredCommsCount(filteredCo.filter(c => c.statut === 'validated' || c.statut === 'paid').length)

    const rangeDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 15
    const chart = []
    for (let i = rangeDays - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      const dayStart = new Date(date)
      dayStart.setHours(0,0,0,0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23,59,59,999)

      const dayClicks = teamClicks.filter(c => {
        const d = new Date(c.created_at)
        return d >= dayStart && d <= dayEnd
      }).length

      const dayComms = teamComms.filter(c => {
        const d = new Date(c.created_at)
        return d >= dayStart && d <= dayEnd && (c.statut === 'validated' || c.statut === 'paid')
      }).reduce((acc, curr) => acc + Number(curr.montant), 0)

      chart.push({
        day: dateStr,
        clics: dayClicks,
        commissions: dayComms
      })
    }
    setChartData(chart)

    // Calculate soldeDisponible
    let totalPaidOrPending = 0
    payoutsList.forEach(p => {
      if (p.statut !== 'rejected') {
        totalPaidOrPending += Number(p.montant_demande)
      }
    })
    setSoldeDisponible(Math.max(0, recruiterBalance - totalPaidOrPending))

  }, [timeRange, teamClicks, teamComms, payoutsList, recruiterBalance, loading])

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(payoutAmount)
    if (amount < 200) {
      toast.error('Le montant minimum de retrait est de 200 €.')
      return
    }
    if (amount > soldeDisponible) {
      toast.error('Fonds insuffisants.')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('payout_requests').insert([{
      affiliate_id: user.id,
      montant_demande: amount,
      statut: 'pending'
    }])

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payout_request',
          message: \`Demande de paiement Recruteur\nMontant : <b>\${amount} €</b>\nConnectez-vous pour valider le virement.\`
        })
      })
    } catch (err) {}

    setSoldeDisponible(prev => prev - amount)
    setPayoutSuccess(true)
    const { data: payouts } = await supabase.from('payout_requests').select('*').eq('affiliate_id', user.id)
    if (payouts) setPayoutsList(payouts)
    setTimeout(() => setPayoutSuccess(false), 4000)
  }
`;

content = content.replace(
  `  // Calculations for stats`,
  dynamicFilterCode + `\n  // Calculations for stats`
);

// 4. Update stats to use dynamic ones
content = content.replace(
  `  const totalClicksCount = teamClicks.length\n  const totalCommissionsCount = teamComms.filter(c => c.statut === 'validated' || c.statut === 'paid').length\n  const conversionRate = totalClicksCount > 0 ? ((totalCommissionsCount / totalClicksCount) * 100).toFixed(1) : '0'`,
  `  const conversionRate = filteredClicksCount > 0 ? ((filteredCommsCount / filteredClicksCount) * 100).toFixed(1) : '0'
  const currentDay = new Date().getDate()
  const isPayoutWindow = currentDay >= 15 && currentDay <= 20
  const canRequestPayout = isPayoutWindow && soldeDisponible >= 200`
);

content = content.replace(`{totalClicksCount}`, `{filteredClicksCount}`);
content = content.replace(`{totalCommissionsCount}`, `{filteredCommsCount}`);

// 5. Update tabs and mobile UX
content = content.replace(
  `<div className="flex items-center gap-2 border-b border-slate-800 pb-px">`,
  `<div className="flex items-center gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-hide snap-x">`
);

// Add the 4th tab
content = content.replace(
  `        <button
          onClick={() => setActiveTab('earnings')}
          className={\`px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 \${
            activeTab === 'earnings'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }\`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Historique des gains</span>
        </button>`,
  `        <button
          onClick={() => setActiveTab('earnings')}
          className={\`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start \${
            activeTab === 'earnings'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }\`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Historique des gains</span>
        </button>
        <button
          onClick={() => setActiveTab('payout')}
          className={\`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start \${
            activeTab === 'payout'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }\`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Paiements</span>
        </button>`
);

content = content.replace(/className={`px-4 py-2.5 font-bold/g, 'className={`whitespace-nowrap px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 snap-start ${');

// Add timeRange filter to stats
content = content.replace(
  `<h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" /> Performance de l'Équipe (7 derniers jours)
            </h3>`,
  `<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gold" /> Performance de l'Équipe
              </h3>
              <div className="flex bg-[#0f0f15] rounded-lg p-0.5 border border-slate-800 self-start sm:self-auto shrink-0">
                  {(['7d', '30d', 'all'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={\`px-3 py-1 rounded-md text-[11px] font-semibold transition-all \${
                        timeRange === range
                          ? 'bg-gold text-black shadow-gold-glow'
                          : 'text-slate-400 hover:text-white'
                      }\`}
                    >
                      {range === '7d' ? '7j' : range === '30d' ? '30j' : 'Tout'}
                    </button>
                  ))}
              </div>
            </div>`
);

// Add the payout tab content at the end of the file before final div
const payoutContent = `      {/* TAB CONTENT: PAYOUT */}
      {activeTab === 'payout' && (
        <div className="space-y-6">
          <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-gold/30 space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">Demande de Retrait (Recruteur)</h3>
              <p className="text-xs text-slate-400">Solde minimum requis : 200.00 € (Votre solde actuel : {soldeDisponible.toFixed(2)} €)</p>
            </div>

            {payoutSuccess && (
              <div className="p-4 rounded-xl bg-emerald/20 border border-emerald/40 text-emerald text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Demande de virement de {payoutAmount}€ soumise avec succès !</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Montant à retirer (€)</label>
                <input
                  type="number"
                  min="200"
                  max={soldeDisponible > 0 ? soldeDisponible : 200}
                  required
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Mode de Paiement</label>
                <select className="w-full bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold">
                  <option value="iban">Virement Bancaire (IBAN en ligne)</option>
                  <option value="crypto">USDT / Crypto Wallet</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!canRequestPayout}
                className={\`w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 \${
                  canRequestPayout 
                    ? 'text-black bg-gold hover:bg-gold-light shadow-gold-glow' 
                    : 'text-slate-400 bg-slate-800/80 cursor-not-allowed border border-slate-700'
                }\`}
              >
                {canRequestPayout ? 'Confirmer la Demande' : (soldeDisponible < 200 && isPayoutWindow) ? 'Solde insuffisant' : 'Paiements fermés'}
              </button>
              
              {!isPayoutWindow && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-2">
                  <p>Les soldes disponibles peuvent être retirés uniquement <strong>entre le 15 et le 20 du mois</strong>.</p>
                </div>
              )}
            </form>
          </div>

          <div className="max-w-xl mx-auto glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-display font-bold text-sm text-white">Vos Retraits</h4>
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[9px] uppercase">
                    <th className="pb-2">Date</th>
                    <th className="pb-2 text-right">Montant</th>
                    <th className="pb-2 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {payoutsList.length === 0 ? (
                    <tr><td colSpan={3} className="py-4 text-center text-slate-500">Aucun retrait.</td></tr>
                  ) : payoutsList.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 text-slate-300 font-mono">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5 text-right text-white font-mono font-semibold">{p.montant_demande} €</td>
                      <td className="py-2.5 text-center">
                        <span className={\`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase \${
                          p.statut === 'paid' ? 'bg-emerald/20 text-emerald' : 
                          p.statut === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                        }\`}>{p.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(`    </div>\n  )\n}\n`, payoutContent + `    </div>\n  )\n}\n`);

// Save
fs.writeFileSync(filePath, content);
console.log("Done updating recruiter dashboard");
