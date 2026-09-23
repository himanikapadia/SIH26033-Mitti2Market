import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, Clock, XCircle, AlertCircle, ArrowUpRight, Users, Sparkles } from 'lucide-react';

export const PoolStatus: React.FC = () => {
  const {
    activeDemand,
    poolContributors,
    farmerAccept,
    setActiveTab,
    setSelectedFarmerId
  } = useDemo();

  if (!activeDemand && poolContributors.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-8 text-center text-stone-400 text-xs">
        <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
        <h4 className="font-bold text-slate-700 text-sm">No Active Demand Pool</h4>
        <p className="mt-1">Post a new demand above or click "Run Full Demo" to see demand-first pooling in action.</p>
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
  const remainingKg = Math.max(0, targetKg - acceptedKg);

  const handleJumpToFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setActiveTab('farmer');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-stone-400">Target Demand</span>
          <div className="text-base font-extrabold text-slate-900 font-mono">{targetKg} kg</div>
          <div className="text-[10px] text-stone-500">{activeDemand?.crops[0]?.cropName || 'Tomato'} (Grade A)</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800">Confirmed Supply</span>
          <div className="text-base font-extrabold text-emerald-900 font-mono flex items-center justify-between">
            <span>{acceptedKg} kg</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-200/80 px-1.5 py-0.2 rounded-full">{progressPercent}%</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">Locked in Escrow Run</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-amber-800">Pending Consent</span>
          <div className="text-base font-extrabold text-amber-900 font-mono">{remainingKg} kg</div>
          <div className="text-[10px] text-amber-700 font-medium">
            {remainingKg === 0 ? '✓ 100% Confirmed' : 'Awaiting farmer response'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-blue-800">Pooling Ratio</span>
          <div className="text-base font-extrabold text-blue-900 font-mono">
            {poolContributors.length} Farms ➔ 1 Truck
          </div>
          <div className="text-[10px] text-blue-700 font-medium">Fractional Lot Aggregation</div>
        </div>
      </div>

      {/* Visually Satisfying Segmented Progress Bar */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
              Live Supply Aggregation Progress
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>POOL FULFILLMENT:</span>
              <span className="font-mono text-emerald-700">
                {acceptedKg} of {targetKg} kg ({progressPercent}%)
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs ${
                progressPercent === 100
                  ? 'bg-emerald-600 text-white border-emerald-700 animate-in zoom-in-95'
                  : progressPercent > 0
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-300'
              }`}
            >
              {progressPercent === 100 ? '✓ 100% POOL CONFIRMED' : `${progressPercent}% FULFILLED • ${remainingKg} KG NEEDED`}
            </span>
          </div>
        </div>

        {/* Multi-Farmer Segmented Bar */}
        <div className="w-full bg-stone-200 h-6 rounded-2xl overflow-hidden p-1 border border-stone-300 flex gap-1 relative shadow-inner">
          {poolContributors.map((c, i) => {
            const segmentWidth = Math.max(12, Math.round((c.allocatedQty / targetKg) * 100));
            const isAccepted = c.status === 'Accepted';
            const isPending = c.status === 'Pending';
            const isRejected = c.status === 'Rejected';

            return (
              <div
                key={c.farmerId + i}
                style={{ width: `${segmentWidth}%` }}
                className={`h-full rounded-xl transition-all duration-700 ease-out flex items-center justify-center text-[10px] font-extrabold font-mono text-white relative overflow-hidden group cursor-pointer ${
                  isAccepted
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-xs'
                    : isPending
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 animate-pulse border border-amber-300'
                    : isRejected
                    ? 'bg-rose-500/80 line-through text-rose-100'
                    : 'bg-purple-600 text-white'
                }`}
                title={`${c.farmerName} (${c.village}): ${c.allocatedQty} kg • Status: ${c.status}`}
                onClick={() => handleJumpToFarmer(c.farmerId)}
              >
                {/* Shimmer on accepted */}
                {isAccepted && (
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-150%] animate-shimmer pointer-events-none"></div>
                )}
                <span className="truncate px-1 drop-shadow-xs">
                  {c.farmerName.split(' ')[0]} ({c.allocatedQty}kg)
                </span>
              </div>
            );
          })}
        </div>

        {/* Farmer Status Chips below the bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {poolContributors.map((c) => {
            const isAccepted = c.status === 'Accepted';
            const isPending = c.status === 'Pending';
            const isRejected = c.status === 'Rejected';

            return (
              <div
                key={'chip-' + c.farmerId}
                onClick={() => handleJumpToFarmer(c.farmerId)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer hover:shadow-xs ${
                  isAccepted
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : isPending
                    ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/30'
                    : isRejected
                    ? 'bg-rose-50 text-rose-800 border-rose-300 line-through'
                    : 'bg-purple-50 text-purple-900 border-purple-300'
                }`}
              >
                {isAccepted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {isPending && <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
                {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                <span>{c.farmerName}</span>
                <span className="font-mono text-[10px] text-stone-500">({c.allocatedQty} kg)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farmer Pool Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Farmer Pool Table ({poolContributors.length} Smallholders Aggregated)
          </h4>
          <span className="text-[11px] text-stone-400">
            Click farmer to simulate their phone response
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
                  <tr key={idx} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{c.farmerName}</span>
                        {c.isStandbyBackup && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                            Standby Backup
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        {c.phoneType} • {c.preferredLanguage}
                      </div>
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
                          <button
                            onClick={() => farmerAccept(c.farmerId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer shadow-xs transition"
                            title="Accept this farmer's contribution"
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
                          <span>Simulate</span>
                          <ArrowUpRight className="w-3 h-3" />
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
    </div>
  );
};
