import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, Clock, XCircle, AlertCircle, ArrowUpRight, Users, Sparkles, BrainCircuit } from 'lucide-react';
import { ExplainableAIMatchModal } from '../common/ExplainableAIMatchModal';

export const PoolStatus: React.FC = () => {
  const [inspectingFarmerId, setInspectingFarmerId] = useState<string | null>(null);
  const {
    activeDemand,
    poolContributors,
    farmerAccept,
    farmerReject,
    setActiveTab,
    setSelectedFarmerId
  } = useDemo();

  if (!activeDemand && poolContributors.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-8 text-center text-stone-400 text-xs">
        <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
        <h4 className="font-bold text-slate-700 text-sm">No Active Demand Pool</h4>
        <p className="mt-1">Post a new demand above to see demand-first pooling in action.</p>
      </div>
    );
  }

  const targetKg = activeDemand ? activeDemand.targetTotalKg : 1000;
  const acceptedKg = poolContributors
    .filter((c) => c.status === 'Accepted')
    .reduce((sum, c) => sum + c.allocatedQty, 0);

  const pendingKg = poolContributors
    .filter((c) => c.status === 'Pending')
    .reduce((sum, c) => sum + c.allocatedQty, 0);

  const progressPercent = Math.min(100, Math.round((acceptedKg / targetKg) * 100));

  const handleJumpToFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setActiveTab('farmer');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Target Demand
          </div>
          <div className="text-lg font-mono font-extrabold text-slate-900 mt-0.5">
            {targetKg.toLocaleString('en-IN')} kg
          </div>
          <div className="text-[10px] text-stone-500 font-medium">100% Consolidated</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Confirmed Supply
          </div>
          <div className="text-lg font-mono font-extrabold text-emerald-800 mt-0.5">
            {acceptedKg.toLocaleString('en-IN')} kg
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">{progressPercent}% of target</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
            Pending Consent
          </div>
          <div className="text-lg font-mono font-extrabold text-amber-800 mt-0.5">
            {pendingKg.toLocaleString('en-IN')} kg
          </div>
          <div className="text-[10px] text-amber-700 font-medium">Awaiting SMS/IVR</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
            Pooling Impact
          </div>
          <div className="text-lg font-mono font-extrabold text-purple-800 mt-0.5">
            {poolContributors.length} Farms ➔ 1 Truck
          </div>
          <div className="text-[10px] text-purple-700 font-medium">Zero Intermediaries</div>
        </div>
      </div>

      {/* Visually Satisfying Segmented Progress Bar */}
      <div className="space-y-3 p-4 rounded-2xl bg-stone-50/80 border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              Demand-First Supply Aggregation
            </span>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Pool Progress:</span>
              <span className="font-mono text-emerald-700">
                {acceptedKg} / {targetKg} kg confirmed
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                progressPercent === 100
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : progressPercent > 0
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-300'
              }`}
            >
              {progressPercent === 100 ? '100% POOL FILLED ✓ READY FOR INVOICE' : `${progressPercent}% FULFILLED`}
            </span>
          </div>
        </div>

        {/* Multi-Segmented Progress Bar */}
        <div className="w-full bg-stone-200 h-6 rounded-full overflow-hidden p-0.5 border border-stone-300 relative shadow-inner flex">
          {poolContributors
            .filter((c) => c.status !== 'Rejected')
            .map((c, i) => {
              const widthPct = Math.max(2, (c.allocatedQty / targetKg) * 100);
              let bgClass = 'bg-stone-300';
              if (c.status === 'Accepted') bgClass = 'bg-gradient-to-r from-emerald-500 to-emerald-600';
              else if (c.status === 'Pending') bgClass = 'bg-amber-400 animate-pulse';
              else if (c.status === 'Standby') bgClass = 'bg-purple-500';

              return (
                <div
                  key={i}
                  style={{ width: `${widthPct}%` }}
                  title={`${c.farmerName}: ${c.allocatedQty} kg (${c.status})`}
                  className={`h-full ${bgClass} border-r border-white/40 first:rounded-l-full last:rounded-r-full transition-all duration-500 relative group overflow-hidden flex items-center justify-center text-[10px] font-bold text-white shadow-2xs`}
                >
                  {/* Shimmer sweep over confirmed segments */}
                  {c.status === 'Accepted' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  )}
                  {widthPct >= 12 && (
                    <span className="truncate px-1 drop-shadow-xs">{c.allocatedQty}kg</span>
                  )}
                </div>
              );
            })}
        </div>

        {/* Farmer Quota Breakdown Chips below bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-stone-400 font-semibold text-[10px] uppercase">Farmer Shares:</span>
          {poolContributors.map((c, i) => {
            const badgeColors = {
              Accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
              Pending: 'bg-amber-100 text-amber-800 border-amber-300 font-medium',
              Rejected: 'bg-rose-100 text-rose-800 border-rose-300 line-through',
              'Counter Offer': 'bg-blue-100 text-blue-800 border-blue-300',
              Standby: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
              Replaced: 'bg-stone-100 text-stone-500 border-stone-200 line-through',
              'Quality Failed': 'bg-rose-100 text-rose-900 border-rose-300'
            };

            return (
              <span
                key={i}
                className={`px-2 py-0.5 rounded-lg border text-[10px] flex items-center gap-1 ${
                  badgeColors[c.status] || 'bg-stone-100 text-stone-700'
                }`}
              >
                <span>{c.farmerName.split(' ')[0]} ({c.allocatedQty} kg)</span>
                {c.status === 'Accepted' && <span>✓</span>}
                {c.status === 'Pending' && <span>⏳</span>}
                {c.status === 'Rejected' && <span>✕ (Rejected)</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Dynamic Standby Re-Allocation Alert */}
      {poolContributors.some((c) => c.status === 'Rejected') && (
        <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3 text-xs text-rose-900 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-rose-950">Dynamic Standby Re-Allocation Active:</span>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              A farmer declined or terminated the offer call. Mitti2Market's Knapsack pooling engine automatically engaged a pre-screened standby backup farmer from the adjacent village cluster to maintain 100% fulfillment.
            </p>
          </div>
        </div>
      )}

      {/* Farmer Pool Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Farmer Pool Table ({poolContributors.length} Smallholders Aggregated)
          </h4>
          <span className="text-[11px] text-stone-400">
            Accept or reject farmer consent directly or simulate phone
          </span>
        </div>

        <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
              <tr>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-3">Village</th>
                <th className="py-3 px-3">Crop</th>
                <th className="py-3 px-3 text-right">Available Qty</th>
                <th className="py-3 px-3 text-right">Offered Rate</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-slate-800">
              {poolContributors.map((c, idx) => {
                const statusBadges = {
                  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse',
                  Accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  Rejected: 'bg-rose-100 text-rose-800 border-rose-300',
                  'Counter Offer': 'bg-blue-100 text-blue-800 border-blue-300',
                  Standby: 'bg-purple-100 text-purple-800 border-purple-300',
                  Replaced: 'bg-stone-200 text-stone-700 border-stone-300',
                  'Quality Failed': 'bg-rose-200 text-rose-900 border-rose-400'
                };

                return (
                  <tr key={idx} className={`transition ${c.status === 'Rejected' ? 'bg-rose-50/40' : 'hover:bg-stone-50/80'}`}>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className={c.status === 'Rejected' ? 'line-through text-stone-400 font-normal' : ''}>
                          {c.farmerName}
                        </span>
                        {c.isStandbyBackup && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                            Standby Backup
                          </span>
                        )}
                        {c.status === 'Rejected' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            Declined
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        {c.phoneType} • {c.preferredLanguage}
                      </div>
                      {c.status === 'Rejected' && (
                        <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                          <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{c.rejectionReason || 'Call cut / Declined by farmer'}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-stone-600 font-medium">{c.village}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-medium">
                        {c.crop}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {c.allocatedQty} kg
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">
                      ₹{c.offeredRate}/kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          statusBadges[c.status] || 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {c.status === 'Accepted' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {c.status === 'Pending' && <Clock className="w-3 h-3 text-yellow-600" />}
                        {c.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>{c.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => farmerAccept(c.farmerId)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer shadow-xs transition"
                              title="Accept this farmer's contribution"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => farmerReject(c.farmerId, 'Price / volume mismatch')}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-[10px] cursor-pointer shadow-xs transition"
                              title="Reject to trigger standby farmer replacement"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        {c.status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                            Replaced by Standby
                          </span>
                        )}
                        {c.status === 'Standby' && (
                          <button
                            onClick={() => farmerAccept(c.farmerId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] cursor-pointer shadow-xs transition"
                            title="Accept standby farmer into pool"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleJumpToFarmer(c.farmerId)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-[10px] font-semibold cursor-pointer transition"
                          title="Simulate this farmer's device in Farmer Module"
                        >
                          <span>Phone</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>

                        {/* Explainable AI Match Score Button */}
                        <button
                          onClick={() => setInspectingFarmerId(c.farmerId)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold cursor-pointer transition shadow-2xs"
                          title="Explain why the AI algorithm matched this farmer"
                        >
                          <BrainCircuit className="w-3 h-3 text-emerald-700" />
                          <span>AI Score</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable AI Decision Breakdown Modal */}
      <ExplainableAIMatchModal
        farmerId={inspectingFarmerId}
        onClose={() => setInspectingFarmerId(null)}
      />
    </div>
  );
};

