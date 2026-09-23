import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Activity, ShieldCheck, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const MatchingEngineLog: React.FC = () => {
  const { matchingLogs } = useDemo();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Mitti2Market Matching Engine
            </h3>
            <p className="text-[10px] text-stone-500 font-mono">Live Algorithmic Event Stream</p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto max-h-[460px] space-y-2.5 pr-1 text-xs">
        {matchingLogs.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-xs">
            <Zap className="w-6 h-6 mx-auto mb-2 text-stone-300" />
            <div>Engine idle.</div>
            <div className="text-[11px] text-stone-400 mt-1">Post a demand to start scanning.</div>
          </div>
        ) : (
          matchingLogs.map((log) => {
            const categoryColors: Record<string, string> = {
              MATCH: 'bg-purple-50 text-purple-700 border-purple-200',
              POOL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              FARMER: 'bg-blue-50 text-blue-700 border-blue-200',
              STANDBY: 'bg-amber-50 text-amber-800 border-amber-300',
              ORDER: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              LOGISTICS: 'bg-orange-50 text-orange-700 border-orange-200',
              QC: 'bg-teal-50 text-teal-700 border-teal-200',
              ESCROW: 'bg-emerald-50 text-emerald-800 border-emerald-300'
            };

            return (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-stone-50/70 border border-stone-200 hover:bg-stone-50 transition flex flex-col gap-1 text-[11px] animate-in fade-in slide-in-from-top-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-1.5 py-0.2 rounded font-mono font-bold text-[9px] border ${
                      categoryColors[log.category] || 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {log.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{log.timeFormatted}</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed mt-0.5">
                  {log.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 text-[10px] text-stone-400 font-mono text-center">
        Surat Agro-Hub v2.4 • Demand-First Pipeline
      </div>
    </div>
  );
};
