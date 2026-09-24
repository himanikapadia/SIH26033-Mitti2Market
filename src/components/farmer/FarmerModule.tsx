import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { FarmerProfile } from './FarmerProfile';
import { FarmerDailyHarvestPost } from './FarmerDailyHarvestPost';
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

      {/* Dual Frameset: Left Live Farmer Portal vs Right Evaluator Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Frame: Live Farmer Portal Window */}
        <div className="lg:col-span-6 rounded-3xl border-[3px] border-emerald-500 bg-emerald-50/20 shadow-lg overflow-hidden flex flex-col">
          {/* Top Window Title Bar */}
          <div className="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-emerald-600">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5 mr-1">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-xs"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-xs"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-xs"></span>
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
                <span>🌾 LIVE FARMER PORTAL</span>
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-500 uppercase tracking-wider">
              Farmer Live Screen
            </span>
          </div>

          {/* Window Body */}
          <div className="p-4 sm:p-6 space-y-6">
            <FarmerProfile />
            <FarmerDailyHarvestPost />
          </div>
        </div>

        {/* Right Frame: Evaluator Sandbox & Device Simulator Window */}
        <div className="lg:col-span-6 rounded-3xl border-[3px] border-amber-500 bg-amber-50/20 shadow-lg overflow-hidden flex flex-col">
          {/* Top Window Title Bar */}
          <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-600">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5 mr-1">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-xs"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-xs"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-xs"></span>
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-wide text-amber-300 uppercase flex items-center gap-1.5">
                <span>🧪 EVALUATOR SANDBOX &amp; DEVICE SIMULATOR</span>
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-200 border border-amber-600 uppercase tracking-wider">
              Demo Simulation Lab
            </span>
          </div>

          {/* Window Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* 15 Farmers Network */}
            <FarmerNetwork />

            {/* Concise, Highly-Readable Evaluator Note */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
                  <span>🇮🇳</span>
                  <span>Rural Inclusion Simulator Guide</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                  Dual Mode Testing
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                Over 55% of Indian smallholders rely on basic 2G feature phones. Mitti2Market supports both modern smartphones and vernacular IVR audio calls:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-blue-200 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-extrabold text-blue-900">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Smartphone App</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Select <strong>Ramesh Patel</strong> above to inspect push alert, Agmark cert, and UPI payout.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-extrabold text-amber-950">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                    <span>2G Keypad IVR Call</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Select <strong>Mahesh Patel</strong> above to test vernacular Hindi/Gujarati voice call (1 Accept / 2 Reject).
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Device Container */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
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
    </div>
  );
};
