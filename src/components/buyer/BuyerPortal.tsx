import React from 'react';
import { DemandBuilder } from './DemandBuilder';
import { PoolStatus } from './PoolStatus';
import { ConsolidatedInvoice } from './ConsolidatedInvoice';
import { MatchingEngineLog } from './MatchingEngineLog';
import { BuyerLiveTracking } from './BuyerLiveTracking';
import { TraditionalChainComparison } from '../common/TraditionalChainComparison';
import { useDemo } from '../../context/DemoContext';
import { LeafletMap } from '../common/LeafletMap';
import { AlertTriangle, Sparkles, TrendingDown, Layers, ShieldCheck, CheckCircle2, Clock, Lock, FileText, ArrowRight, Radar } from 'lucide-react';

export const BuyerPortal: React.FC = () => {
  const {
    farmers,
    fleet,
    pickupStops,
    isMatchingActive,
    radarScanningLabel,
    activeDemand,
    shortageEvent,
    poolContributors,
    consolidatedInvoice
  } = useDemo();

  const targetKg = activeDemand ? activeDemand.targetTotalKg : 1000;
  const acceptedKg = poolContributors
    .filter((c) => c.status === 'Accepted')
    .reduce((sum, c) => sum + c.allocatedQty, 0);
  const progressPercent = Math.min(100, Math.round((acceptedKg / targetKg) * 100));
  const remainingKg = Math.max(0, targetKg - acceptedKg);
  const acceptedCount = poolContributors.filter((c) => c.status === 'Accepted').length;
  const pendingCount = poolContributors.filter((c) => c.status === 'Pending').length;
  const rejectedCount = poolContributors.filter((c) => c.status === 'Rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Hero Executive Procurement Cockpit (Addressing 9 Evaluator Questions Instantly) */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-stone-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Demand-First Aggregation Engine • Buyer Procurement Cockpit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Buyer Procurement Portal
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Mitti2Market aggregates fragmented rural smallholders into unified, single-invoice bulk contracts—eliminating 5 tiers of APMC intermediaries and guaranteeing Agmark cold-chain quality.
            </p>
          </div>

          {/* 3. Live Simulated Market Price Ticker */}
          <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-700 text-xs space-y-1.5 shrink-0 min-w-[270px] shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">APMC Mandi Benchmark</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE MANDI FEED
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-mono font-extrabold text-white">
                ₹24.50<span className="text-xs font-normal text-stone-400">/kg</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                M2M Pooled: ₹22.00/kg
              </span>
            </div>
            <div className="text-[10px] text-emerald-300 font-semibold pt-1 border-t border-stone-800 flex justify-between">
              <span>Direct Buyer Savings:</span>
              <span className="font-bold font-mono text-emerald-400">₹2.50/kg (10.2% Net)</span>
            </div>
          </div>
        </div>

        {/* 9-Point Evaluator Instant HUD Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* 1. Demand Contract */}
          <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">1. Active Demand</span>
            <div className="font-bold text-white truncate">{activeDemand ? activeDemand.buyerName : 'Nature Fresh Ltd'}</div>
            <div className="text-[10px] font-mono text-emerald-400 font-semibold">{activeDemand ? activeDemand.id : '#MM1024'} • Early Morning</div>
          </div>

          {/* 2 & 4. Crop & Quantity Required */}
          <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">2 &amp; 4. Crop &amp; Qty</span>
            <div className="font-bold text-white truncate">
              {activeDemand ? activeDemand.crops.map((c) => c.cropName).join(', ') : 'Tomato (Grade A)'}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">{targetKg} kg Required</div>
          </div>

          {/* 5. Supply Pooled Progress */}
          <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">5. Supply Pooled</span>
            <div className="font-bold text-white font-mono">{acceptedKg} / {targetKg} kg</div>
            <div className="text-[10px] font-bold text-emerald-400">{progressPercent}% Confirmed ({poolContributors.length} Farms)</div>
          </div>

          {/* 6. Farmer Consent Status */}
          <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">6. Farmer Responses</span>
            <div className="font-bold text-white font-mono">
              <span className="text-emerald-400">{acceptedCount} ✓</span> • <span className="text-amber-400">{pendingCount} ⏳</span> • <span className="text-rose-400">{rejectedCount} ✕</span>
            </div>
            <div className="text-[10px] text-stone-400">
              {rejectedCount > 0 ? 'Standby detoured' : pendingCount > 0 ? 'Awaiting consent' : '100% accepted'}
            </div>
          </div>

          {/* 9. When will invoice appear? */}
          <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">9. Invoice Status</span>
            <div className="font-bold text-amber-300 truncate">
              {consolidatedInvoice ? '✓ Unlocked & Ready' : `🔒 Locked (${progressPercent}%)`}
            </div>
            <div className="text-[10px] text-stone-400 font-mono">
              {consolidatedInvoice ? '70% Escrow Hold' : `Unlocks at 100% pool`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Main Area + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Area: 8 Columns */}
        <div className="lg:col-span-8 space-y-8">
          {/* Demand Creation Builder */}
          <DemandBuilder />

          {/* Interactive Map (Shows scanning radar when demand posted) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Radar className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Surat Agro-Cluster Supply Network &amp; Radar Matching</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time geographic distribution of 15 registered smallholder lots within 15 km cluster
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  15 Farmers Registered
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  15 km Geofence
                </span>
              </div>
            </div>

            <LeafletMap
              farmers={farmers}
              fleet={fleet}
              pickupStops={pickupStops}
              isMatchingActive={isMatchingActive}
              radarScanningLabel={radarScanningLabel}
              height="380px"
              zoom={10}
            />
          </div>

          {/* Shortage Re-Route Notice Banner */}
          {shortageEvent && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400 p-5 rounded-3xl shadow-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce shrink-0" />
                <span>Live Supply Shortage Notice: Farm-Gate Shortfall Detour Scheduled</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                A shortfall of <strong>{shortageEvent.shortfallKg} kg</strong> occurred at Stop 1 (<strong>{shortageEvent.originalFarmerName}</strong>, {shortageEvent.village} — promised {shortageEvent.promisedQty} kg, verified {shortageEvent.actualWeight} kg).
                To safeguard your <strong>1,000 kg order quantity</strong>, the logistics truck has been dynamically re-routed to collect the remaining <strong>{shortageEvent.shortfallKg} kg</strong> from standby farmer <strong>{shortageEvent.standbyFarmerName} ({shortageEvent.standbyVillage})</strong>.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 w-fit">
                <span>✓ Consolidated invoice below updated with actual verified weights. Total 1,000 kg order quantity remains 100% fulfilled!</span>
              </div>
            </div>
          )}

          {/* Pool Status & Farmer Pool Table */}
          <PoolStatus />

          {/* Consolidated Invoice & Escrow Lock */}
          <ConsolidatedInvoice />

          {/* Live Delivery Tracking (Amazon-style, active once pickup starts) */}
          <BuyerLiveTracking />

          {/* Educational Comparison Panel */}
          <TraditionalChainComparison />
        </div>

        {/* Right Sidebar: 4 Columns (Matching Engine Log Stream) */}
        <div className="lg:col-span-4">
          <MatchingEngineLog />
        </div>
      </div>
    </div>
  );
};
