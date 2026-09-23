import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { FarmerProfile } from './FarmerProfile';
import { FarmerNetwork } from './FarmerNetwork';
import { SmartphoneSimulator } from './SmartphoneSimulator';
import { KeypadPhoneSimulator } from './KeypadPhoneSimulator';
import { Smartphone, PhoneCall, Radio, Sparkles } from 'lucide-react';

export const FarmerModule: React.FC = () => {
  const { farmers, selectedFarmerId, activeDemand, poolContributors } = useDemo();
  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const targetKg = activeDemand?.targetTotalKg || 1000;
  const acceptedKg = poolContributors
    .filter((c) => c.status === 'Accepted')
    .reduce((sum, c) => sum + c.allocatedQty, 0);
  const progressPercent = Math.min(100, Math.round((acceptedKg / targetKg) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Inclusive Farmer Participation Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Farmer Ecosystem & Interactive Device Simulator
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Bridging the digital divide: Smallholders participate seamlessly via either modern smartphone apps or offline vernacular IVR phone calls on basic feature phones.
          </p>
        </div>

        <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 text-xs text-stone-300 space-y-1">
          <div className="font-extrabold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Vernacular Multi-Dialect</span>
          </div>
          <div>Gujarati & Hindi Audio IVR Supported</div>
          <div className="text-[10px] text-stone-400 font-mono">Zero Smartphone Dependency Required</div>
        </div>
      </div>

      {/* 4-Step Interactive Storytelling Lifecycle Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Procurement Lifecycle Storytelling:
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Demand-to-Consolidation
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-800">
            Active Pool: {acceptedKg} of {targetKg} kg Confirmed ({progressPercent}%)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Step 1 */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Step 1</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Done ✓</span>
            </div>
            <div className="font-extrabold text-slate-900">Buyer Posts Demand</div>
            <div className="text-[11px] text-stone-500">1,000 kg Tomato requisition posted</div>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Step 2</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                Active
              </span>
            </div>
            <div className="font-extrabold text-amber-950">Farmers Receive Alerts</div>
            <div className="text-[11px] text-amber-800">Push App Alert or Hindi Voice Call (IVR)</div>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Step 3</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">Simulate Below</span>
            </div>
            <div className="font-extrabold text-blue-950">Farmer Consent Decision</div>
            <div className="text-[11px] text-blue-800">Press Accept / Reject / Counter on Device</div>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Step 4</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Real-Time</span>
            </div>
            <div className="font-extrabold text-emerald-950">Buyer Pool Updates</div>
            <div className="text-[11px] text-emerald-800">Order consolidates into unified B2B invoice</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Profile (4 Cols) + Right Network & Simulator (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Selected Farmer Profile */}
        <div className="lg:col-span-5 space-y-6">
          <FarmerProfile />
        </div>

        {/* Right: Two-part Network + Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top: 15 Farmers Network */}
          <FarmerNetwork />

          {/* Bottom: Simulated Device Container */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Device Simulator:</span>
                  <span className="text-emerald-700">{farmer.name} ({farmer.village})</span>
                </h3>
                <p className="text-xs text-stone-500">
                  {farmer.phoneType === 'SMARTPHONE'
                    ? 'Smartphone App Interface (Modern Push Alert)'
                    : 'Retro Keypad Phone with Vernacular IVR Dialing'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 text-xs font-bold text-slate-700">
                {farmer.phoneType === 'SMARTPHONE' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Smartphone</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                    <span>Feature Phone</span>
                  </>
                )}
              </div>
            </div>

            {/* Render appropriate simulator */}
            {farmer.phoneType === 'SMARTPHONE' ? (
              <SmartphoneSimulator />
            ) : (
              <KeypadPhoneSimulator />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
