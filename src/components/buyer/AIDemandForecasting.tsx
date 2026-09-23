import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { MOCK_CROP_FORECASTS } from '../../data/aiIntelligenceData';
import {
  TrendingUp,
  BrainCircuit,
  Sparkles,
  BarChart3,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';

export const AIDemandForecasting: React.FC = () => {
  const { applyForecastDemand, isMatchingActive } = useDemo();
  const [selectedCropId, setSelectedCropId] = useState<string>('crop-tomato');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const forecast = MOCK_CROP_FORECASTS[selectedCropId] || MOCK_CROP_FORECASTS['crop-tomato'];
  const maxDemand = Math.max(...forecast.weeklyTrend.map((t) => t.predictedDemandKg));

  const handleApply = () => {
    applyForecastDemand(forecast.cropId, forecast.recommendedBatchKg);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Predictive Demand & Market Intelligence</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>AI Demand Forecasting Engine</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
              v3.1 Regressor
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            APMC Gujarat Mandi arrival &amp; price predictor. Flags local cluster deficits and calculates cost-effective procurement schedules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-stone-400 font-bold">Predictive Accuracy</div>
            <div className="font-mono text-base font-extrabold text-emerald-700">{forecast.modelConfidence}%</div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition cursor-pointer"
          >
            {isExpanded ? 'Collapse ▲' : 'Inspect Forecast ▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Crop Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {Object.values(MOCK_CROP_FORECASTS).map((item) => {
              const isSelected = selectedCropId === item.cropId;
              return (
                <button
                  key={item.cropId}
                  onClick={() => setSelectedCropId(item.cropId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-slate-900'
                  }`}
                >
                  <span>{item.cropName.split(' ')[0]}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 text-emerald-300' : 'bg-stone-200/70 text-stone-600'
                    }`}
                  >
                    +{item.priceTrendPercent}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* 7-Day Predictive Consumption & Spot Price Graph */}
          <div className="p-5 rounded-2xl bg-stone-50/90 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>7-Day Projected Institutional Demand (Surat Cluster)</span>
              </span>
              <div className="flex items-center gap-3 text-[11px] font-medium text-stone-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Recommended Window
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> Projected Volume
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Supply Deficit Risk
                </span>
              </div>
            </div>

            {/* Clean Modern Bar Chart Visualization */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end pt-5 pb-2 min-h-[140px]">
              {forecast.weeklyTrend.map((point, idx) => {
                const heightPercent = Math.max(18, Math.round((point.predictedDemandKg / maxDemand) * 100));
                const isTargetDay = point.day.includes('Target') || idx === 3;
                const isShortage = point.supplyStatus === 'Shortage Risk';

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 group">
                    <span className={`text-[11px] font-mono font-bold ${isTargetDay ? 'text-emerald-700' : 'text-slate-700'}`}>
                      ₹{point.predictedPrice.toFixed(0)}/kg
                    </span>

                    <div className="w-full bg-stone-200/70 rounded-xl h-28 flex items-end p-1 relative">
                      <div
                        className={`w-full rounded-lg transition-all duration-300 ${
                          isTargetDay
                            ? 'bg-emerald-600 shadow-sm'
                            : isShortage
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : 'bg-slate-400 hover:bg-slate-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>

                      {isTargetDay && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded font-mono shadow-xs uppercase tracking-wider whitespace-nowrap">
                          Optimal Buy
                        </div>
                      )}
                    </div>

                    <div className="text-center font-mono">
                      <div className={`text-[11px] font-bold ${isTargetDay ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {point.day.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-stone-500">{point.predictedDemandKg} kg</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Intelligence Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Insight 1: Strategic Price Arbitrage */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>AI Market Recommendation</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {forecast.aiInsight}
              </p>
            </div>

            {/* Insight 2: Cluster Supply Readiness */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cluster Supply Readiness</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {forecast.clusterSupplySummary}
              </p>
            </div>
          </div>

          {/* Action Callout Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 shadow-2xs shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">Recommended Requisition Batch</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {forecast.recommendedBatchKg.toLocaleString('en-IN')} kg {forecast.cropName} • {forecast.recommendedPurchaseWindow}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={isMatchingActive}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition shrink-0 self-end sm:self-auto"
            >
              <span>Apply AI Forecast to Requisition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
