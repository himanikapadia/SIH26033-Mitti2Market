import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { LeafletMap } from '../common/LeafletMap';
import { TransportAllocation } from './TransportAllocation';
import { QualityCheckStation } from './QualityCheckStation';
import { AIRouteOptimization } from './AIRouteOptimization';
import {
  Truck,
  CheckCircle2,
  Clock,
  Play,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  PackageCheck,
  Thermometer,
  Gauge,
  Navigation,
  UserCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

export const LogisticsPortal: React.FC = () => {
  const {
    fleet,
    pickupStops,
    farmers,
    consolidatedInvoice,
    startPickupRun,
    arriveAtStop,
    completeFinalDelivery,
    setActiveTab,
    transitSecondsRemaining,
    isTransitCountdownActive,
    fastForwardTransitToDoorstep
  } = useDemo();

  const stops = pickupStops;
  const isStarted = fleet.pickupRunsActive;
  const currentStop = stops[fleet.activeStopIndex] || stops[0];
  const allStopsDone = stops.length > 0 && stops.every((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED_REPLACED');
  const nextStop = stops.length > fleet.activeStopIndex + 1 ? stops[fleet.activeStopIndex + 1] : null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Control Tower Master Header */}
      <div className="bg-gradient-to-r from-stone-950 via-slate-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Mitti Logistics • Cold-Chain Control Tower</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Fleet Dispatch & Farm-Gate QC Console</span>
              {isStarted && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 animate-pulse">
                  ● LIVE RUN ACTIVE
                </span>
              )}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Automated multi-farm cold collection corridor across Surat cluster. High-precision weighbridge intake, Agmark digital grading, and instant escrow release at every farm gate.
            </p>
          </div>

          {/* Action Button */}
          {!isStarted ? (
            <button
              onClick={startPickupRun}
              disabled={stops.length === 0}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-amber-500/25 cursor-pointer transition shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START PICKUP RUN</span>
            </button>
          ) : (
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/40 text-xs text-amber-300 font-bold flex items-center gap-3 shadow-lg shrink-0">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Truck className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Vehicle Active</div>
                <div className="text-sm font-extrabold text-white font-mono">{fleet.vehicleNumber}</div>
              </div>
            </div>
          )}
        </div>

        {/* Live Control Tower Telemetry KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-800 text-xs">
          {/* Telemetry 1: Vehicle & Driver */}
          <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">Assigned Unit</span>
            <div className="font-extrabold text-slate-100 text-sm mt-0.5">{fleet.vehicleNumber}</div>
            <div className="text-[11px] text-stone-400">Driver: <strong>{fleet.driverName}</strong></div>
          </div>

          {/* Telemetry 2: Reefer Temp */}
          <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" />
              Cold Bay Temp
            </span>
            <div className="font-extrabold text-cyan-300 font-mono text-sm mt-0.5">
              {fleet.reeferTempC || 17.8}°C <span className="text-[10px] text-emerald-400 font-normal">(Optimal)</span>
            </div>
            <div className="text-[11px] text-stone-400">Humidity: {fleet.reeferHumidityPercent || 88}% RH</div>
          </div>

          {/* Telemetry 3: Speed & Leg */}
          <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" />
              Live Telemetry
            </span>
            <div className="font-extrabold text-amber-300 font-mono text-sm mt-0.5">
              {fleet.speedKmH ? `${fleet.speedKmH} km/h` : '0 km/h (At Gate)'}
            </div>
            <div className="text-[10px] text-stone-400 truncate">{fleet.currentSegmentName || 'Standby at Hub'}</div>
          </div>

          {/* Telemetry 4: Doorstep Target */}
          <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              Doorstep Target
            </span>
            <div className="font-extrabold text-emerald-400 font-mono text-sm mt-0.5">
              {fleet.estimatedDeliveryTime || '06:30 AM'}
            </div>
            <div className="text-[11px] text-stone-400">Surat APMC Bulk Bay 4</div>
          </div>
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-xs text-stone-500 space-y-3">
          <Truck className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="font-extrabold text-slate-800 text-base">No Confirmed Orders Awaiting Dispatch</h3>
          <p className="max-w-md mx-auto text-stone-400">
            Logistics becomes active once the buyer confirms the consolidated order and places 70% escrow on hold in the Buyer Portal.
          </p>
          <button
            onClick={() => setActiveTab('buyer')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
          >
            <span>Go to Buyer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Visual Route Progression Corridor Ribbon (Horizontal Multi-Stop Stepper) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Consolidated Multi-Farm Route Corridor
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-500 font-bold">
                {stops.filter((s) => s.status === 'COMPLETED').length} of {stops.length} Stops Completed
              </span>
            </div>

            {/* Stepper Nodes */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin">
              {/* Hub Departure Node */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-extrabold text-[11px]">Surat APMC Hub</div>
                    <div className="text-[10px] text-emerald-700 font-mono">04:00 AM Departure</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
              </div>

              {/* Stops Nodes */}
              {stops.map((stop, idx) => {
                const isCurrent = fleet.activeStopIndex === idx && isStarted && stop.status !== 'COMPLETED';
                const isDone = stop.status === 'COMPLETED';
                const isStandby = stop.id.includes('standby') || stop.farmerName.includes('Standby');

                return (
                  <div key={stop.id} className="flex items-center gap-2 shrink-0">
                    <div
                      className={`px-3 py-2 rounded-2xl border text-xs transition-all flex items-center gap-2.5 ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                          : isCurrent
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 text-amber-950 shadow-sm'
                          : isStandby
                          ? 'bg-blue-50/70 border-blue-300 text-blue-900'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-600 text-white animate-pulse'
                            : isStandby
                            ? 'bg-blue-600 text-white'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isDone ? '✓' : stop.stopNumber}
                      </span>
                      <div>
                        <div className="font-extrabold text-[11px] truncate max-w-[130px]">
                          {stop.farmerName.split(' ')[0]} ({stop.village})
                        </div>
                        <div className="text-[10px] font-mono opacity-80">
                          {isDone ? `Verified ${stop.promisedQty}kg` : `ETA: ${stop.eta}`}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
                  </div>
                );
              })}

              {/* Final Doorstep Delivery Node */}
              <div className="shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs ${
                    allStopsDone
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <PackageCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-extrabold text-[11px]">Doorstep Intake</div>
                    <div className="text-[10px] font-mono">Surat APMC Bay 4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Route/Map & Checklist + Right QC Station & Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 7 Cols (Route Map & Progress) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Live Route Map with Moving Truck */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Live Highway & Rural Collection Route
                    </h3>
                    <p className="text-xs text-stone-500">
                      Surat APMC Hub ➔ {stops.map((s) => s.village).join(' ➔ ')} ➔ APMC Doorstep
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {stops.length} Farm Gate Stops
                  </span>
                </div>

                <LeafletMap
                  farmers={farmers}
                  fleet={fleet}
                  pickupStops={stops}
                  height="440px"
                  zoom={10}
                />
              </div>

              {/* AI Route Optimization CVRP Engine */}
              <AIRouteOptimization />

              {/* Stops Checklist & Progression */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Multi-Stop Farm Gate Manifest
                </h3>

                <div className="space-y-3">
                  {stops.map((stop, idx) => {
                    const isCurrent = fleet.activeStopIndex === idx && isStarted;
                    const isDone = stop.status === 'COMPLETED';
                    const isArrived = stop.status === 'ARRIVED';
                    const isStandby = stop.id.includes('standby') || stop.farmerName.includes('Standby');

                    return (
                      <div
                        key={stop.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-300'
                            : isCurrent
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                            : isStandby
                            ? 'bg-blue-50/50 border-blue-300'
                            : 'bg-stone-50 border-stone-200 text-stone-500'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-600 text-white'
                                  : isStandby
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {isDone ? '✓' : stop.stopNumber}
                            </span>
                            <span className="font-extrabold text-sm text-slate-900">
                              Stop {stop.stopNumber}: {stop.farmerName}
                            </span>
                            {isStandby && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                                Standby Detour
                              </span>
                            )}
                            <span className="text-xs text-stone-500 font-medium">({stop.village})</span>
                          </div>
                          <div className="text-xs text-stone-600 pl-8">
                            Promised: <strong>{stop.promisedQty} kg {stop.crop}</strong> • Distance: {stop.distanceKm} km • Scheduled: {stop.eta}
                          </div>
                        </div>

                        {/* Stop Status / Action */}
                        <div className="pl-8 sm:pl-0 flex items-center gap-2 shrink-0">
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified & Paid</span>
                            </span>
                          ) : isArrived ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full animate-pulse">
                              <span>Arrived at Farm Gate</span>
                            </span>
                          ) : isCurrent ? (
                            <button
                              onClick={() => arriveAtStop(stop.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition shadow-xs"
                            >
                              Driver: ARRIVED AT FARM
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-stone-400">
                              ⏳ En Route
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery to Buyer Final Step Card */}
                {allStopsDone && (
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white border-2 border-emerald-400 shadow-xl space-y-4 text-xs animate-in zoom-in-95">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-sm flex items-center gap-2 text-emerald-300">
                          <PackageCheck className="w-5 h-5 text-emerald-400" />
                          <span>All Farm Pickups Completed ✓ (70% Escrow Released)</span>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          Consolidated load ({fleet.currentLoadKg} kg) secured in refrigerated bay. En route to Surat APMC Doorstep.
                        </p>
                      </div>

                      {isTransitCountdownActive ? (
                        <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono font-bold text-xs flex items-center gap-1.5 self-start sm:self-center">
                          <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Transit: {formatTime(transitSecondsRemaining)}</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                          Arrived at Doorstep ✓
                        </span>
                      )}
                    </div>

                    {/* Progress Bar of 30-sec Transit */}
                    {isTransitCountdownActive && (
                      <div className="space-y-2 pt-1 border-t border-stone-800">
                        <div className="flex justify-between text-[10px] font-mono text-stone-400">
                          <span>Farm Gate Clusters</span>
                          <span className="text-amber-400 font-bold">Expressway Corridor ({transitSecondsRemaining}s)</span>
                          <span>Surat APMC Doorstep</span>
                        </div>
                        <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden border border-stone-700">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(100, Math.max(5, Math.round(((30 - transitSecondsRemaining) / 30) * 100)))}%` }}
                          ></div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-300 pt-1">
                          <span>En route to Buyer Live Tracking (<strong>{transitSecondsRemaining}s</strong> remaining)...</span>
                          <button
                            onClick={fastForwardTransitToDoorstep}
                            className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 cursor-pointer transition underline underline-offset-4 self-end sm:self-auto"
                          >
                            <span>Fast-Forward to Buyer Doorstep &gt;&gt;</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {!isTransitCountdownActive && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-800">
                        <span className="text-emerald-300 font-bold text-[11px]">
                          Truck GJ-05-AB-1234 has reached Surat APMC Bay 4 Doorstep!
                        </span>
                        <button
                          onClick={() => setActiveTab('buyer')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md transition self-end sm:self-auto"
                        >
                          Open Buyer Doorstep Intake
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: 5 Cols (Allocation + QC Station) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quality Check Station (active for current arrived stop) */}
              {isStarted && currentStop && currentStop.status !== 'COMPLETED' ? (
                <QualityCheckStation currentStop={currentStop} />
              ) : allStopsDone ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs text-center space-y-2 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-slate-800 text-sm">All Stops Inspected & Loaded</h4>
                  <p className="text-stone-500">
                    Total load {fleet.currentLoadKg} kg secured in refrigerated bay. Ready for final settlement.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs text-center text-xs text-stone-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-stone-300" />
                  <h4 className="font-bold text-slate-700 text-sm">Quality Check Station Idle</h4>
                  <p>Click "START PICKUP RUN" to initiate the driver's journey and arrival at each farm gate.</p>
                </div>
              )}

              {/* Transport Specs */}
              <TransportAllocation />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
