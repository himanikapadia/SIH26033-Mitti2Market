import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { MOCK_CROP_FORECASTS } from '../../data/aiIntelligenceData';
import {
  BrainCircuit,
  BarChart3,
  Clock,
  ArrowRight,
  TrendingUp
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
            <span>AI Predictive Demand &amp; Market Intelligence</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>AI Demand Forecasting Engine</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
              v3.1 Regressor
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            APMC Mandi arrival &amp; price predictor. Flags local cluster deficits and calculates cost-effective procurement schedules.
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
          <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>7-Day Projected Institutional Demand &amp; Mandi Spot Price Curve</span>
              </span>
              <div className="flex items-center gap-3 text-[11px] font-medium text-stone-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Optimal Window
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-stone-300"></span> Projected Volume
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Shortage Risk
                </span>
              </div>
            </div>

            {/* Well-proportioned, clean analytics chart */}
            <div className="max-w-2xl mx-auto py-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end">
                {forecast.weeklyTrend.map((point, idx) => {
                  const heightPercent = Math.max(24, Math.round((point.predictedDemandKg / maxDemand) * 100));
                  const isTargetDay = point.day.includes('Target') || idx === 3;
                  const isShortage = point.supplyStatus === 'Shortage Risk';

                  return (
                    <div key={idx} className="flex flex-col items-center group">
                      {/* Dedicated Top Badge Slot - Prevents ANY Overlap */}
                      <div className="h-6 flex items-center justify-center mb-1">
                        {isTargetDay ? (
                          <span className="bg-emerald-700 text-white font-black text-[9px] px-2 py-0.5 rounded-full font-mono shadow-xs uppercase tracking-wider whitespace-nowrap">
                            ★ Best Buy
                          </span>
                        ) : isShortage ? (
                          <span className="text-[9px] font-bold text-amber-700 font-mono">
                            High Rate
                          </span>
                        ) : (
                          <span className="h-4" />
                        )}
                      </div>

                      {/* Mandi Price Tag */}
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                          isTargetDay
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isShortage
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-white text-slate-700 border border-stone-200'
                        }`}
                      >
                        ₹{point.predictedPrice.toFixed(0)}/kg
                      </span>

                      {/* Proportional Column Bar */}
                      <div className="w-10 sm:w-12 bg-stone-200/60 rounded-xl h-28 flex items-end p-1 my-2 border border-stone-300/70 shadow-2xs">
                        <div
                          className={`w-full rounded-lg transition-all duration-300 ${
                            isTargetDay
                              ? 'bg-emerald-600 shadow-xs'
                              : isShortage
                              ? 'bg-amber-500'
                              : 'bg-stone-400/80 group-hover:bg-stone-500'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Day and Volume Label */}
                      <div className="text-center font-mono">
                        <div
                          className={`text-[11px] font-bold ${
                            isTargetDay ? 'text-emerald-800' : 'text-slate-800'
                          }`}
                        >
                          {point.day.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {point.predictedDemandKg} kg
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
