import React from 'react';
import { ArrowDown, CheckCircle2, TrendingDown, Layers, ShieldCheck, Zap } from 'lucide-react';

export const TraditionalChainComparison: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Where the Traditional Chain Loses Value</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Reduces unnecessary intermediary layers by digitally connecting fragmented farmer supply with consolidated buyer demand.
          </p>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Direct Agri Logistics Innovation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Fragmented Chain */}
        <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Traditional Fragmented Supply Chain
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
              5 Intermediate Layers
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-stone-700">
            {[
              { role: 'Small Farmer', sub: 'Fragmented harvest sold under distress' },
              { role: 'Village Level Local Trader', sub: 'Takes 8-12% commission cut' },
              { role: 'APMC Mandi Commission Agent / Wholesaler', sub: 'Weighing cuts, delayed cash chits' },
              { role: 'Regional Distributor', sub: 'Cold-chain gaps, produce handling loss' },
              { role: 'Local Retailer / Sub-Dealer', sub: 'High retail markup (up to 35%)' },
              { role: 'End Buyer / Institution', sub: 'High acquisition cost & quality variance' }
            ].map((node, i, arr) => (
              <React.Fragment key={i}>
                <div className="p-2 rounded-xl bg-white border border-rose-100 shadow-2xs flex items-center justify-between">
                  <span className="font-bold text-slate-900">{node.role}</span>
                  <span className="text-[11px] text-rose-700 font-medium">{node.sub}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex justify-center text-rose-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-rose-100/70 text-rose-900 text-[11px] font-medium leading-relaxed">
            ⚠️ <strong>Impact:</strong> Farmers receive only ~30–40% of consumer rupee; high post-harvest transit losses.
          </div>
        </div>

        {/* Mitti2Market Demand-First Pooling */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Mitti2Market Demand-First Pooling
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
              Optimized Single Hop
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-stone-700">
            {[
              {
                role: 'Multiple Smallholder Farmers (300kg + 200kg + 500kg)',
                sub: 'Direct participation via Smartphone & Keypad IVR'
              },
              {
                role: 'Mitti2Market Algorithmic Demand Pooling Engine',
                sub: 'Automated clustering, failover standby & fair transparent rate'
              },
              {
                role: 'Consolidated Single-Run Logistics (₹1/kg)',
                sub: 'Perishable 4:00 AM freshness routing paid by buyer'
              },
              {
                role: 'Verified Institutional Buyer (1000 kg Full Fill)',
                sub: 'Guaranteed milestone escrow lock & Agmark QC at farm gate'
              }
            ].map((node, i, arr) => (
              <React.Fragment key={i}>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-between">
                  <div className="font-bold text-slate-900">{node.role}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{node.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex justify-center text-emerald-600">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-950 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Key Innovations Demonstrated:</span>
            </div>
            <ul className="text-[11px] text-emerald-900 list-disc list-inside space-y-0.5">
              <li>Bulk demand reaches smallholders directly without intermediary opacity.</li>
              <li>Consolidated logistics replaces repeated fragmented transport.</li>
              <li>Escrow milestone disbursement protects both small farmer and institutional buyer.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
