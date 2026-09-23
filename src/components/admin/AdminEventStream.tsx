import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Activity, Radio, ShieldCheck } from 'lucide-react';

export const AdminEventStream: React.FC = () => {
  const { matchingLogs } = useDemo();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">Real-Time Platform Event Stream</h4>
            <p className="text-[10px] text-stone-500 font-mono">Consolidated System Audit Trail</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          LIVE LOGGING
        </span>
      </div>

      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 text-xs">
        {matchingLogs.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            No system events recorded yet. Post a demand in Buyer Portal to view live telemetry.
          </div>
        ) : (
          matchingLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-stone-50/70 border border-stone-200 hover:bg-stone-50 transition flex items-start justify-between gap-3 text-[11px]"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[9px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 uppercase">
                    {log.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{log.timeFormatted}</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
