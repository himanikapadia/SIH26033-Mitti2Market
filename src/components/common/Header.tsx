import React, { useState } from 'react';
import { useDemo, DemoSpeed } from '../../context/DemoContext';
import { ModuleTab } from '../../types';
import { AIEvaluatorModal } from './AIEvaluatorModal';
import {
  ShoppingBag,
  Sprout,
  Truck,
  Layers,
  RotateCcw,
  Play,
  Sparkles,
  Gauge,
  Radio,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const {
    activeTab,
    setActiveTab,
    demoSpeed,
    setDemoSpeed,
    runFullDemo,
    restartDemo,
    isAutoDemoRunning,
    poolContributors,
    pickupStops,
    fleet,
    activeDemand
  } = useDemo();

  // Badges
  const pendingFarmerActions = poolContributors.filter((c) => c.status === 'Pending').length;
  const activePickupStops = pickupStops.filter((s) => s.status === 'ARRIVED').length;

  const tabs: { id: ModuleTab; label: string; icon: React.ReactNode; badge?: number; color: string }[] = [
    {
      id: 'buyer',
      label: 'Buyer Portal',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'blue'
    },
    {
      id: 'farmer',
      label: 'Farmer Module',
      icon: <Sprout className="w-4 h-4" />,
      badge: pendingFarmerActions,
      color: 'emerald'
    },
    {
      id: 'logistics',
      label: 'Logistics & Quality Check',
      icon: <Truck className="w-4 h-4" />,
      badge: activePickupStops,
      color: 'amber'
    },
    {
      id: 'admin',
      label: 'Admin Console',
      icon: <Layers className="w-4 h-4" />,
      color: 'purple'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Demo Bar */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[10px] tracking-wide">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            DEMO MODE
          </span>
          <span className="text-stone-400 hidden sm:inline">
            Smart India Hackathon Screening Prototype
          </span>
        </div>

        {/* Demo Controls: AI Model Stack + Speed + Run Full Demo + Restart Demo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Model Stack Inspector for Evaluators */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Inspect 4 Core AI Engines, Live Inference Playground & SIH Evaluator Criteria"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI Architecture</span>
            <span className="hidden sm:inline text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-300">
              4 Models
            </span>
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1 bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-700 text-[11px]">
            <Gauge className="w-3 h-3 text-stone-400" />
            <span className="text-stone-400 hidden md:inline">Speed:</span>
            {(['Normal', 'Fast', 'Instant'] as DemoSpeed[]).map((spd) => (
              <button
                key={spd}
                onClick={() => setDemoSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  demoSpeed === spd
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          {/* Run Full Demo Automation */}
          <button
            onClick={runFullDemo}
            disabled={isAutoDemoRunning}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
              isAutoDemoRunning
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Automatically run the complete 18-step hackathon pitch flow"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isAutoDemoRunning ? 'Simulating...' : 'Run Full Demo'}</span>
          </button>

          {/* Restart Demo Button */}
          <button
            onClick={restartDemo}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold border border-stone-700 cursor-pointer transition"
            title="Reset all states to pristine condition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Restart Demo</span>
          </button>
        </div>
      </div>

      {/* Main Brand & Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 text-xl font-bold">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Mitti<span className="text-emerald-600">2</span>Market
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  Demand-First Pooling
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Small Farms. One Powerful Market.
              </p>
            </div>
          </div>

          {/* 4 Main Tabs */}
          <nav className="flex items-center p-1 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
                  }`}
                >
                  <span
                    className={`${
                      isActive
                        ? tab.id === 'buyer'
                          ? 'text-blue-600'
                          : tab.id === 'farmer'
                          ? 'text-emerald-600'
                          : tab.id === 'logistics'
                          ? 'text-amber-600'
                          : 'text-purple-600'
                        : 'text-stone-400'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Architecture & Evaluator Inspector Modal */}
      <AIEvaluatorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </header>
  );
};
