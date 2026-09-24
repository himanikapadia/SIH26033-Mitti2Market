import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { StatsCards } from './StatsCards';
import { AdminEventStream } from './AdminEventStream';
import { LeafletMap } from '../common/LeafletMap';
import {
  Layers,
  Repeat,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const {
    farmers,
    fleet,
    pickupStops,
    isMatchingActive,
    radarScanningLabel,
    poolContributors,
    activeDemand,
    farmerReject,
    restartDemo
  } = useDemo();

  const standbyFarmers = farmers.filter((f) => f.isStandby);
  const replacedContributors = poolContributors.filter((c) => c.isStandbyBackup);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Governance & Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mitti2Market Operations Command Tower
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Live telemetry of decentralized smallholder farmer pooling, real-time node state transitions, dynamic standby failover recovery, and cold-chain route execution.
          </p>
        </div>

        <button
          onClick={restartDemo}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer transition shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Grid State</span>
        </button>
      </div>

      {/* Admin KPI Summary Cards */}
      <StatsCards />

      {/* Command Center Map & Standby Failover Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Map: 8 Cols */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Regional Supply Network Map (Surat District)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time color-coded farmer nodes with animated state transitions
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-stone-500">Legend:</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Accepted
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-700">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> Rejected
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Standby
              </span>
            </div>
          </div>

          <LeafletMap
            farmers={farmers}
            fleet={fleet}
            pickupStops={pickupStops}
            isMatchingActive={isMatchingActive}
            radarScanningLabel={radarScanningLabel}
            height="460px"
            zoom={10}
          />
        </div>

        {/* Right: Standby Failover Panel & Quick Controls: 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Standby Failover Live Monitor */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Standby Replacement Engine</h4>
                <p className="text-[10px] text-stone-500 font-mono">Zero-Disruption Redundancy</p>
              </div>
            </div>

            {replacedContributors.length > 0 ? (
              <div className="space-y-3">
                {replacedContributors.map((rc, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 text-xs space-y-1.5 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-950">
                      <span>✓ Failover Successful</span>
                      <span className="font-mono text-emerald-800">+{rc.allocatedQty} kg</span>
                    </div>
                    <p className="text-amber-900 text-[11px] leading-relaxed">
                      Standby reserve <span className="font-extrabold">{rc.farmerName}</span> ({rc.village}) substituted immediately to absorb volume after primary farmer rejection.
                    </p>
                    {rc.rejectionReason && (
                      <div className="text-[10px] text-stone-500 italic pt-1 border-t border-amber-200">
                        Trigger reason: "{rc.rejectionReason}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{standbyFarmers.length} Standby Reserves Ready</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  When any matched farmer rejects or produce fails QC, standby reserves are automatically activated to keep the buyer pool 100% fulfilled.
                </p>
                <button
                  onClick={() => {
                    const firstPending = poolContributors.find((c) => c.status === 'Pending');
                    if (firstPending) {
                      farmerReject(firstPending.farmerId, 'Simulated equipment breakdown');
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Test Standby Failover Swap
                </button>
              </div>
            )}
          </div>

          {/* Real-time Event Stream */}
          <AdminEventStream />
        </div>
      </div>
    </div>
  );
};
