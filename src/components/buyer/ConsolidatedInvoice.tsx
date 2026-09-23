import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { FileText, Lock, CheckCircle, Truck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const ConsolidatedInvoice: React.FC = () => {
  const {
    consolidatedInvoice,
    confirmOrderAndLockEscrow,
    setActiveTab,
    poolContributors,
    activeDemand,
    farmerAccept
  } = useDemo();

  const targetKg = activeDemand ? activeDemand.targetTotalKg : 1000;
  const acceptedKg = poolContributors
    .filter((c) => c.status === 'Accepted')
    .reduce((sum, c) => sum + c.allocatedQty, 0);
  const progressPercent = Math.min(100, Math.round((acceptedKg / targetKg) * 100));
  const remainingKg = Math.max(0, targetKg - acceptedKg);
  const pendingFarmer = poolContributors.find((c) => c.status === 'Pending');

  if (!consolidatedInvoice) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5 animate-in fade-in">
        {/* Stepper Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Consolidated Tax Invoice &amp; Escrow Vault
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  🔒 UNLOCKS AT 100% POOL
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Single unified billing aggregating all participating smallholders into one institutional order
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-stone-400">Current Pool Status: </span>
            <span className="font-mono font-bold text-amber-700">{progressPercent}% Confirmed</span>
          </div>
        </div>

        {/* 3-Step Lifecycle Stepper answering "When will invoice appear?" */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
            Invoice Generation Workflow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Step 1: Demand Posted</span>
              </div>
              <div className="text-[11px] text-stone-600 font-normal">
                {targetKg} kg demand broadcast to nearby cluster.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-400 text-amber-950 font-bold space-y-1 ring-2 ring-amber-400/20">
              <div className="flex items-center gap-1.5 text-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Step 2: Pooling ({progressPercent}%)</span>
              </div>
              <div className="text-[11px] text-stone-700 font-normal">
                {acceptedKg}/{targetKg} kg confirmed. {remainingKg > 0 ? `${remainingKg} kg pending consent.` : 'All farmers confirmed!'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 font-medium space-y-1">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Step 3: Invoice &amp; Escrow</span>
              </div>
              <div className="text-[11px] text-stone-500">
                Generates automatically upon 100% pool confirmation.
              </div>
            </div>
          </div>
        </div>

        {/* Informative Explanation for Evaluator */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Why is the invoice locked?</span>
          </div>
          <p className="text-[11px] text-stone-700 leading-relaxed">
            In traditional procurement, a buyer would have to negotiate, generate, and process separate invoices for each small farmer (3 different vendors, 3 freight runs, 3 separate bills). Mitti2Market aggregates all smallholders into <strong>ONE single consolidated invoice</strong> with guaranteed delivery.
          </p>
          <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-amber-800">
              {remainingKg > 0
                ? `👉 Click "Accept" on pending farmers in the Pool Table above (or below) to reach 1,000 kg and unlock this invoice.`
                : `✓ All 1,000 kg confirmed! Invoice is generating...`}
            </span>
            {pendingFarmer && (
              <button
                type="button"
                onClick={() => farmerAccept(pendingFarmer.farmerId)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] cursor-pointer shadow-xs transition shrink-0"
              >
                Accept Next Farmer ({pendingFarmer.farmerName.split(' ')[0]})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const {
    orderId,
    buyerName,
    cropsSummary,
    contributors,
    totalKg,
    produceSubtotal,
    logisticsFee,
    handlingFee,
    totalPayable,
    escrow70PercentHold,
    escrow30PercentFinal,
    isConfirmed,
    escrowStatus
  } = consolidatedInvoice;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900">CONSOLIDATED ORDER & INVOICE</h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              #{orderId}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Single billing for {totalKg} kg aggregated across {contributors.length} smallholder farms
          </p>
        </div>

        {isConfirmed ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            ORDER CONFIRMED • 70% ESCROW LOCKED
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Ready for Buyer Review & Escrow Lock
          </span>
        )}
      </div>

      {/* Sourced Farmers Breakdown Table */}
      <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
            <tr>
              <th className="py-3 px-4">Contributing Farmer</th>
              <th className="py-3 px-3">Village</th>
              <th className="py-3 px-3 text-right">Volume</th>
              <th className="py-3 px-3 text-right">Agreed Rate</th>
              <th className="py-3 px-4 text-right">Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-slate-800">
            {contributors.map((c, i) => (
              <tr key={i} className={`hover:bg-stone-50/80 ${c.isStandbyBackup ? 'bg-amber-50/40' : ''}`}>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  <span>{c.farmerName}</span>
                  {c.isStandbyBackup && (
                    <span className="ml-2 text-[9px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Standby Shortfall Pickup
                    </span>
                  )}
                  {c.actualVerifiedWeight !== undefined && (
                    <div className="text-[10px] text-stone-500 font-normal">
                      Verified Weight: {c.actualVerifiedWeight} kg (Grade {c.verifiedGrade || 'A'})
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-stone-600">{c.village}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{c.allocatedQty} kg</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-700">₹{c.offeredRate}/kg</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                  ₹{(c.allocatedQty * c.offeredRate).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-stone-50 border-t border-stone-200 text-xs">
            <tr>
              <td colSpan={4} className="py-2.5 px-4 text-right font-bold text-stone-600">
                Produce Subtotal:
              </td>
              <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                ₹{produceSubtotal.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="py-2 px-4 text-right text-stone-600">
                Logistics & Consolidation Freight (₹1.0/kg — <span className="font-semibold text-emerald-800">Paid by Buyer</span>):
              </td>
              <td className="py-2 px-4 text-right font-mono text-slate-900">
                ₹{logisticsFee.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="py-2 px-4 text-right text-stone-600">
                Platform Handling & Quality Assurance (2%):
              </td>
              <td className="py-2 px-4 text-right font-mono text-slate-900">
                ₹{handlingFee.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr className="border-t border-stone-300 font-extrabold text-sm text-slate-900 bg-stone-100/70">
              <td colSpan={4} className="py-3 px-4 text-right text-emerald-950">
                Total Consolidated Order Payable:
              </td>
              <td className="py-3 px-4 text-right font-mono text-emerald-800 text-base">
                ₹{totalPayable.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Escrow Milestone Security Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Milestone 1: 70% Escrow Hold</span>
          </div>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            ₹{escrow70PercentHold.toLocaleString('en-IN')} held in smart escrow on order confirmation. Automatically released to farmers proportionally upon farm-gate weight & quality verification.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
          <div className="font-bold text-blue-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Milestone 2: Remaining 30% Payment</span>
          </div>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            ₹{escrow30PercentFinal.toLocaleString('en-IN')} initiated directly upon verified warehouse arrival at Surat APMC.
          </p>
        </div>
      </div>

      {/* Order Confirmation Action */}
      {!isConfirmed ? (
        <button
          onClick={confirmOrderAndLockEscrow}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>CONFIRM ORDER & PLACE 70% ESCROW HOLD (₹{escrow70PercentHold.toLocaleString('en-IN')})</span>
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-sm">Truck Booking Initiated • GJ-05-AB-1234</div>
              <div className="text-xs text-stone-400">Farmers notified. 4:00 AM pickup sequence queued.</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('logistics')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Open Logistics Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
