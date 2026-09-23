import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  Check,
  X,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  DollarSign,
  Bell,
  Wifi,
  Battery,
  ChevronRight
} from 'lucide-react';
import { sounds } from '../../utils/audioChimes';

export const SmartphoneSimulator: React.FC = () => {
  const {
    farmers,
    selectedFarmerId,
    activeDemand,
    poolContributors,
    farmerAccept,
    farmerReject,
    farmerCounterOffer,
    fleet
  } = useDemo();

  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterValue, setCounterValue] = useState(farmer.offeredRate + 1);

  const isDelivered = fleet.deliveryStatus === 'DELIVERED';
  const contributor = poolContributors.find((c) => c.farmerId === farmer.id);
  const allocatedQty = contributor ? contributor.allocatedQty : farmer.todayAvailableQty;
  const totalPayout = allocatedQty * farmer.offeredRate;

  const handleAccept = () => {
    sounds.playNotificationChime();
    farmerAccept(farmer.id);
  };

  const handleReject = () => {
    farmerReject(farmer.id, 'Delayed harvesting / equipment unavailable');
  };

  const handleSendCounter = () => {
    farmerCounterOffer(farmer.id, counterValue);
    setShowCounterInput(false);
  };

  return (
    <div className="flex justify-center p-2">
      {/* Smartphone Frame */}
      <div className="w-full max-w-[340px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-stone-800 relative">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
          <span className="w-2 h-2 rounded-full bg-slate-800"></span>
        </div>

        {/* Screen Content */}
        <div className="bg-stone-50 rounded-[34px] overflow-hidden min-h-[560px] flex flex-col justify-between text-slate-800 text-xs border border-stone-800 relative">
          {/* Status Bar */}
          <div className="bg-stone-900 text-white px-5 pt-3 pb-2 flex justify-between items-center text-[10px] font-mono">
            <span>04:12 AM</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3" />
              <span>5G</span>
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* App Topbar */}
          <div className="bg-emerald-700 text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🌾</span>
              <div>
                <h4 className="font-extrabold text-xs">Mitti2Market Kisan App</h4>
                <p className="text-[10px] text-emerald-200">{farmer.name} • {farmer.village}</p>
              </div>
            </div>
            <div className="relative">
              <Bell className="w-4 h-4 text-emerald-100" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 animate-ping"></span>
            </div>
          </div>

          {/* Incoming Push Notification Banner upon 100% Settlement */}
          {isDelivered && farmer.status === 'Accepted' && (
            <div className="mx-3 mt-2 p-3 bg-stone-900/95 text-white rounded-2xl shadow-xl border border-stone-700 animate-in slide-in-from-top-4 duration-300 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Bell className="w-3 h-3 text-amber-400 fill-current animate-pulse" />
                  <span>BANK / UPI ALERT</span>
                </div>
                <span className="font-mono">Just Now</span>
              </div>
              <div className="text-xs font-extrabold text-white">
                ₹{totalPayout.toLocaleString('en-IN')} Credited to Account
              </div>
              <p className="text-[10px] text-stone-300 leading-snug">
                Your Bank/UPI account has been credited with ₹{totalPayout.toLocaleString('en-IN')}. Remaining 30% balance for Order #MM1024 is settled!
              </p>
            </div>
          )}

          {/* Screen Body */}
          <div className="p-4 flex-1 space-y-3 overflow-y-auto">
            {/* If Order Completed / Delivered: Show Payment Credited Notification Card */}
            {isDelivered && farmer.status === 'Accepted' ? (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-300 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-xs">Payment Update — 100% Credited</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-bold block uppercase tracking-wider">Total Disbursed Earnings</span>
                  <div className="text-2xl font-extrabold text-emerald-900 font-mono">
                    ₹{totalPayout.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="space-y-1.5 p-2.5 rounded-xl bg-white border border-emerald-200 text-[11px]">
                  <div className="flex justify-between items-center text-emerald-900 font-medium">
                    <span>Milestone 1 (70% Farm-Gate):</span>
                    <span className="font-mono font-bold">₹{Math.round(totalPayout * 0.7).toLocaleString('en-IN')} ✓</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-900 font-medium">
                    <span>Milestone 2 (30% Doorstep):</span>
                    <span className="font-mono font-bold">₹{(totalPayout - Math.round(totalPayout * 0.7)).toLocaleString('en-IN')} ✓</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-950 font-extrabold border-t border-emerald-100 pt-1">
                    <span>Total Settlement:</span>
                    <span className="font-mono text-emerald-700">100% Settled</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Funds transferred directly to your Aadhaar-linked Bank/UPI account for {allocatedQty} kg {farmer.todayCrop}.
                </p>
                <div className="text-[10px] text-stone-500 font-mono pt-1 border-t border-emerald-200">
                  Order #MM1024 • Surat APMC Fulfillment
                </div>
              </div>
            ) : farmer.status === 'Accepted' ? (
              <div className="bg-white rounded-2xl p-4 border border-emerald-300 shadow-xs space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h5 className="font-extrabold text-emerald-950 text-sm">Order Accepted ✓</h5>
                <p className="text-stone-600 text-[11px]">
                  Pickup scheduled for <strong>4:00 AM – 5:00 AM</strong>. Driver Arjun Singh will arrive with refrigerated truck.
                </p>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                  70% Escrow will be released immediately after farm-gate quality verification.
                </div>
              </div>
            ) : farmer.status === 'Rejected' ? (
              <div className="bg-white rounded-2xl p-4 border border-rose-300 shadow-xs space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-lg font-bold">
                  ✕
                </div>
                <h5 className="font-extrabold text-rose-950 text-sm">Demand Rejected</h5>
                <p className="text-stone-500 text-[11px]">
                  You declined this fulfillment request. The platform automatically re-routed supply to nearby standby reserves.
                </p>
              </div>
            ) : (
              /* New Buyer Demand Card */
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                    New Buyer Demand Alert
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">Just Now</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {farmer.todayCrop} — {allocatedQty} kg Required
                  </h4>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Buyer: <span className="font-semibold text-slate-800">Mitti2Market Institutional Buyer</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400">Farm Gate Pickup:</span>
                    <div className="font-bold text-slate-800">4:00 AM Window</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Offered Rate:</span>
                    <div className="font-bold text-emerald-700 font-mono">₹{farmer.offeredRate}/kg</div>
                  </div>
                </div>

                {/* Savings vs Mandi */}
                <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-900 text-[10px] font-bold flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Estimated +18% higher return vs today's local trader mandi rate</span>
                </div>

                {/* Counter Offer Input if toggled */}
                {showCounterInput ? (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="block text-[10px] font-bold text-slate-700">
                      Your Proposed Rate (₹/kg):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        value={counterValue}
                        onChange={(e) => setCounterValue(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono font-bold"
                      />
                      <button
                        onClick={handleSendCounter}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Action Buttons: ACCEPT, REJECT, COUNTER OFFER */
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleAccept}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ACCEPT</span>
                      </button>

                      <button
                        onClick={handleReject}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>REJECT</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setShowCounterInput(true)}
                      className="w-full py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] transition cursor-pointer"
                    >
                      COUNTER OFFER
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation Pill */}
          <div className="bg-stone-100 p-2.5 text-center border-t border-stone-200">
            <div className="w-20 h-1 bg-stone-400 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
