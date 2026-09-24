import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Crop } from '../../types';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Check,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DemandBuilder: React.FC = () => {
  const { crops, postDemand, isMatchingActive, activeDemand, forecastPrefill } = useDemo();

  // Multi-crop selection state
  const [selectedCrops, setSelectedCrops] = useState<{ cropId: string; quantity: number }[]>([
    { cropId: 'crop-tomato', quantity: 1000 }
  ]);

  // Sync when AI forecast prefill is clicked
  React.useEffect(() => {
    if (forecastPrefill) {
      setSelectedCrops([{ cropId: forecastPrefill.cropId, quantity: forecastPrefill.quantity }]);
    }
  }, [forecastPrefill]);

  const [acceptExtra10, setAcceptExtra10] = useState<boolean>(true);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState<string>('Tomorrow 4:00 AM');
  const [pickupWindow, setPickupWindow] = useState<string>('4:00 AM – 5:00 AM');
  const [deliveryRequiredBy, setDeliveryRequiredBy] = useState<string>('7:00 AM');
  const [buyerName, setBuyerName] = useState<string>('Nature Fresh Supermarkets Ltd');

  // Add / Remove crop to demand
  const handleAddCrop = (cropId: string) => {
    if (selectedCrops.some((c) => c.cropId === cropId)) return;
    setSelectedCrops((prev) => [...prev, { cropId, quantity: 300 }]);
  };

  const handleRemoveCrop = (cropId: string) => {
    if (selectedCrops.length === 1) return; // Keep at least one
    setSelectedCrops((prev) => prev.filter((c) => c.cropId !== cropId));
  };

  const handleQuantityChange = (cropId: string, qty: number) => {
    setSelectedCrops((prev) =>
      prev.map((c) => (c.cropId === cropId ? { ...c, quantity: Math.max(50, qty) } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postDemand({
      crops: selectedCrops,
      acceptExtra10Percent: acceptExtra10,
      pickupWindow,
      deliveryRequiredBy,
      deliveryDate: targetDeliveryDate,
      buyerName
    });
  };

  const totalEstimatedValue = selectedCrops.reduce((sum, item) => {
    const crop = crops.find((c) => c.id === item.cropId);
    return sum + item.quantity * (crop?.currentLivePrice || 22);
  }, 0);

  const totalKg = selectedCrops.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              Post Buyer Demand
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Demand-First Pooling
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Algorithmic Knapsack pooling discovers & aggregates nearby smallholder farmer lots
          </p>
        </div>

        {/* Live APMC Benchmark vs Mitti2Market Savings Ticker */}
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-2xl text-xs">
          <div className="space-y-0.5">
            <div className="text-[10px] text-stone-400 font-mono">APMC Mandi</div>
            <div className="font-mono font-bold text-stone-600 line-through">₹24.50/kg</div>
          </div>
          <div className="h-6 w-px bg-stone-200" />
          <div className="space-y-0.5">
            <div className="text-[10px] text-emerald-700 font-bold uppercase">Mitti2Market Pool</div>
            <div className="font-mono font-extrabold text-emerald-800">₹22.00/kg</div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-300">
            Save 10.2% (₹2.50/kg)
          </span>
        </div>
      </div>

      {/* Quick Demo Presets for Evaluator */}
      <div className="flex items-center gap-2 flex-wrap text-xs bg-emerald-50/50 p-2.5 rounded-2xl border border-emerald-200">
        <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Quick Demand Presets:
        </span>
        <button
          type="button"
          onClick={() => {
            setSelectedCrops([{ cropId: 'crop-tomato', quantity: 1000 }]);
            setBuyerName('Nature Fresh Supermarkets Ltd');
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] transition shadow-2xs cursor-pointer"
        >
          1,000 kg Tomato (SIH Standard Pool)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCrops([{ cropId: 'crop-tomato', quantity: 500 }]);
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium text-[11px] transition cursor-pointer"
        >
          500 kg Tomato
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCrops([
              { cropId: 'crop-tomato', quantity: 700 },
              { cropId: 'crop-chilli', quantity: 300 }
            ]);
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium text-[11px] transition cursor-pointer"
        >
          Multi-Crop: 700kg Tomato + 300kg Chilli
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Buyer Entity Name & Buyer Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Procuring Entity / Buyer
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Buyer Category / Facility Type
            </label>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Wholesaler / Retail Supermarket Chain</span>
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">Verified B2B</span>
            </div>
          </div>
        </div>

        {/* Selected Crops Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Selected Commodities in Demand ({selectedCrops.length})
            </span>
            {/* Quick Add Available Crops */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-stone-400">Add Crop:</span>
              {crops.map((c) => {
                const isSelected = selectedCrops.some((sc) => sc.cropId === c.id);
                if (isSelected) return null;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAddCrop(c.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 text-[11px] font-semibold transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{c.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCrops.map((item) => {
              const crop = crops.find((c) => c.id === item.cropId) || crops[0];
              const estValue = item.quantity * crop.currentLivePrice;

              return (
                <div
                  key={item.cropId}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-14 h-14 rounded-xl object-cover shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-slate-900 text-sm">{crop.name}</h4>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            LIVE
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono font-bold text-xs text-slate-800">
                            Live Price: ₹{crop.currentLivePrice.toFixed(1)}/kg
                          </span>
                          <span className="text-[10px] text-stone-400">
                            (Updated 2 min ago)
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedCrops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCrop(item.cropId)}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-stone-200 cursor-pointer"
                        title="Remove crop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Quantity Input & Value */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/80 items-center">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-400 mb-0.5">
                        Demand Quantity (kg)
                      </label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.cropId, Number(e.target.value))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400 uppercase font-bold">Estimated Produce Value</div>
                      <div className="text-sm font-extrabold font-mono text-emerald-800">
                        ₹{Math.round(estValue).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 10% Extra Aggregation Tolerance Toggle */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptExtra"
            checked={acceptExtra10}
            onChange={(e) => setAcceptExtra10(e.target.checked)}
            className="mt-1 h-4 w-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="acceptExtra" className="text-xs cursor-pointer">
            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Will you accept up to 10% extra quantity if aggregation helps fulfil the order?
            </span>
            <span className="text-emerald-800 block text-[11px] mt-0.5 leading-relaxed">
              Allows the pooling engine to incorporate fractional farmer lots (e.g. 50–100 kg surplus) without leaving unharvested crops behind.
            </span>
          </label>
        </div>

        {/* Enhanced 3 Fulfillment Schedule Boxes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/90 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fulfillment & Delivery Windows (3 Schedule Parameters)</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Fresh Harvest Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Box 1: Target Delivery Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Delivery Date</span>
              </label>
              <select
                value={targetDeliveryDate}
                onChange={(e) => setTargetDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
              >
                <option value="Tomorrow 4:00 AM">Tomorrow 4:00 AM (Default - Morning Harvest)</option>
                <option value="Tomorrow Evening (4:00 PM)">Tomorrow Evening (4:00 PM)</option>
                <option value="After 2 Days (Morning 4:00 AM)">After 2 Days (Morning 4:00 AM)</option>
                <option value="After 3 Days (Weekend Delivery)">After 3 Days (Weekend Delivery)</option>
                <option value="Same-Day Express (06:00 PM)">Same-Day Express (06:00 PM)</option>
              </select>
              <span className="text-[10px] text-stone-400 mt-1 block">Default: Tomorrow 4:00 AM fresh harvest dispatch</span>
            </div>

            {/* Box 2: Preferred Farm-Gate Pickup Window */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Preferred Farm Pickup Window</span>
              </label>
              <input
                type="text"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                placeholder="Type alphanumeric slot..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
              />
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                {['4:00 AM – 5:00 AM', '5:00 AM – 6:30 AM', 'Flexible Slot'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPickupWindow(preset)}
                    className={`text-[9px] px-1.5 py-0.5 rounded border font-mono transition cursor-pointer ${
                      pickupWindow === preset
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Box 3: Delivery Required By */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Required By</span>
              </label>
              <select
                value={deliveryRequiredBy}
                onChange={(e) => setDeliveryRequiredBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
              >
                <option value="7:00 AM">7:00 AM (Default - Early Wholesale Drop)</option>
                <option value="8:30 AM">8:30 AM (Retail Opening Slot)</option>
                <option value="11:00 AM">11:00 AM (Midday Supermarket Delivery)</option>
                <option value="2:00 PM">2:00 PM (Afternoon Restock)</option>
                <option value="6:00 PM">6:00 PM (Evening Distribution)</option>
              </select>
              <span className="text-[10px] text-stone-400 mt-1 block">Target delivery at Buyer Terminal / Facility (Wholesaler / Retailer)</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isMatchingActive}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isMatchingActive ? 'Scanning & Pooling Supply...' : 'POST DEMAND & START POOLING'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
