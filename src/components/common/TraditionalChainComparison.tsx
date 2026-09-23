import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';

export const TraditionalChainComparison: React.FC = () => {
  const comparisonMetrics = [
    {
      metric: 'Farmer Revenue Share',
      traditional: '30% – 40% of Rupee',
      traditionalNote: 'Distress sales to local traders',
      m2m: '80% – 85% of Rupee',
      m2mNote: 'Direct farm-gate credit',
      impact: '+45% Return'
    },
    {
      metric: 'Intermediary Layers',
      traditional: '4 – 5 Middlemen',
      traditionalNote: 'Trader ➔ Agent ➔ Wholesaler ➔ Retailer',
      m2m: '0 Middlemen',
      m2mNote: 'Algorithmic demand pooling',
      impact: 'Direct Access'
    },
    {
      metric: 'Payment Settlement',
      traditional: '15 – 45 Days Delay',
      traditionalNote: 'Paper chits & commission cuts',
      m2m: 'Instant Escrow',
      m2mNote: '70% Farm-Gate + 30% Doorstep UPI',
      impact: 'Same-Day Cash'
    },
    {
      metric: 'Post-Harvest Loss',
      traditional: '18% – 25% Spoilage',
      traditionalNote: 'Open ambient trucks, multiple handling',
      m2m: '< 2% Spoilage',
      m2mNote: '4:00 AM Reefer cold-chain run',
      impact: 'Cold Freshness'
    },
    {
      metric: 'Logistics Freight',
      traditional: '₹3.5 – ₹5.0 / kg',
      traditionalNote: 'Farmer bears transport to Mandi',
      m2m: '₹1.0 / kg Flat',
      m2mNote: 'Consolidated run, paid by BUYER',
      impact: 'Farmer Pays ₹0'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Where Traditional Chain Loses Value
            </h3>
            <p className="text-[10px] text-stone-500 font-mono">Traditional Mandi vs Mitti2Market</p>
          </div>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
          Direct Pooling
        </span>
      </div>

      {/* Sorted Metric Comparison Rows */}
      <div className="space-y-2.5">
        {comparisonMetrics.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-stone-300 transition text-xs space-y-2"
          >
            {/* Metric Header & Impact Tag */}
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs">
                {idx + 1}. {item.metric}
              </span>
              <span className="font-mono text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                {item.impact}
              </span>
            </div>

            {/* Side-by-Side Values */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Traditional (Rose) */}
              <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-200/70">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-rose-800">
                  <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Traditional</span>
                </div>
                <div className="font-extrabold text-rose-950 font-mono mt-0.5 text-xs">
                  {item.traditional}
                </div>
                <div className="text-[10px] text-rose-700/80 truncate mt-0.5">
                  {item.traditionalNote}
                </div>
              </div>

              {/* Mitti2Market (Emerald) */}
              <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-300">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Mitti2Market</span>
                </div>
                <div className="font-extrabold text-emerald-950 font-mono mt-0.5 text-xs">
                  {item.m2m}
                </div>
                <div className="text-[10px] text-emerald-700/90 truncate mt-0.5">
                  {item.m2mNote}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Callout */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 text-[11px] text-emerald-950 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Demand-first clustering unlocks full 1,000 kg supply with 0% middleman commission leakages.</span>
      </div>
    </div>
  );
};
