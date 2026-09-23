import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, Bell, CheckCircle2, XCircle, Percent, ShieldCheck } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const { farmers, poolContributors, activeDemand, consolidatedInvoice } = useDemo();

  const totalFarmers = farmers.length;
  const notified = poolContributors.length;
  const accepted = poolContributors.filter((c) => c.status === 'Accepted').length;
  const rejected = farmers.filter((f) => f.status === 'Rejected').length;

  const targetKg = activeDemand ? activeDemand.targetTotalKg : 1000;
  const acceptedKg = poolContributors
    .filter((c) => c.status === 'Accepted')
    .reduce((sum, c) => sum + c.allocatedQty, 0);

  const poolFilledPercent = Math.min(100, Math.round((acceptedKg / targetKg) * 100));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* 15 Farmers in Network */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-extrabold uppercase text-stone-400">Farmers in Network</div>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{totalFarmers}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Surat Agro Belt</div>
        </div>
        <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* X Notified */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-extrabold uppercase text-stone-400">Notified Supply</div>
          <div className="text-xl font-extrabold text-blue-700 font-mono mt-1">{notified}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Push / IVR Dispatched</div>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
          <Bell className="w-5 h-5" />
        </div>
      </div>

      {/* X Accepted */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-extrabold uppercase text-stone-400">Accepted</div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">{accepted}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">{acceptedKg} kg Confirmed</div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* X Rejected */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-extrabold uppercase text-stone-400">Rejected / Failover</div>
          <div className="text-xl font-extrabold text-rose-700 font-mono mt-1">{rejected}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Auto-Replaced by Standby</div>
        </div>
        <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
          <XCircle className="w-5 h-5" />
        </div>
      </div>

      {/* X% Pool Filled */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <div className="text-[10px] font-extrabold uppercase text-stone-400">Pool Filled</div>
          <div className="text-xl font-extrabold text-purple-700 font-mono mt-1">
            {poolFilledPercent}%
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            {acceptedKg} / {targetKg} kg
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
          <Percent className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
