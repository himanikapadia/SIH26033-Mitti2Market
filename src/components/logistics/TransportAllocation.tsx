import React from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  Truck,
  ShieldCheck,
  Thermometer,
  User,
  Phone,
  Weight,
  Sparkles,
  Gauge,
  Droplets,
  BatteryCharging,
  Award,
  FileCheck2
} from 'lucide-react';

export const TransportAllocation: React.FC = () => {
  const { fleet, consolidatedInvoice } = useDemo();

  const loadPercent = Math.min(100, Math.round((fleet.currentLoadKg / fleet.capacityKg) * 100));

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Vehicle & Fleet Allocation</h3>
            <p className="text-[10px] text-stone-500 font-mono">Consolidated Cold-Chain Logistics Hub</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {fleet.vehicleNumber}
          </span>
          <span className="text-[10px] text-stone-400 block font-mono mt-0.5">Surat APMC Fleet</span>
        </div>
      </div>

      {/* Freshness Banner for Perishable Crop Scheduling */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 flex items-start gap-2.5 text-xs">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-emerald-950 block">
            Cold-Chain Freshness Lock (4:00 AM – 5:00 AM Window)
          </span>
          <p className="text-emerald-900 text-[11px] mt-0.5 leading-relaxed">
            Harvest pickup is scheduled before sunrise to preserve tomato cellular firmness and prevent heat respiration loss. Target delivery at Surat APMC: <strong>{fleet.estimatedDeliveryTime || '06:30 AM'}</strong>.
          </p>
        </div>
      </div>

      {/* Live Reefer Telemetry Strip */}
      <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-stone-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-stone-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            <Gauge className="w-3.5 h-3.5" />
            Live Container Telemetry
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sensors Online
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-900 border border-stone-800">
            <div className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" />
              Reefer
            </div>
            <div className="text-sm font-extrabold font-mono text-cyan-300 mt-0.5">
              {fleet.reeferTempC || 17.8}°C
            </div>
            <span className="text-[9px] text-emerald-400 font-medium">Optimal</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-stone-800">
            <div className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              Humidity
            </div>
            <div className="text-sm font-extrabold font-mono text-blue-300 mt-0.5">
              {fleet.reeferHumidityPercent || 88}%
            </div>
            <span className="text-[9px] text-stone-400 font-medium">Anti-Wilt</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-stone-800">
            <div className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-center gap-1">
              <Truck className="w-3 h-3 text-amber-400" />
              Speed
            </div>
            <div className="text-sm font-extrabold font-mono text-amber-300 mt-0.5">
              {fleet.speedKmH ? `${fleet.speedKmH}` : '0'} <span className="text-[9px]">km/h</span>
            </div>
            <span className="text-[9px] text-stone-400 font-medium">{fleet.speedKmH ? 'In Transit' : 'At Gate'}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-stone-800">
            <div className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-400" />
              Aux Reefer
            </div>
            <div className="text-sm font-extrabold font-mono text-emerald-300 mt-0.5">
              {fleet.fuelBatteryPercent || 84}%
            </div>
            <span className="text-[9px] text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Fleet Specs Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Fleet Partner */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Fleet Partner</div>
          <div className="font-extrabold text-slate-900 text-sm">{fleet.fleetPartner}</div>
          <div className="text-[11px] text-stone-500 font-medium">{fleet.vehicleType}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold pt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>FSSAI Cold-Chain Certified • 99.2% SLA</span>
          </div>
        </div>

        {/* Driver Dossier */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Assigned Driver</div>
          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>{fleet.driverName}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
              ★ {fleet.driverRating || 4.9}
            </span>
          </div>
          <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
            <Phone className="w-3 h-3 text-stone-400" />
            <span>{fleet.driverPhone}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-blue-700 font-bold pt-1">
            <Award className="w-3 h-3 text-blue-600" />
            <span>Agmark Level 2 QC Inspector</span>
          </div>
        </div>

        {/* Capacity Utilization */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Cargo Capacity</span>
            <span className="font-mono text-xs font-bold text-slate-900">
              {fleet.currentLoadKg} / {fleet.capacityKg} kg
            </span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${loadPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-500">
            <span>{loadPercent}% Bay Utilized</span>
            <span className="text-emerald-700 font-semibold">{fleet.capacityKg - fleet.currentLoadKg} kg Reserve</span>
          </div>
        </div>

        {/* Transport Cost Model */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Transport Pricing Model</div>
          <div className="font-extrabold font-mono text-emerald-800 text-sm">
            ₹{fleet.transportFeePerKg.toFixed(1)} / kg
          </div>
          <div className="text-[11px] text-emerald-900 font-semibold flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid 100% by BUYER</span>
          </div>
          <div className="text-[10px] text-stone-500">
            Farmer transport cost: <strong>₹0.00</strong> (Farm-gate pickup)
          </div>
        </div>
      </div>
    </div>
  );
};
