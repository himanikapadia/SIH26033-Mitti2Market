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

  const progressPercent = Math.min(100, Math.round((acceptedKg / targetKg) * 100));

  const handleJumpToFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setActiveTab('farmer');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Pool Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
              Demand-First Supply Aggregation
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>POOL STATUS:</span>
              <span className="font-mono text-emerald-700">
                {acceptedKg} of {targetKg} kg confirmed
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
              {progressPercent === 100 ? '100% POOL FILLED ✓' : `${progressPercent}% FULFILLED`}
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-stone-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-stone-500 font-mono">
          <span>0 kg (Initiated)</span>
          <span>Target: {targetKg} kg</span>
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
