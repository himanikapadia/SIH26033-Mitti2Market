import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sprout,
  Truck,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
  PhoneCall,
  Smartphone,
  Sparkles,
  Award
} from 'lucide-react';

export const EvaluatorQuickGuide: React.FC = () => {
  const { setActiveTab } = useDemo();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 space-y-4 animate-in fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Hackathon Screening Dossier
              </span>
              <span className="text-[10px] text-stone-400 font-mono hidden md:inline">
                Evaluator Guided Flow
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
              Evaluator Quick-Start Guide (How to Test Mitti2Market)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer text-xs"
            title={isExpanded ? 'Collapse Guide' : 'Expand Guide'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1 text-xs">
          {/* 4-Step Interactive Navigation Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1: Buyer Demand & AI */}
            <div
              onClick={() => setActiveTab('buyer')}
              className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 hover:border-emerald-500/60 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  1. Buyer Portal
                </span>
                <ShoppingBag className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400 transition" />
              </div>
              <div className="font-extrabold text-white text-xs">
                AI Forecast &amp; Demand
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                View 7-day predicted spot prices, click <em>"Apply AI Forecast"</em>, and watch the radar scan 15 rural farmers on the Leaflet map.
              </p>
            </div>

            {/* Step 2: Farmer Inclusion & Digital Divide */}
            <div
              onClick={() => setActiveTab('farmer')}
              className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 hover:border-emerald-500/60 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  2. Farmer Module
                </span>
                <Sprout className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition" />
              </div>
              <div className="font-extrabold text-white text-xs">
                Smartphone vs Keypad
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                <strong>Why 2 phones?</strong> Bridges India's digital divide! Test smartphone app alerts (Ramesh) AND basic keypad IVR voice calls (Mahesh).
              </p>
            </div>

            {/* Step 3: Logistics & Computer Vision */}
            <div
              onClick={() => setActiveTab('logistics')}
              className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 hover:border-emerald-500/60 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                  3. Logistics &amp; QC
                </span>
                <Truck className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-400 transition" />
              </div>
              <div className="font-extrabold text-white text-xs">
                CVRP Route &amp; YOLOv8 QC
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Watch the truck move stop-by-stop (-37% mileage). Inspect the live camera with YOLOv8 bounding boxes and Agmark digital seal.
              </p>
            </div>

            {/* Step 4: Escrow Settlement */}
            <div
              onClick={() => setActiveTab('buyer')}
              className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 hover:border-emerald-500/60 transition cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                  4. Escrow Payout
                </span>
                <Award className="w-3.5 h-3.5 text-stone-400 group-hover:text-purple-400 transition" />
              </div>
              <div className="font-extrabold text-white text-xs">
                Instant UPI &amp; SMS Credit
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Buyer confirms doorstep delivery; final 30% escrow releases with instant bank credit banners and keypad SMS notifications!
              </p>
            </div>
          </div>

          {/* Quick Evaluator Tips Bar */}
          <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 text-stone-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Jury Note:</strong> Click <strong>[🧠 AI Architecture]</strong> in the top header anytime to inspect all 4 AI engines, mathematical formulas, and the live Tensor Playground.
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-stone-400 font-mono text-[10px]">
              <span>✓ Zero English IVR</span>
              <span>•</span>
              <span>✓ Offline TFLite Edge</span>
              <span>•</span>
              <span>✓ 21/21 Steps Passing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
