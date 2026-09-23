import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { MOCK_ROUTE_OPTIMIZATION } from '../../data/aiIntelligenceData';
import {
  Navigation,
  Cpu,
  TrendingDown,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  Leaf
} from 'lucide-react';

export const AIRouteOptimization: React.FC = () => {
  const { pickupStops, fleet, addToast } = useDemo();
  const [selectedRouteMode, setSelectedRouteMode] = useState<'optimized' | 'unoptimized'>('optimized');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const opt = MOCK_ROUTE_OPTIMIZATION;

  const handleRerunOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setSelectedRouteMode('optimized');
      addToast('⚡ AI Routing Engine: Re-calculated optimal Clarke-Wright savings matrix for Surat cluster!', 'success');
    }, 700);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-semibold mb-2 border border-amber-500/25">
            <Cpu className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>AI Multi-Stop Vehicle Routing Problem (CVRP)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>AI Cold-Chain Route Optimizer</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              -37% Mileage • -51% Transit Time
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Solves multi-farm collection routing using Clarke-Wright savings heuristics with perishable thermal decay time-window penalties. Minimizes road mileage and prevents heat respiration spoilage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRerunOptimization}
            disabled={isOptimizing}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : 'Re-Run AI Router'}</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 px-2.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition cursor-pointer"
          >
            {isExpanded ? 'Collapse ▲' : 'Inspect Routing ▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Mode Switcher: AI Optimized vs Unoptimized Baseline */}
          <div className="flex items-center justify-between gap-3 p-1.5 bg-stone-100 rounded-2xl">
            <button
              onClick={() => setSelectedRouteMode('optimized')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRouteMode === 'optimized'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AI-Optimized Route (Active Sequence)</span>
            </button>
            <button
              onClick={() => setSelectedRouteMode('unoptimized')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRouteMode === 'unoptimized'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Naive Unoptimized Benchmark (Without AI)</span>
            </button>
          </div>

          {/* Active Mode Comparison Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Metric 1: Distance */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Total Route Distance</span>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {selectedRouteMode === 'optimized' ? `${opt.optimizedDistanceKm} km` : `${opt.unoptimizedDistanceKm} km`}
              </div>
              <span
                className={`text-[10px] font-bold block ${
                  selectedRouteMode === 'optimized' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {selectedRouteMode === 'optimized' ? `✓ Saves ${opt.distanceSavedPercent}% mileage` : '⚠️ +38 km excess detour'}
              </span>
            </div>

            {/* Metric 2: Transit Duration */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                Transit Duration
              </span>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {selectedRouteMode === 'optimized' ? '1 hr 35 mins' : '3 hrs 15 mins'}
              </div>
              <span
                className={`text-[10px] font-bold block ${
                  selectedRouteMode === 'optimized' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {selectedRouteMode === 'optimized' ? '✓ 51.3% time savings' : '⚠️ Late delivery risk'}
              </span>
            </div>

            {/* Metric 3: Carbon Footprint */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                Carbon Footprint
              </span>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {selectedRouteMode === 'optimized' ? `${opt.optimizedCarbonKg} kg CO₂` : `${opt.unoptimizedCarbonKg} kg CO₂`}
              </div>
              <span
                className={`text-[10px] font-bold block ${
                  selectedRouteMode === 'optimized' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {selectedRouteMode === 'optimized' ? '✓ -43.4% emissions' : '⚠️ Heavy fuel burn'}
              </span>
            </div>

            {/* Metric 4: Thermal Freshness */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Produce Thermal Risk</span>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {selectedRouteMode === 'optimized' ? '0% Decay' : '14.2% Decay'}
              </div>
              <span
                className={`text-[10px] font-bold block ${
                  selectedRouteMode === 'optimized' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {selectedRouteMode === 'optimized' ? '✓ Pre-sun 4:00 AM window' : '⚠️ Sun respiration loss'}
              </span>
            </div>
          </div>

          {/* Detailed Sequence Step-by-Step Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-stone-800 space-y-3 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-stone-800 pb-2 text-stone-400">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                {selectedRouteMode === 'optimized'
                  ? 'AI-Optimized Multi-Farm Waypoint Sequence'
                  : 'Naive Uncoordinated Sequencing (Benchmark)'}
              </span>
              <span className="text-stone-400">Clarke-Wright CVRP Solver</span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {selectedRouteMode === 'optimized' ? (
                <>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-stone-800">
                    <span className="text-emerald-400 font-bold">1. Surat APMC Hub ➔ Stop 1 (Ramesh Patel, Olpad)</span>
                    <span className="text-stone-400">19 km • NH-53 Corridor (Smooth tarmac, 45 km/h)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-stone-800">
                    <span className="text-emerald-400 font-bold">2. Olpad ➔ Stop 2 (Kathor / Kamrej)</span>
                    <span className="text-stone-400">18 km • State Highway SH-168 (Bypasses rural bottleneck)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-stone-800">
                    <span className="text-emerald-400 font-bold">3. Kamrej ➔ Stop 3 (Suresh Patel, Palsana)</span>
                    <span className="text-stone-400">22 km • NH-48 Expressway corridor (High-speed 55 km/h)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300">
                    <span className="font-bold">4. Palsana ➔ Surat APMC Doorstep</span>
                    <span>15 km • Direct Bulk Terminal Intake Bay 4 (Arrives 06:30 AM)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200">
                    <span>1. Surat APMC Hub ➔ Palsana</span>
                    <span className="text-stone-400">22 km (Cross-city morning traffic)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200">
                    <span>2. Palsana ➔ Olpad (Backtracking across district)</span>
                    <span className="text-stone-400">38 km (Severe zigzag detour)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200">
                    <span>3. Olpad ➔ Kamrej</span>
                    <span className="text-stone-400">24 km (Rural bridge congestion)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200">
                    <span>4. Kamrej ➔ Surat APMC (Late morning arrival)</span>
                    <span className="text-stone-400">18 km (Delayed to 08:15 AM • Peak sun heat)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
