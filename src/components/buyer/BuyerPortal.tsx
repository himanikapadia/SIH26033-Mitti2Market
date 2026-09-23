import React from 'react';
import { DemandBuilder } from './DemandBuilder';
import { AIDemandForecasting } from './AIDemandForecasting';
import { PoolStatus } from './PoolStatus';
import { ConsolidatedInvoice } from './ConsolidatedInvoice';
import { MatchingEngineLog } from './MatchingEngineLog';
import { BuyerLiveTracking } from './BuyerLiveTracking';
import { useDemo } from '../../context/DemoContext';
import { LeafletMap } from '../common/LeafletMap';
import { AlertTriangle } from 'lucide-react';

export const BuyerPortal: React.FC = () => {
  const { farmers, fleet, pickupStops, isMatchingActive, radarScanningLabel, activeDemand, shortageEvent } = useDemo();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Main Grid: Left Main Area + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Area: 8 Columns */}
        <div className="lg:col-span-8 space-y-8">
          {/* AI Demand Forecasting & Predictive Market Intelligence */}
          <AIDemandForecasting />

          {/* Demand Creation Builder */}
          <DemandBuilder />

          {/* Interactive Map (Shows scanning radar when demand posted) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Surat Agro-Cluster Supply Network
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time geographic distribution of 15 smallholder farmer lots
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                15 Farmers Registered
              </span>
            </div>

            <LeafletMap
              farmers={farmers}
              fleet={fleet}
              pickupStops={pickupStops}
              isMatchingActive={isMatchingActive}
              radarScanningLabel={radarScanningLabel}
              height="380px"
              zoom={10}
            />
          </div>

          {/* Shortage Re-Route Notice Banner */}
          {shortageEvent && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400 p-5 rounded-3xl shadow-sm space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce shrink-0" />
                <span>Live Supply Shortage Notice: Farm-Gate Shortfall Detour Scheduled</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                A shortfall of <strong>{shortageEvent.shortfallKg} kg</strong> occurred at Stop 1 (<strong>{shortageEvent.originalFarmerName}</strong>, {shortageEvent.village} — promised {shortageEvent.promisedQty} kg, verified {shortageEvent.actualWeight} kg).
                To safeguard your <strong>1,000 kg order quantity</strong>, the logistics truck has been dynamically re-routed to collect the remaining <strong>{shortageEvent.shortfallKg} kg</strong> from standby farmer <strong>{shortageEvent.standbyFarmerName} ({shortageEvent.standbyVillage})</strong>.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 w-fit">
                <span>✓ Consolidated invoice below updated with actual verified weights. Total 1,000 kg order quantity remains 100% fulfilled!</span>
              </div>
            </div>
          )}

          {/* Pool Status & Farmer Pool Table */}
          <PoolStatus />

          {/* Consolidated Invoice & Escrow Lock */}
          <ConsolidatedInvoice />

          {/* Live Delivery Tracking (Amazon-style, active once pickup starts) */}
          <BuyerLiveTracking />
        </div>

        {/* Right Sidebar: 4 Columns (Matching Engine Log Stream) */}
        <div className="lg:col-span-4 space-y-6">
          <MatchingEngineLog />
        </div>
      </div>
    </div>
  );
};
