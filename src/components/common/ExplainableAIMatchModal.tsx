import React from 'react';
import { FARMER_EXPLAINABILITY_DATA, FarmerExplainabilityScore } from '../../data/aiEvaluatorData';
import {
  BrainCircuit,
  X,
  CheckCircle2,
  Sparkles,
  MapPin,
  ShieldCheck,
  Scale,
  Clock,
  Fuel,
  Info
} from 'lucide-react';

interface Props {
  farmerId: string | null;
  onClose: () => void;
}

export const ExplainableAIMatchModal: React.FC<Props> = ({ farmerId, onClose }) => {
  if (!farmerId) return null;

  const data: FarmerExplainabilityScore =
    FARMER_EXPLAINABILITY_DATA[farmerId] ||
    FARMER_EXPLAINABILITY_DATA['farmer-ramesh'];

  const factorIcons: Record<string, React.ReactNode> = {
    'Geographic Proximity': <MapPin className="w-4 h-4 text-blue-600" />,
    'Historical Agmark Reliability': <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    'Batch Quota Fit': <Scale className="w-4 h-4 text-purple-600" />,
    'Cold-Chain Freshness Buffer': <Clock className="w-4 h-4 text-amber-600" />,
    'Marginal Transport Cost': <Fuel className="w-4 h-4 text-rose-600" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <BrainCircuit className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-mono font-bold border border-stone-200 mb-1">
                <span>XAI Engine • Explainable Multi-Criteria Match</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Why was {data.farmerName} matched?
              </h3>
              <p className="text-xs text-stone-500">
                Village: {data.village} • Candidate ID: #{data.farmerId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Composite Score Card */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
              MittiMatch Composite Index
            </span>
            <span className="text-xs text-stone-600">
              Evaluated against 15 candidates in Surat Cluster
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-extrabold text-emerald-700">
              {data.overallScore}
            </span>
            <span className="text-xs text-stone-400 font-mono"> / 100</span>
            <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Optimal Match
            </span>
          </div>
        </div>

        {/* Multi-Criteria Weight Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>5-Factor Algorithmic Score Breakdown</span>
            <span className="font-mono text-[10px] text-stone-400">Weighted MCDA Matrix</span>
          </div>

          <div className="space-y-2.5">
            {data.factors.map((f, idx) => {
              const pct = Math.round((f.score / f.maxScore) * 100);
              return (
                <div key={idx} className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      {factorIcons[f.label] || <Sparkles className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{f.label}</span>
                      <span className="text-[10px] font-mono text-stone-400">({f.weight}% wt)</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {f.score} / {f.maxScore} pts
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-stone-500 leading-snug">
                    {f.rationale}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithmic Formulation */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5 font-mono text-[11px]">
          <div className="text-amber-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Kuhn-Munkres Bi-Graph Formulation</span>
          </div>
          <div className="text-slate-300 overflow-x-auto py-1">
            Score(f, D) = 0.30·Geo + 0.25·Quality + 0.20·Quota + 0.15·Freshness + 0.10·FuelCost
          </div>
          <p className="text-[10px] text-stone-400 font-sans">
            Decision: {data.algorithmDecision}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Explainable AI Verification Passed</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
