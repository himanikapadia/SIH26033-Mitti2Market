import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { LeafletMap } from '../common/LeafletMap';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Navigation,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const BuyerLiveTracking: React.FC = () => {
  const {
    consolidatedInvoice,
    fleet,
    pickupStops,
    farmers,
    completeFinalDelivery,
    setActiveTab,
    isDoorstepPendingAcceptance,
    acceptDoorstepDeliveryAndRelease30Percent,
    transitSecondsRemaining,
    isTransitCountdownActive,
    fastForwardTransitToDoorstep
  } = useDemo();

  if (!consolidatedInvoice || !fleet.pickupRunsActive) return null;

  const stops = pickupStops;
  const isDelivered = fleet.deliveryStatus === 'DELIVERED';
  const isDoorstep = fleet.deliveryStatus === 'ARRIVED_AT_DOORSTEP' || isDoorstepPendingAcceptance;
  const isNearBuyer = fleet.deliveryStatus === 'ARRIVING_SOON';
  const isOnWayToBuyer = fleet.deliveryStatus === 'ON_THE_WAY';

  // Amazon-style milestones
  const allStopsDone = stops.every((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED_REPLACED');

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Truck className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Live Delivery Tracking — Order #{consolidatedInvoice.orderId}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Vehicle: {fleet.vehicleNumber} ({fleet.fleetPartner}) • Driver: {fleet.driverName}
              </p>
            </div>
          </div>
        </div>

        <div>
          {isDelivered ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              DELIVERY COMPLETED ✓
            </span>
          ) : isDoorstep ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-400 animate-pulse">
              <PackageCheck className="w-4 h-4 text-amber-700" />
              ARRIVED AT DOORSTEP • AWAITING 30% ESCROW ACCEPTANCE
            </span>
          ) : isTransitCountdownActive ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 animate-pulse">
              <Clock className="w-4 h-4 text-amber-700 animate-spin" />
              IN HIGHWAY TRANSIT (~{transitSecondsRemaining}s TO APMC)
            </span>
          ) : isNearBuyer ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 animate-pulse">
              <Clock className="w-4 h-4 text-amber-700" />
              ARRIVING AT WAREHOUSE IN ~5 MINS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
              <Navigation className="w-3.5 h-3.5 text-blue-700" />
              CONSOLIDATED PICKUP RUN IN PROGRESS
            </span>
          )}
        </div>
      </div>

      {/* 30-Second Highway Transit Countdown Card (Active while truck drives to APMC) */}
      {isTransitCountdownActive && !isDoorstep && !isDelivered && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400 shadow-md space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-xs">
                <Truck className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                  <span>Refrigerated Truck En Route to Surat APMC Doorstep</span>
                </h4>
                <p className="text-xs text-amber-900">
                  All farm-gate pickups verified. Consolidated load ({fleet.currentLoadKg} kg) cruising on highway corridor.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <div className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-mono font-extrabold text-xs flex items-center gap-1.5 shadow-xs">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Arriving in {transitSecondsRemaining}s</span>
              </div>
            </div>
          </div>

          {/* Expressway Highway Transit Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[10px] font-mono text-stone-500">
              <span>Farm Gate Pickups Completed</span>
              <span className="text-amber-800 font-bold">Expressway Transit ({transitSecondsRemaining}s)</span>
              <span>Surat APMC Doorstep</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden p-0.5 border border-stone-300">
              <div
                className="bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-300 ease-out shadow-xs"
                style={{ width: `${Math.min(100, Math.max(5, Math.round(((30 - transitSecondsRemaining) / 30) * 100)))}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1 border-t border-amber-200/60">
            <span className="text-stone-500 text-[11px]">
              Doorstep intake will automatically unlock when truck docks (in <strong>{transitSecondsRemaining} seconds</strong>).
            </span>
            <button
              onClick={fastForwardTransitToDoorstep}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs cursor-pointer transition shadow-xs flex items-center gap-1 self-end sm:self-auto"
            >
              <span>Fast-Forward to Doorstep &gt;&gt;</span>
            </button>
          </div>
        </div>
      )}

      {/* Prominent Doorstep Delivery Intake & 30% Payment Release Card */}
      {isDoorstep && !isDelivered && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white border-2 border-emerald-400 shadow-2xl space-y-4 animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <PackageCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  Consolidated Order #{consolidatedInvoice.orderId} Arrived at Doorstep!
                </h4>
                <p className="text-xs text-stone-300">
                  Mitti Logistics Truck ({fleet.vehicleNumber}) arrived at Surat APMC Bulk Terminal Bay 4
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono font-bold text-xs self-start sm:self-auto">
              Pending Remaining 30% Escrow
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1">
              <span className="text-stone-400 text-[10px] block uppercase font-bold tracking-wider">Delivered Volume</span>
              <span className="font-extrabold text-white text-base font-mono">{consolidatedInvoice.totalKg} kg</span>
              <div className="text-[10px] text-emerald-400">✓ 100% Demand Fulfilled</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1">
              <span className="text-stone-400 text-[10px] block uppercase font-bold tracking-wider">Milestone 1 (Farm-Gate QC)</span>
              <span className="font-extrabold text-emerald-400 text-base font-mono">₹{consolidatedInvoice.escrow70PercentHold.toLocaleString('en-IN')}</span>
              <div className="text-[10px] text-emerald-400">✓ 70% Released at Pickup</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-amber-500/40 space-y-1">
              <span className="text-amber-300 text-[10px] block uppercase font-bold tracking-wider">Milestone 2 (Doorstep Delivery)</span>
              <span className="font-extrabold text-amber-300 text-base font-mono">₹{consolidatedInvoice.escrow30PercentFinal.toLocaleString('en-IN')}</span>
              <div className="text-[10px] text-amber-300 font-semibold">Awaiting Your Acceptance</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-emerald-500/30 text-xs text-stone-300 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Consolidated produce has docked and passed physical intake verification. Clicking accept will release the final 30% escrow balance directly to all {consolidatedInvoice.contributors.length} smallholder farmers via Aadhaar UPI / Bank accounts.
            </p>
          </div>

          <button
            onClick={acceptDoorstepDeliveryAndRelease30Percent}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 cursor-pointer transition transform active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>ACCEPT DOORSTEP DELIVERY &amp; RELEASE FINAL 30% ESCROW (₹{consolidatedInvoice.escrow30PercentFinal.toLocaleString('en-IN')})</span>
          </button>
        </div>
      )}

      {/* Amazon-Style Milestone Progress Stepper */}
      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200 space-y-3">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
          Delivery Milestones
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
          {/* Milestone 1: Pickup Started */}
          <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-950 font-bold">
            <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
            <div>Pickup Started</div>
            <div className="text-[9px] text-emerald-700 font-normal">04:00 AM</div>
          </div>

          {/* Stops milestones */}
          {stops.map((stop, i) => {
            const isDone = stop.status === 'COMPLETED' || stop.status === 'SKIPPED_REPLACED';
            const isCurrent = stop.status === 'ARRIVED';

            return (
              <div
                key={stop.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold ring-2 ring-amber-400/20'
                    : 'bg-white border-stone-200 text-stone-400 font-medium'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 mx-auto mb-1 text-stone-400" />
                )}
                <div className="truncate">
                  {stop.farmerName.split(' ')[0]} {isDone ? '✓' : ''}
                </div>
                <div className="text-[9px] text-stone-500 font-mono">
                  {isDone ? `${stop.promisedQty}kg collected` : `Stop ${i + 1}`}
                </div>
              </div>
            );
          })}

          {/* On the way to buyer */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              isOnWayToBuyer || isNearBuyer || isDoorstep || isDelivered
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-white border-stone-200 text-stone-400 font-medium'
            }`}
          >
            <Truck className="w-4 h-4 mx-auto mb-1" />
            <div>On the way</div>
            <div className="text-[9px] text-stone-500">Expressway</div>
          </div>

          {/* Arriving soon */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              isNearBuyer || isDoorstep || isDelivered
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-white border-stone-200 text-stone-400 font-medium'
            }`}
          >
            <Clock className="w-4 h-4 mx-auto mb-1" />
            <div>Arriving soon</div>
            <div className="text-[9px] text-stone-500">APMC Gate</div>
          </div>

          {/* Delivered */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              isDelivered
                ? 'bg-emerald-600 border-emerald-700 text-white font-extrabold shadow-sm'
                : isDoorstep
                ? 'bg-amber-100 border-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-400/30 animate-pulse'
                : 'bg-white border-stone-200 text-stone-400 font-medium'
            }`}
          >
            <PackageCheck className="w-4 h-4 mx-auto mb-1" />
            <div>{isDelivered ? 'Delivered ✓' : 'At Doorstep'}</div>
            <div className="text-[9px]">{isDelivered ? '100% Settled' : 'Awaiting 30%'}</div>
          </div>
        </div>
      </div>

      {/* Interactive Map of Delivery Route */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Live Vehicle Telemetry & Fleet Route</span>
          <span className="text-stone-500 font-mono">
            Current Status:{' '}
            <span className="text-emerald-700 uppercase">
              {isDelivered
                ? 'Delivered at APMC Warehouse'
                : isNearBuyer
                ? '5 Minutes Away from Destination'
                : isOnWayToBuyer
                ? 'Heading to Buyer Warehouse'
                : `At Stop ${fleet.activeStopIndex + 1}: ${stops[fleet.activeStopIndex]?.farmerName || ''}`}
            </span>
          </span>
        </div>

        <LeafletMap
          farmers={farmers}
          fleet={fleet}
          pickupStops={stops}
          height="380px"
          zoom={10}
        />
      </div>

      {/* Contextual actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveTab('logistics')}
          className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer flex items-center gap-1"
        >
          <span>Open Driver Inspection Station</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {isNearBuyer && !isDelivered && (
          <button
            onClick={completeFinalDelivery}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer transition shadow-md shadow-emerald-600/20"
          >
            Confirm Delivery & Release Remaining 30% Escrow
          </button>
        )}
      </div>
    </div>
  );
};
