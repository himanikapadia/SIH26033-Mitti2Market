import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastSystem: React.FC = () => {
  const { toasts, dismissToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const severityStyles = {
          success: 'bg-emerald-900/95 text-white border-emerald-700 shadow-emerald-950/20',
          warning: 'bg-amber-900/95 text-white border-amber-700 shadow-amber-950/20',
          error: 'bg-rose-900/95 text-white border-rose-700 shadow-rose-950/20',
          info: 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/20'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-2 ${
              severityStyles[toast.severity] || severityStyles.info
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.severity === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
              {toast.severity === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
              {toast.severity === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
