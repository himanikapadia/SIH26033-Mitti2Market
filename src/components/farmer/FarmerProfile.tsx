import React from 'react';
import { useDemo } from '../../context/DemoContext';
import {
  MapPin,
  Phone,
  Languages,
  Award,
  Package,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Smartphone,
  PhoneCall
} from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  const { farmers, selectedFarmerId, activeDemand } = useDemo();
  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  const isMatched = activeDemand && activeDemand.crops.some(
    (c) => c.cropName.toLowerCase() === farmer.todayCrop.toLowerCase()
  );

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header Profile Photo & Name */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-700 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-700/20 font-bold shrink-0">
          🌾
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900">{farmer.name}</h3>
            {farmer.isStandby && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                Standby Reserve
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {farmer.village}, {farmer.location.taluka} ({farmer.location.district})
            </span>
            <span>•</span>
            <span className="font-mono text-emerald-700 font-bold">{farmer.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Badges: Phone Type & Language */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            {farmer.phoneType === 'SMARTPHONE' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <PhoneCall className="w-4 h-4" />
            )}
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase">Device Interface</span>
            <div className="font-extrabold text-slate-900">
              {farmer.phoneType === 'SMARTPHONE' ? 'Smartphone (App)' : 'Keypad Phone (IVR)'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase">Vernacular Dialect</span>
            <div className="font-extrabold text-slate-900">{farmer.preferredLanguage}</div>
          </div>
        </div>
      </div>

      {/* Today's Availability Card */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-emerald-950 uppercase tracking-wider">
            Today's Harvest Supply
          </span>
          <span className="font-mono font-bold text-emerald-800 text-sm">
            {farmer.todayAvailableQty} kg {farmer.todayCrop}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span>Offered Procurement Rate:</span>
          <span className="font-mono font-bold text-slate-900">₹{farmer.offeredRate}/kg</span>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span>Total Farm Gate Potential:</span>
          <span className="font-mono font-bold text-emerald-700">
            ₹{(farmer.todayAvailableQty * farmer.offeredRate).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Track Record & Trust Rating */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1 text-amber-500 mb-1">
            <Award className="w-4 h-4" />
            <span className="font-extrabold text-slate-900 font-mono">{farmer.rating} / 5.0</span>
          </div>
          <div className="text-[10px] text-stone-400">Quality Trust Score</div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1 text-blue-600 mb-1">
            <Package className="w-4 h-4" />
            <span className="font-extrabold text-slate-900 font-mono">
              {farmer.ordersCompleted} Orders
            </span>
          </div>
          <div className="text-[10px] text-stone-400">Batches Completed</div>
        </div>
      </div>

      {/* Crops Grown */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1.5 block">
          Crops Cultivated
        </span>
        <div className="flex flex-wrap gap-1.5">
          {farmer.cropsGrown.map((crop, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold"
            >
              {crop}
            </span>
          ))}
        </div>
      </div>

      {/* Current Demand Status */}
      <div className="pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-400">Demand Matching Status:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-full ${
              farmer.status === 'Accepted'
                ? 'bg-emerald-100 text-emerald-800'
                : farmer.status === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : farmer.status === 'Pending'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {farmer.status}
          </span>
        </div>
      </div>
    </div>
  );
};
