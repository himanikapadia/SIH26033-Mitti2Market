import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  Sprout,
  PlusCircle,
  CheckCircle2,
  PhoneCall,
  Users,
  Radio,
  Clock,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const FarmerDailyHarvestPost: React.FC = () => {
  const { farmers, selectedFarmerId } = useDemo();
  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const [selectedCrop, setSelectedCrop] = useState<string>(farmer.todayCrop || 'Tomato');
  const [harvestQty, setHarvestQty] = useState<number>(farmer.todayAvailableQty || 300);
  const [expectedRate, setExpectedRate] = useState<number>(farmer.offeredRate || 22.0);
  const [readySlot, setReadySlot] = useState<string>('Tomorrow 04:00 AM – 05:30 AM');
  const [grade, setGrade] = useState<'A' | 'B'>('A');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAssistedModal, setShowAssistedModal] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3500);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-800">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Post Daily Harvest Availability
            </h3>
            <p className="text-[11px] text-stone-500">
              Publish ready-to-harvest crop quota to the Mitti2Market pooling grid
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Daily Log
        </span>
      </div>

      {isSubmitted && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold">Harvest Lot Published Successfully!</span>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              <strong>{harvestQty} kg {selectedCrop}</strong> at <strong>₹{expectedRate}/kg</strong> has been registered on the Mitti2Market matching grid for buyer pooling.
            </p>
          </div>
        </div>
      )}

      {/* Harvest Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Crop Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Crop to Harvest
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
            >
              <option value="Tomato">Tomato (Hybrid Fresh)</option>
              <option value="Potato">Potato (Jyoti Variety)</option>
              <option value="Onion">Onion (Nasik Red)</option>
              <option value="Chilli">Green Chilli (G-4)</option>
              <option value="Okra">Okra / Bhindi (Fresh Green)</option>
              <option value="Cauliflower">Cauliflower (Snowball)</option>
            </select>
          </div>

          {/* Harvest Quantity */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Estimated Harvest (kg)
            </label>
            <input
              type="number"
              min="50"
              step="25"
              value={harvestQty}
              onChange={(e) => setHarvestQty(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Expected Farm-Gate Rate */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Expected Farm-Gate Rate (₹/kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 font-mono font-bold text-stone-400">₹</span>
              <input
                type="number"
                min="5"
                step="0.5"
                value={expectedRate}
                onChange={(e) => setExpectedRate(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                required
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Zero commission deducted</span>
          </div>

          {/* Ready for Pickup Slot */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Harvest Readiness Slot
            </label>
            <select
              value={readySlot}
              onChange={(e) => setReadySlot(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
            >
              <option value="Tomorrow 04:00 AM – 05:30 AM">Tomorrow 04:00 AM – 05:30 AM (Morning)</option>
              <option value="Tomorrow 05:30 AM – 07:00 AM">Tomorrow 05:30 AM – 07:00 AM (Sunrise)</option>
              <option value="Tomorrow 04:00 PM – 06:00 PM">Tomorrow 04:00 PM – 06:00 PM (Evening)</option>
              <option value="Day After Tomorrow 04:00 AM">Day After Tomorrow 04:00 AM</option>
            </select>
          </div>
        </div>

        {/* Quality Declaration & Estimated Value */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-stone-400">Declared Quality Grade</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGrade('A')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  grade === 'A'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Grade A (Export / Retail)
              </button>
              <button
                type="button"
                onClick={() => setGrade('B')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  grade === 'B'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Grade B (Standard Market)
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-stone-400 uppercase font-bold">Estimated Farm Payout</div>
            <div className="text-base font-extrabold font-mono text-emerald-800">
              ₹{Math.round(harvestQty * expectedRate).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Harvest Lot to Grid</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Critical Rural Inclusion Explainer: How 2G Keypad Farmers Register Harvest */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
            <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
            <span>How 2G / Keypad Phone Farmers Post Daily Harvest</span>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
            No Internet Needed
          </span>
        </div>

        <p className="text-[11px] text-stone-700 leading-relaxed">
          Over <strong>55% of Indian smallholders have basic 2G phones</strong>. They do NOT need this web portal! They register daily harvest via 3 inclusive assisted channels:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-0.5">
            <div className="font-bold text-amber-950 flex items-center gap-1">
              <Users className="w-3 h-3 text-amber-600" />
              <span>1. Village Digital Sahayak</span>
            </div>
            <p className="text-[10px] text-stone-600 leading-snug">
              Local Krishi Mitra / CSC VLE logs harvest quota at village panchayat kiosk on tablet.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-0.5">
            <div className="font-bold text-amber-950 flex items-center gap-1">
              <Radio className="w-3 h-3 text-amber-600" />
              <span>2. Toll-Free IVR (1800)</span>
            </div>
            <p className="text-[10px] text-stone-600 leading-snug">
              Farmer dials <strong>1800-MITTI-MKT</strong>; speaks crop &amp; kg in Gujarati/Hindi voice menu.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-0.5">
            <div className="font-bold text-amber-950 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>3. Assisted FPO Rep</span>
            </div>
            <p className="text-[10px] text-stone-600 leading-snug">
              Cluster lead logs WhatsApp voice notes or SMS batch submissions for all member farms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
