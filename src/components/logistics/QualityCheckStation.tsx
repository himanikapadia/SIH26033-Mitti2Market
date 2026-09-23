import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { PickupStop, QualityGrade } from '../../types';
import {
  FileCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Scale,
  Clock,
  Scan,
  Zap,
  MapPin,
  RefreshCw,
  QrCode,
  UserCheck
} from 'lucide-react';
import { adjustRateByQuality } from '../../utils/matchingEngine';

export const QualityCheckStation: React.FC<{
  currentStop: PickupStop;
}> = ({ currentStop }) => {
  const { submitStopQC, pickupStops, fleet } = useDemo();

  const [actualWeight, setActualWeight] = useState<number>(currentStop.promisedQty);
  const [selectedGrade, setSelectedGrade] = useState<QualityGrade>('A');
  const [checkboxes, setCheckboxes] = useState({
    sizeUniform: true,
    noRottenProduce: true,
    colorAcceptable: true,
    ripenessAcceptable: true,
    packagingAcceptable: true,
    tempColdChain: true
  });
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiVerified, setAiVerified] = useState<boolean>(true);
  const [scanTimestamp, setScanTimestamp] = useState<string>('04:22:15 AM');

  // Next stop preview
  const currentIndex = pickupStops.findIndex((s) => s.id === currentStop.id);
  const nextStop = currentIndex >= 0 && currentIndex + 1 < pickupStops.length
    ? pickupStops[currentIndex + 1]
    : null;

  // Sync actual weight when stop changes
  useEffect(() => {
    setActualWeight(currentStop.promisedQty);
    setSelectedGrade('A');
    setScanTimestamp(new Date().toLocaleTimeString());
  }, [currentStop.id, currentStop.promisedQty]);

  const baseRate = 22.0;
  const adjustedRate = adjustRateByQuality(baseRate, selectedGrade);
  const shortfall = Math.max(0, currentStop.promisedQty - actualWeight);
  const isQualityFailed = selectedGrade === 'Failed';
  const farmerRevenue = isQualityFailed ? 0 : actualWeight * adjustedRate;
  const promisedRevenue = currentStop.promisedQty * baseRate;

  const handleSimulateAiPhoto = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      setIsAiScanning(false);
      setAiVerified(true);
      setScanTimestamp(new Date().toLocaleTimeString());
    }, 700);
  };

  const handleConfirm = () => {
    submitStopQC({
      stopId: currentStop.id,
      actualWeight: isQualityFailed ? 0 : actualWeight,
      grade: selectedGrade,
      checkboxes: {
        sizeUniform: checkboxes.sizeUniform,
        noRottenProduce: checkboxes.noRottenProduce,
        colorAcceptable: checkboxes.colorAcceptable,
        ripenessAcceptable: checkboxes.ripenessAcceptable,
        packagingAcceptable: checkboxes.packagingAcceptable
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
      {/* Header with Stop Coordinates & Inspection Station ID */}
      <div className="flex items-start justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stop {currentStop.stopNumber} Inspection
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                QC-Station #SRT-{currentStop.stopNumber}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
              {currentStop.farmerName}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{currentStop.village}</span>
              <span className="text-stone-300">•</span>
              <span className="font-mono text-stone-400">
                {currentStop.location.lat.toFixed(4)}°N, {currentStop.location.lng.toFixed(4)}°E
              </span>
            </p>
          </div>
        </div>

        {/* Promised Quantity Banner */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Promised Quantity</span>
          <span className="text-base font-extrabold font-mono text-emerald-700">
            {currentStop.promisedQty} kg
          </span>
          <span className="text-[10px] text-stone-500 block font-medium">
            {currentStop.crop} (Grade A Target)
          </span>
        </div>
      </div>

      {/* Section 1: Digital Weighbridge Scale Terminal */}
      <div className="p-4 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            Digital Loadcell Weighbridge Readout
          </span>
          <span className="text-[10px] font-mono text-stone-400">Tare: 0.0 kg • Calibrated</span>
        </div>

        {/* Big LED Digital Display */}
        <div className="bg-black/80 rounded-xl p-3 border border-stone-800 flex items-baseline justify-between">
          <div className="font-mono text-3xl font-extrabold text-emerald-400 tracking-wider">
            {actualWeight.toFixed(1)} <span className="text-lg text-emerald-600">KG</span>
          </div>
          <div className="text-right font-mono text-xs">
            {shortfall > 0 ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> -{shortfall} kg Shortfall
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Target Met
              </span>
            )}
          </div>
        </div>

        {/* Quick Simulation Presets & Manual Adjuster */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-stone-400 font-medium">Test Scenarios:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActualWeight(currentStop.promisedQty)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                actualWeight === currentStop.promisedQty
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              ✓ Full Promised ({currentStop.promisedQty} kg)
            </button>
            <button
              type="button"
              onClick={() => setActualWeight(Math.max(50, currentStop.promisedQty - 60))}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                actualWeight === currentStop.promisedQty - 60
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Simulate 60 kg Shortfall
            </button>
          </div>
        </div>

        {/* Shortfall Dynamic Standby Detour Alert */}
        {shortfall > 0 && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Automated Standby Detour Triggered!</span>
            </div>
            <p className="text-[11px] text-amber-100/90 leading-relaxed">
              When confirmed, the system will dynamically reroute the truck to collect the missing <strong>{shortfall} kg</strong> from reserve farmer <strong>Jayesh Vasava (Bardoli)</strong>.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 pt-0.5">
              <span>✓ Buyer total remains 1,000 kg</span>
              <span>•</span>
              <span>✓ Invoice auto-recalculated</span>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Agmark Quality Grade Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Agmark Produce Quality Grading</span>
          </label>
          <span className="text-[10px] text-stone-500 font-mono">
            Agmark Standard: AG-2026-TOM
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { grade: 'A' as QualityGrade, label: 'Grade A', desc: 'Export Grade', rate: 22.0, color: 'emerald' },
            { grade: 'B' as QualityGrade, label: 'Grade B', desc: 'Local Mandi', rate: 20.0, color: 'blue' },
            { grade: 'C' as QualityGrade, label: 'Grade C', desc: 'Processing', rate: 18.0, color: 'amber' },
            { grade: 'Failed' as QualityGrade, label: 'Failed', desc: 'Reject Produce', rate: 0.0, color: 'rose' }
          ].map((item) => (
            <button
              key={item.grade}
              type="button"
              onClick={() => setSelectedGrade(item.grade)}
              className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between ${
                selectedGrade === item.grade
                  ? item.grade === 'A'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
                    : item.grade === 'B'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/30'
                    : item.grade === 'C'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-500/30'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div>
                <span className="font-extrabold text-xs block">{item.label}</span>
                <span className={`text-[10px] ${selectedGrade === item.grade ? 'text-white/80' : 'text-stone-400'}`}>
                  {item.desc}
                </span>
              </div>
              <span className={`font-mono text-xs font-bold mt-1 ${selectedGrade === item.grade ? 'text-white' : 'text-slate-800'}`}>
                {item.rate > 0 ? `₹${item.rate.toFixed(0)}/kg` : 'Reject'}
              </span>
            </button>
          ))}
        </div>

        {/* Quality-Based Price Impact Calculation Card */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Contract Rate Adjustment:</span>
            <span className="font-mono text-emerald-800 font-extrabold">
              ₹{adjustedRate.toFixed(1)} / kg {selectedGrade !== 'A' && `(Base: ₹${baseRate}/kg)`}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-stone-600 font-mono text-[11px]">
            <span>Farmer Net Farm-Gate Credit:</span>
            <div className="text-right">
              <span className="font-extrabold text-sm text-slate-900">
                ₹{Math.round(farmerRevenue).toLocaleString('en-IN')}
              </span>
              {selectedGrade !== 'A' && !isQualityFailed && (
                <span className="text-[10px] text-amber-700 block font-semibold">
                  (Adjusted from ₹{Math.round(promisedRevenue).toLocaleString('en-IN')})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Physical 6-Point Inspection Checklist */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          6-Point Farm Gate Quality Checklist
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
          {[
            { key: 'sizeUniform', label: 'Size calibration (45–65 mm diameter)' },
            { key: 'noRottenProduce', label: 'Zero decay, soft rot, or fungal infection' },
            { key: 'colorAcceptable', label: 'Vibrant skin gloss & natural color' },
            { key: 'ripenessAcceptable', label: 'Fruit firmness index (>4.5 kg/cm²)' },
            { key: 'packagingAcceptable', label: 'Clean food-grade harvesting crates' },
            { key: 'tempColdChain', label: 'Pulp core temp checked (16°C – 19°C)' }
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 p-2 rounded-xl bg-stone-50/70 border border-stone-200 cursor-pointer hover:bg-stone-50 transition"
            >
              <input
                type="checkbox"
                checked={(checkboxes as any)[item.key]}
                onChange={(e) =>
                  setCheckboxes((prev) => ({ ...prev, [item.key]: e.target.checked }))
                }
                className="h-4 w-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="font-medium text-[11px]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 4: AI Computer Vision Photo Verification */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-stone-50 to-emerald-50/30 border border-emerald-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>AI Computer Vision Photo Inspection</span>
          </div>
          <button
            type="button"
            onClick={handleSimulateAiPhoto}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer transition shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isAiScanning ? 'animate-spin' : ''}`} />
            <span>{isAiScanning ? 'Scanning...' : 'Re-Run Vision Scan'}</span>
          </button>
        </div>

        {/* Viewfinder Preview with YOLOv8 Bounding Boxes */}
        <div className="relative rounded-2xl overflow-hidden border border-emerald-400 bg-slate-950 aspect-video max-h-48 flex items-center justify-center shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
            alt="Produce Sample"
            className="w-full h-full object-cover opacity-80"
          />

          {/* YOLOv8 Produce Detection Bounding Boxes */}
          <div className="absolute inset-0 pointer-events-none p-3">
            {/* Bounding Box 1 */}
            <div className="absolute top-4 left-6 w-24 h-24 border-2 border-emerald-400 rounded-lg">
              <span className="absolute -top-3.5 left-0 bg-emerald-700 text-white text-[8px] font-mono font-bold px-1 rounded shadow-xs uppercase whitespace-nowrap">
                #1 99.2% Gr-A (Blemish 0.1%)
              </span>
            </div>

            {/* Bounding Box 2 */}
            <div className="absolute top-8 right-8 w-28 h-28 border-2 border-emerald-400 rounded-lg">
              <span className="absolute -top-3.5 left-0 bg-emerald-700 text-white text-[8px] font-mono font-bold px-1 rounded shadow-xs uppercase whitespace-nowrap">
                #2 97.8% Gr-A (Firm Calyx)
              </span>
            </div>

            {/* Center Crosshair Viewfinder Reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-emerald-400/40 rounded-full relative flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-400/70 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Animated Scanning Laser Line */}
          {isAiScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 shadow-lg shadow-emerald-500/80 animate-bounce top-1/2"></div>
          )}

          {/* Bottom Telemetry Bar */}
          <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between text-[9px] font-mono">
            <div className="bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/40">
              YOLOv8-Nano • {scanTimestamp}
            </div>
            <div className="bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded text-stone-300 border border-stone-700 flex items-center gap-1">
              <span>⚡ 24ms (Edge CPU)</span>
            </div>
            <div className="bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <QrCode className="w-2.5 h-2.5" />
              <span>Agmark #0x8F2D</span>
            </div>
          </div>
        </div>

        {/* AI Diagnostics Metrics Readout */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-400 text-[9px]">Model Confidence</div>
            <div className="font-extrabold text-emerald-700 text-xs mt-0.5">98.6%</div>
            <div className="text-emerald-600 font-semibold text-[8px]">YOLOv8-Nano</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-400 text-[9px]">Defect Ratio</div>
            <div className="font-extrabold text-emerald-700 text-xs mt-0.5">0.3%</div>
            <div className="text-emerald-600 font-semibold text-[8px]">Zero Rot</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-400 text-[9px]">Freshness Index</div>
            <div className="font-extrabold text-emerald-700 text-xs mt-0.5">96 / 100</div>
            <div className="text-emerald-600 font-semibold text-[8px]">Morning Harvest</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-400 text-[9px]">Estimated Brix</div>
            <div className="font-extrabold text-emerald-700 text-xs mt-0.5">4.8°Bx</div>
            <div className="text-emerald-600 font-semibold text-[8px]">Grade-A Sugar</div>
          </div>
        </div>
      </div>

      {/* Section 5: Next Farmer Preview Card */}
      {nextStop ? (
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              Next Stop in Sequence
            </span>
            <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              ETA: {nextStop.eta}
            </span>
          </div>

          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>Stop {nextStop.stopNumber}: {nextStop.farmerName}</span>
            <span className="font-mono text-emerald-700">{nextStop.promisedQty} kg {nextStop.crop}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Village: {nextStop.village} ({nextStop.distanceKm} km leg)</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              SMS Staged Crates Alert Active
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
          <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Final Farm Collection Stop</span>
          </div>
          <p className="text-emerald-900 text-[11px]">
            Upon confirming this stop, the truck will lock its refrigerated cargo bay and proceed directly to Surat APMC Doorstep (ETA: <strong>{fleet.estimatedDeliveryTime || '06:30 AM'}</strong>).
          </p>
        </div>
      )}

      {/* Confirmation & Farm-Gate Escrow Release Action */}
      <button
        onClick={handleConfirm}
        className={`w-full py-4 px-4 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition ${
          shortfall > 0
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/20'
            : isQualityFailed
            ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-600/20'
            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-600/20'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {isQualityFailed
            ? `REJECT BATCH & TRIGGER STANDBY REPLACEMENT`
            : shortfall > 0
            ? `CONFIRM ${actualWeight} KG & DETOUR TRUCK FOR ${shortfall} KG STANDBY SHORTFALL`
            : `CONFIRM WEIGHT & GRADE (RELEASE 70% ESCROW AT FARM GATE)`}
        </span>
      </button>
    </div>
  );
};
