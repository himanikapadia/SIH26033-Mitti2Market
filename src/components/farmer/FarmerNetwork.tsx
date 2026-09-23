import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Smartphone, PhoneCall, Radio, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';

export const FarmerNetwork: React.FC = () => {
  const { farmers, selectedFarmerId, setSelectedFarmerId, activeDemand } = useDemo();
  const [searchTerm, setSearchTerm] = useState('');

  // Check if farmer matches active demand
  const isFarmerMatched = (cropName: string) => {
    if (!activeDemand) return false;
    return activeDemand.crops.some(
      (c) => c.cropName.toLowerCase() === cropName.toLowerCase()
    );
  };

  const filteredFarmers = farmers.filter((f) => {
    return (
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.todayCrop.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <span>Surat Farmer Network</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {farmers.length} Registered
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Select any farmer to view their live device simulation
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search village, name, crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium w-48"
          />
        </div>
      </div>

      {/* Farmers List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-xs">
        {filteredFarmers.map((f) => {
          const isSelected = selectedFarmerId === f.id;
          const matched = isFarmerMatched(f.todayCrop);

          return (
            <div
              key={f.id}
              onClick={() => setSelectedFarmerId(f.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-stone-50/60 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${
                    f.phoneType === 'SMARTPHONE'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {f.phoneType === 'SMARTPHONE' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <PhoneCall className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{f.name}</span>
                    {f.isStandby && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                        Standby
                      </span>
                    )}
                    {/* Red Alert Indicator as requested */}
                    {matched && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[9px] border border-rose-300 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        Demand Match
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {f.village} • {f.todayCrop} ({f.todayAvailableQty} kg) • ₹{f.offeredRate}/kg
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    f.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : f.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : f.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {f.status}
                </span>
                <div className="text-[10px] text-stone-400 mt-0.5">{f.preferredLanguage}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
