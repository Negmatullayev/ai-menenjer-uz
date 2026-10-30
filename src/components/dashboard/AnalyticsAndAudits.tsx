/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Shield,
  FileCheck,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const AnalyticsAndAudits: React.FC = () => {
  const { auditLogs, complaints, workOrders, buildings } = useApp();
  const [logSearch, setLogSearch] = useState<string>('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.actorName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  // Real metric calculations
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const resolutionRate = complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Analytics KPI Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs font-medium">Hal Qilish Samaradorligi</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {resolutionRate}%
          </p>
          <p className="text-[11px] text-slate-400">
            {resolvedCount} ta muammo foto-dalil bilan yopildi
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs font-medium">O'rtacha Hal Etish Vaqti</span>
          <p className="text-xl font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
            4.2 soat
          </p>
          <p className="text-[11px] text-slate-400">SLA me'yoridan 30% tezroq</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs font-medium">AI Dublikat Tejamkorligi</span>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono tabular-nums">
            35%
          </p>
          <p className="text-[11px] text-slate-400">Ortiqcha xizmat safarlari bartaraf etildi</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs font-medium">Fuqaro Qoniqish Ko'rsatkichi</span>
          <p className="text-xl font-bold text-amber-500 font-mono tabular-nums">
            4.9 / 5.0
          </p>
          <p className="text-[11px] text-slate-400">Tasdiqlangan baholashlar asosida</p>
        </div>
      </div>

      {/* Category Breakdown & Pilot Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Muammolar Toifalar Taqsimoti
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Ichimlik suvi ta\'minoti (WATER)', count: 2, pct: 40, color: 'bg-sky-500' },
              { label: 'Lift va bino jihozlari (ELEVATOR)', count: 1, pct: 25, color: 'bg-purple-500' },
              { label: 'Sanitariya va chiqindilar (WASTE)', count: 1, pct: 20, color: 'bg-teal-500' },
              { label: 'Elektr va ko\'cha chiroqlari (LIGHTING)', count: 1, pct: 15, color: 'bg-amber-500' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{cat.count} ta</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization Model for Scale */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-sky-500" />
              <span>SaaS Biznes Modeli & Monetizatsiya</span>
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              B2B / GovTech
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                <span>1. Property & Apartment SaaS (KSK)</span>
                <span className="text-sky-600 font-mono">1,200 UZS / xonadon</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bino boshqaruvchilari va KSK lar uchun xonadonlar reyestri, domofon/lift integratsiyasi
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                <span>2. Utility Operations SaaS</span>
                <span className="text-sky-600 font-mono">Tarif / hudud</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Suv, elektr va tozalash korxonalari uchun avariya dispetcherligi va dalillar nazorati
              </p>
            </div>

            <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                <span>3. IoT Sensor Monitoring Subscription</span>
                <span className="text-sky-600 font-mono">$15 / datchik / yil</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Suv bosimi, sizish detektori va chiqindi sig'imi bo'yicha 24/7 telemetriya obunasi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Immutable Audit Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Xavfsizlik va O'zgarmas Audit Tarixi (Audit Logs)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Barcha status o'zgarishlari, operator qarorlari va sensor signallari qaydnomasi
            </p>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Audit loglardan qidirish..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Vaqt</th>
                <th className="px-4 py-3">Amal & Rol</th>
                <th className="px-4 py-3">Obyekt</th>
                <th className="px-4 py-3">Tafsilotlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 dark:text-white block font-mono text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {log.actorName} ({log.actorRole})
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                    {log.targetEntity} · {log.targetId}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
