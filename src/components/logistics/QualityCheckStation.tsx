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
  ShieldAlert
} from 'lucide-react';
import { adjustRateByQuality } from '../../utils/matchingEngine';

export const QualityCheckStation: React.FC<{
  currentStop: PickupStop;
}> = ({ currentStop }) => {
  const { submitStopQC } = useDemo();

  const [actualWeight, setActualWeight] = useState<number>(currentStop.promisedQty);
  const [selectedGrade, setSelectedGrade] = useState<QualityGrade>('A');
  const [checkboxes, setCheckboxes] = useState({
    sizeUniform: true,
    noRottenProduce: true,
    colorAcceptable: true,
    ripenessAcceptable: true,
    packagingAcceptable: true
  });
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiVerified, setAiVerified] = useState<boolean>(true);

  // Sync actual weight when stop changes
  useEffect(() => {
    setActualWeight(currentStop.promisedQty);
    setSelectedGrade('A');
  }, [currentStop.id, currentStop.promisedQty]);

  const baseRate = 22.0;
  const adjustedRate = adjustRateByQuality(baseRate, selectedGrade);
  const shortfall = Math.max(0, currentStop.promisedQty - actualWeight);
  const farmerRevenue = actualWeight * adjustedRate;

  const handleSimulateAiPhoto = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      setIsAiScanning(false);
      setAiVerified(true);
    }, 600);
  };

  const handleConfirm = () => {
    submitStopQC({
      stopId: currentStop.id,
      actualWeight,
      grade: selectedGrade,
      checkboxes
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Farm Gate Quality & Weight Station</h3>
            <p className="text-[10px] text-stone-500 font-mono">
              Stop {currentStop.stopNumber}: {currentStop.farmerName} ({currentStop.village})
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Promised: {currentStop.promisedQty} kg
        </span>
      </div>

      {/* Weight Input & Shortfall Checker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Actual Weighbridge Quantity (kg):
          </label>
          <input
            type="number"
            value={actualWeight}
            onChange={(e) => setActualWeight(Number(e.target.value))}
            className="w-full text-sm font-mono font-bold px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <span className="text-[10px] text-stone-400 mt-1 block">
            Tip: Change to 240 kg to demonstrate automatic shortfall detection!
          </span>
        </div>

        {/* Shortfall Indicator */}
        <div className="flex flex-col justify-center p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          {shortfall > 0 ? (
            <div className="text-rose-700 space-y-1">
              <div className="font-extrabold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>Shortfall Detected: {shortfall} kg</span>
              </div>
              <p className="text-[11px] text-rose-600 leading-tight">
                Promised {currentStop.promisedQty} kg → Actual {actualWeight} kg.
              </p>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-[10px] text-amber-900 font-semibold space-y-0.5">
                <div className="flex items-center gap-1 font-bold text-amber-800">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Standby Re-Route Scheduled:</span>
                </div>
                <div>Logistics truck will dynamically detour to standby farmer to collect remaining {shortfall} kg.</div>
                <div className="text-emerald-700 font-bold">✓ Buyer portal alerted & consolidated invoice updated.</div>
              </div>
            </div>
          ) : (
            <div className="text-emerald-700 space-y-0.5">
              <span className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Volume Fulfilled
              </span>
              <p className="text-[10px] text-stone-500">Zero weight deviation detected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quality Grade Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Produce Quality Grade:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['A', 'B', 'C', 'Failed'] as QualityGrade[]).map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setSelectedGrade(grade)}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                selectedGrade === grade
                  ? grade === 'A'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : grade === 'B'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : grade === 'C'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Quality-Based Price Adjustment Callout */}
      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
        <div className="flex items-center justify-between font-bold">
          <span className="text-slate-800">Quality-Based Rate Adjustment:</span>
          <span className="font-mono text-emerald-800 text-sm">₹{adjustedRate}/kg</span>
        </div>
        <div className="text-[11px] text-stone-600">
          Promised Grade A (₹22/kg) → Actual Grade {selectedGrade} ({selectedGrade === 'A' ? '100% Rate' : selectedGrade === 'B' ? 'Adjusted to ₹20/kg' : selectedGrade === 'C' ? 'Adjusted to ₹18/kg' : 'Rejected'})
        </div>
        <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-500 font-mono text-[11px]">
          <span>Farmer Revenue Recalculated:</span>
          <span className="font-extrabold text-slate-900">₹{Math.round(farmerRevenue).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Physical Inspection Checkboxes */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Physical Quality Checklist
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
          {[
            { key: 'sizeUniform', label: 'Size uniform & calibrated' },
            { key: 'noRottenProduce', label: 'No rotten produce or spoilage' },
            { key: 'colorAcceptable', label: 'Vibrant natural skin color' },
            { key: 'ripenessAcceptable', label: 'Optimal firmness & ripeness' },
            { key: 'packagingAcceptable', label: 'Perishable crates packaging' }
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 p-2 rounded-xl bg-stone-50/70 border border-stone-200 cursor-pointer"
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

      {/* Mandatory AI Image Inspection Area */}
      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>AI Quality Photo Inspection (Simulated)</span>
          </span>
          <button
            type="button"
            onClick={handleSimulateAiPhoto}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 hover:bg-emerald-300 transition cursor-pointer"
          >
            {isAiScanning ? 'Scanning...' : 'Re-run AI Vision'}
          </button>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-emerald-100 text-[11px] text-emerald-900 font-mono space-y-0.5">
          <div className="text-emerald-700 font-bold">✓ Produce image analyzed</div>
          <div className="text-emerald-700 font-bold">✓ Produce appears acceptable</div>
          <div className="text-emerald-700 font-bold">✓ No major visible defects detected</div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleConfirm}
        className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition ${
          shortfall > 0
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/20'
            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-600/20'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {shortfall > 0
            ? `CONFIRM ${actualWeight} KG & RE-ROUTE FOR ${shortfall} KG STANDBY SHORTFALL PICKUP`
            : `CONFIRM WEIGHT & GRADE FOR STOP ${currentStop.stopNumber}`}
        </span>
      </button>
    </div>
  );
};
