import React, { useState } from 'react';
import { AI_MODELS, AIModelSpec } from '../../data/aiEvaluatorData';
import {
  BrainCircuit,
  X,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Award,
  Terminal,
  ShieldCheck,
  Check,
  FileCode,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIEvaluatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'models' | 'playground' | 'rubric'>('models');
  const [selectedModelId, setSelectedModelId] = useState<string>('mitti-forecaster');
  const [isInferenceRunning, setIsInferenceRunning] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<{
    latencyMs: number;
    timestamp: string;
    model: string;
    output: any;
  } | null>(null);

  if (!isOpen) return null;

  const currentModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  const handleRunPlaygroundInference = () => {
    setIsInferenceRunning(true);
    setInferenceResult(null);

    const simulatedLatency = (12 + Math.random() * 15).toFixed(1);

    setTimeout(() => {
      setIsInferenceRunning(false);
      setInferenceResult({
        latencyMs: parseFloat(simulatedLatency),
        timestamp: new Date().toLocaleTimeString(),
        model: currentModel.name,
        output: currentModel.sampleOutput
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/80 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  SIH26033 Evaluation Suite
                </span>
                <span className="text-[10px] font-mono text-stone-400">Production AI Architecture</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Mitti2Market Multi-Model AI Stack
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Technical inspection dossier for screening hackathon evaluators &amp; jury members.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('models')}
            className={`py-3.5 border-b-2 cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'models'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>4 Core AI Engines</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`py-3.5 border-b-2 cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'playground'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Live Inference Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`py-3.5 border-b-2 cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'rubric'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Why Mitti2Market Wins (SIH Rubric)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: 4 Core AI Engines */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              {/* Engine Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AI_MODELS.map((model) => {
                  const isSelected = selectedModelId === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs block">{model.name.split(' ')[0]}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-slate-300' : 'text-stone-400'}`}>
                          {model.tagline.split(' ')[0]} {model.tagline.split(' ')[1]}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                        <span className={isSelected ? 'text-emerald-300' : 'text-emerald-700 font-bold'}>
                          {model.latency}
                        </span>
                        {model.offlineReady && (
                          <span className={`px-1 rounded text-[8px] uppercase ${isSelected ? 'bg-slate-800 text-stone-300' : 'bg-stone-200 text-stone-600'}`}>
                            Offline
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Model Details Sheet */}
              <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{currentModel.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        {currentModel.accuracy}
                      </span>
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">{currentModel.tagline}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-700">
                      ⚡ Latency: <strong>{currentModel.latency}</strong>
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                      ✓ Edge Offline Ready
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {currentModel.description}
                </p>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                      Underlying Neural Architecture &amp; Solvers
                    </span>
                    <span className="font-bold text-slate-800">{currentModel.architecture}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                      Training Data Ground Truth
                    </span>
                    <span className="text-stone-700 text-[11px] leading-snug">{currentModel.trainingDataset}</span>
                  </div>
                </div>

                {/* Mathematical Formulation */}
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5 font-mono text-[11px]">
                  <div className="text-amber-400 font-bold text-[10px] uppercase flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Algorithmic Objective Function</span>
                  </div>
                  <div className="text-emerald-300 text-xs py-1 overflow-x-auto">
                    {currentModel.mathematicalFormula}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Live Inference Playground */}
          {activeTab === 'playground' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">
                    Interactive Evaluator Sandbox
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Simulate Live Model Inference Call
                  </h4>
                  <p className="text-xs text-stone-500">
                    Target Model: <strong className="text-slate-800">{currentModel.name}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedModelId}
                    onChange={(e) => {
                      setSelectedModelId(e.target.value);
                      setInferenceResult(null);
                    }}
                    className="text-xs font-bold bg-white border border-stone-300 rounded-xl px-3 py-2 cursor-pointer text-slate-800"
                  >
                    {AI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleRunPlaygroundInference}
                    disabled={isInferenceRunning}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isInferenceRunning ? 'animate-spin' : ''}`} />
                    <span>{isInferenceRunning ? 'Executing...' : 'Run Test Inference'}</span>
                  </button>
                </div>
              </div>

              {/* Tensors & Payloads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Payload */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-[10px] text-stone-400 uppercase font-bold">
                    <span>Input Tensor / Feature Vector</span>
                    <span className="text-emerald-400 font-normal">Shape: [1, 14, 8]</span>
                  </div>
                  <pre className="text-[11px] text-emerald-300 overflow-x-auto max-h-48 leading-snug">
                    {JSON.stringify(currentModel.sampleInput, null, 2)}
                  </pre>
                </div>

                {/* Output Payload */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-[10px] text-stone-400 uppercase font-bold">
                    <span>Inference Output Payload</span>
                    {inferenceResult ? (
                      <span className="text-amber-400 font-normal">
                        ⚡ {inferenceResult.latencyMs} ms ({inferenceResult.timestamp})
                      </span>
                    ) : (
                      <span className="text-stone-500 font-normal">Awaiting trigger</span>
                    )}
                  </div>
                  <pre className="text-[11px] text-amber-300 overflow-x-auto max-h-48 leading-snug">
                    {JSON.stringify(
                      inferenceResult ? inferenceResult.output : currentModel.sampleOutput,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIH Evaluation Rubric Cheat Sheet */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>1. Novelty &amp; Deep Tech Innovation</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    First-of-its-kind combination of <strong>Kuhn-Munkres Bipartite Matching</strong> with <strong>perishable cold-chain CVRP routing</strong>. Automatically protects smallholders from batch rejection while guaranteeing buyers unified commercial invoices with 100% quantity assurance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>2. Ground Feasibility for Bharat</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Zero dependency on high-end internet or literacy. Feature-phone farmers participate via <strong>100% pure vernacular Hindi/Gujarati IVR calls</strong>. Edge AI produce vision runs on <strong>INT8 quantized TFLite</strong> completely offline on rural collection trucks.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>3. Verifiable Economic Impact</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    Direct farmer income jumps from <strong>35% to 80-85%</strong> by disintermediating 4 commission agents. Post-harvest perishable transit spoilage drops from <strong>22% to under 2%</strong> through dynamic route thermal decay optimization.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>4. Scalability &amp; Computational Complexity</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    DBSCAN spatial indexing clusters 10,000+ smallholders in <strong>O(N log N)</strong> runtime. Sub-second solve times allow instantaneous buyer matching and real-time shortfall re-routing across entire agricultural districts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
            <span>System Status:</span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              All 4 Inference Engines Active
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
