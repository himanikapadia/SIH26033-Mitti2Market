import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { MOCK_CROP_FORECASTS } from '../../data/aiIntelligenceData';
import {
  TrendingUp,
  BrainCircuit,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  BarChart3,
  Layers,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const AIDemandForecasting: React.FC = () => {
  const { applyForecastDemand, activeDemand, isMatchingActive } = useDemo();
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-800 text-xs font-semibold mb-2 border border-purple-500/25">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
            <span>AI Predictive Demand & Market Intelligence</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>AI Demand Forecasting Engine</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
              Model: MittiForecaster v3.1
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            LSTM &amp; Gradient-Boosted APMC Gujarat Mandi arrival regressor. Identifies supply deficits, predicts wholesale spot prices, and recommends optimal procurement batches.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-stone-400 font-bold">Predictive Accuracy</div>
            <div className="font-mono text-sm font-extrabold text-purple-700">{forecast.modelConfidence}%</div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition cursor-pointer"
          >
            {isExpanded ? 'Collapse ▲' : 'Inspect Forecast ▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Crop Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {Object.values(MOCK_CROP_FORECASTS).map((item) => (
              <button
                key={item.cropId}
                onClick={() => setSelectedCropId(item.cropId)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCropId === item.cropId
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{item.cropName.split(' ')[0]}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    selectedCropId === item.cropId ? 'bg-purple-900 text-purple-200' : 'text-stone-400'
                  }`}
                >
                  +{item.priceTrendPercent}%
                </span>
              </button>
            ))}
          </div>

          {/* 7-Day Predictive Consumption & Spot Price Graph */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-stone-900 to-slate-950 text-white border border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-mono text-amber-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                7-Day Projected Institutional Demand (Surat Cluster)
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono text-stone-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Balanced
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Shortage Risk
                </span>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="grid grid-cols-7 gap-2 items-end pt-4 pb-1 min-h-[140px]">
              {forecast.weeklyTrend.map((point, idx) => {
                const heightPercent = Math.round((point.predictedDemandKg / maxDemand) * 100);
                const isTargetDay = point.day.includes('Target') || idx === 3;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 group">
                    <span className="text-[10px] font-mono font-bold text-amber-300 opacity-90">
                      ₹{point.predictedPrice.toFixed(1)}
                    </span>
                    <div className="w-full bg-stone-800 rounded-xl h-24 flex items-end p-1 relative">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isTargetDay
                            ? 'bg-gradient-to-t from-emerald-500 to-amber-400 ring-2 ring-emerald-400/80 shadow-lg shadow-emerald-500/30'
                            : point.supplyStatus === 'Shortage Risk'
                            ? 'bg-gradient-to-t from-amber-600 to-rose-500'
                            : 'bg-gradient-to-t from-purple-700 to-indigo-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      {isTargetDay && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[8px] px-1 py-0.2 rounded font-mono shadow-xs uppercase">
                          Buy Now
                        </div>
                      )}
                    </div>
                    <div className="text-center font-mono">
                      <div className="text-[10px] font-bold text-slate-200">{point.day.split(' ')[0]}</div>
                      <div className="text-[9px] text-stone-400">{point.predictedDemandKg}kg</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Intelligence Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Insight 1: Strategic Price Arbitrage */}
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-950 text-xs">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                <span>AI Market Recommendation:</span>
              </div>
              <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
                {forecast.aiInsight}
              </p>
            </div>

            {/* Insight 2: Cluster Supply Readiness */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Cluster Supply Readiness:</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                {forecast.clusterSupplySummary}
              </p>
            </div>
          </div>

          {/* Action Callout Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Recommended Requisition Batch</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {forecast.recommendedBatchKg.toLocaleString('en-IN')} kg {forecast.cropName} • {forecast.recommendedPurchaseWindow}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={isMatchingActive}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-700/20 cursor-pointer transition shrink-0 self-end sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Apply AI Forecast to Requisition</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
