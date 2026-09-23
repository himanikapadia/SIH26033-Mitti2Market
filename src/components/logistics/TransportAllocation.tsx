import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Truck, ShieldCheck, Thermometer, User, Phone, Weight, Sparkles } from 'lucide-react';

export const TransportAllocation: React.FC = () => {
  const { fleet, consolidatedInvoice } = useDemo();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Transport & Vehicle Allocation</h3>
            <p className="text-[10px] text-stone-500 font-mono">Consolidated Multi-Stop Cold Fleet</p>
          </div>
        </div>
        <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          {fleet.vehicleNumber}
        </span>
      </div>

      {/* Freshness Banner for Perishable Crop Scheduling */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 flex items-start gap-2.5 text-xs">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-emerald-950 block">
            Perishable Crop Priority Route — Optimized for Freshness
          </span>
          <p className="text-emerald-900 text-[11px] mt-0.5 leading-relaxed">
            Pickup window: <strong>4:00 AM – 5:00 AM</strong> before peak sun. Direct farm-to-warehouse cold transit ensures 0% heat dehydration. Target delivery: <strong>6:00 – 7:00 AM</strong>.
          </p>
        </div>
      </div>

      {/* Fleet Specs Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-[10px] text-stone-400 font-bold uppercase">Fleet Partner</div>
          <div className="font-extrabold text-slate-900 mt-0.5">{fleet.fleetPartner}</div>
          <div className="text-[10px] text-stone-500">{fleet.vehicleType}</div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-[10px] text-stone-400 font-bold uppercase">Assigned Driver</div>
          <div className="font-extrabold text-slate-900 mt-0.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>{fleet.driverName}</span>
          </div>
          <div className="text-[10px] text-stone-500 flex items-center gap-1">
            <Phone className="w-3 h-3 text-stone-400" />
            <span>{fleet.driverPhone}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-[10px] text-stone-400 font-bold uppercase">Capacity & Current Load</div>
          <div className="font-extrabold font-mono text-slate-900 mt-0.5">
            {fleet.currentLoadKg} / {fleet.capacityKg} kg
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">Refrigerated Bay (18°C)</div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-[10px] text-stone-400 font-bold uppercase">Transport Cost Model</div>
          <div className="font-extrabold font-mono text-emerald-800 mt-0.5">
            ₹{fleet.transportFeePerKg.toFixed(1)} / kg
          </div>
          <div className="text-[10px] font-bold text-emerald-800">
            ✓ Paid by BUYER (Farmer pays ₹0)
          </div>
        </div>
      </div>
    </div>
  );
};
