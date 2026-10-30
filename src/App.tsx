/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CitizenHome } from './components/citizen/CitizenHome';
import { OperationsDashboard } from './components/dashboard/OperationsDashboard';
import { CreateComplaintModal } from './components/citizen/CreateComplaintModal';
import { Loader2, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, isLoading, error } = useApp();
  const [activeNav, setActiveNav] = useState<string>('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-3" />
        <h2 className="text-base font-bold tracking-tight">MAHALLA OS yuklanmoqda...</h2>
        <p className="text-xs text-slate-400 mt-1">
          Namangan shahri pilot ma'lumotlari va GIS tarmog'i sinxronlashtirilmoqda
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="p-6 bg-slate-800 rounded-2xl border border-rose-500/30 max-w-md text-center space-y-3">
          <p className="text-sm text-rose-400 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 rounded-lg text-xs font-semibold"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Universal Top Header adhering strictly to Top Bar Contract */}
      <Header activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {viewMode === 'CITIZEN' ? (
          <CitizenHome />
        ) : (
          <OperationsDashboard activeTab={activeNav} />
        )}
      </main>

      {/* Global Create Complaint Modal */}
      <CreateComplaintModal />

      {/* Universal Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">MAHALLA OS</span>
            <span className="mx-2">·</span>
            <span>"Mahallamiz muammosiz, shahrimiz aqlli."</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Namangan Pilot (Davlatobod & Yangi Namangan)</span>
            <span>·</span>
            <span>SaaS & GovTech Platform</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
