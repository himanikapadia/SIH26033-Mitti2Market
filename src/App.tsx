import React from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Header } from './components/common/Header';
import { ToastSystem } from './components/common/ToastSystem';
import { AutoDemoGuideHUD } from './components/common/AutoDemoGuideHUD';
import { BuyerPortal } from './components/buyer/BuyerPortal';
import { FarmerModule } from './components/farmer/FarmerModule';
import { LogisticsPortal } from './components/logistics/LogisticsPortal';
import { AdminConsole } from './components/admin/AdminConsole';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useDemo();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Header */}
      <Header />

      {/* Module Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'buyer' && <BuyerPortal />}
        {activeTab === 'farmer' && <FarmerModule />}
        {activeTab === 'logistics' && <LogisticsPortal />}
        {activeTab === 'admin' && <AdminConsole />}
      </main>

      {/* Auto Demo Guided Tour HUD */}
      <AutoDemoGuideHUD />

      {/* Global Toast System */}
      <ToastSystem />

      {/* Hackathon Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              🌾
            </div>
            <span className="font-extrabold text-slate-900">Mitti2Market</span>
            <span className="text-stone-400">•</span>
            <span className="text-emerald-800 font-semibold">Small Farms. One Powerful Market.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Smart Escrow Guaranteed
            </span>
            <span className="text-stone-300">•</span>
            <span>Smart India Hackathon Prototype</span>
            <span className="text-stone-300">•</span>
            <span className="font-mono text-stone-400">Surat Cluster Demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <DemoProvider>
      <MainLayout />
    </DemoProvider>
  );
}

export default App;
