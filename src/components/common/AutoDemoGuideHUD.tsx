import React from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  Sparkles,
  X,
  FastForward,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Users
} from 'lucide-react';

export const AutoDemoGuideHUD: React.FC = () => {
  const {
    isAutoDemoRunning,
    currentAutoDemoStep,
    stopAutoDemo,
    demoSpeed,
    setDemoSpeed
  } = useDemo();

  if (!isAutoDemoRunning || !currentAutoDemoStep) return null;

  const { stepIndex, totalSteps, title, explanation, targetTab } = currentAutoDemoStep;
  const progressPct = Math.round((stepIndex / totalSteps) * 100);

  const tabLabels: Record<string, string> = {
    buyer: 'Buyer Procurement Portal',
    farmer: 'Farmer Device Simulator',
    logistics: 'Logistics & Farm-Gate QC',
    admin: 'Admin Console & Escrow'
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950/95 text-white backdrop-blur-xl rounded-3xl p-5 shadow-2xl border-2 border-emerald-500/60 space-y-3 shadow-emerald-950/50">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
              Live Auto-Guided Demo Tour
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Step {stepIndex} of {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-[10px] font-bold font-mono">
              <span className="text-stone-400 mr-0.5">Speed:</span>
              {(['Normal', 'Fast', 'Instant'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setDemoSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded-lg transition cursor-pointer ${
                    demoSpeed === spd
                      ? 'bg-emerald-600 text-white'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>

            {/* Stop Demo Button */}
            <button
              onClick={stopAutoDemo}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 transition cursor-pointer border border-slate-700"
              title="Stop Auto Demo Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Title & Explanation */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              {tabLabels[targetTab] || targetTab}
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
              {title}
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>

        {/* 12-Step Progress Meter */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
            <span>Progress: {progressPct}% Complete</span>
            <span>Running slowly so evaluators can observe each step</span>
          </div>

          <div className="grid grid-cols-12 gap-1 h-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx + 1 < stepIndex
                    ? 'bg-emerald-500'
                    : idx + 1 === stepIndex
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
