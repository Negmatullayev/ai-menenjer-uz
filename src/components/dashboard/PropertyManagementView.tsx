/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building, Apartment } from '../../types';
import {
  Building2,
  Home,
  Users,
  Wrench,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Plus,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const PropertyManagementView: React.FC = () => {
  const { buildings, apartments, complaints, createWorkOrder, setIsCreateModalOpen } = useApp();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[0]?.id || 'b-yuksalish-1');
  const [apartmentFilter, setApartmentFilter] = useState<'all' | 'debt' | 'active-tickets'>('all');

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  const buildingApartments = apartments.filter((a) => a.buildingId === selectedBuilding?.id);

  const filteredApartments = buildingApartments.filter((apt) => {
    if (apartmentFilter === 'debt') return apt.balanceUzs < 0;
    if (apartmentFilter === 'active-tickets') return apt.activeRequestsCount > 0;
    return true;
  });

  const totalDebtUzs = buildingApartments.reduce((sum, a) => (a.balanceUzs < 0 ? sum + Math.abs(a.balanceUzs) : sum), 0);
  const totalCollectedUzs = buildingApartments.reduce((sum, a) => (a.balanceUzs >= 0 ? sum + a.monthlyFeeUzs : sum), 0);
  const collectionRate = Math.round((buildingApartments.filter((a) => a.balanceUzs >= 0).length / (buildingApartments.length || 1)) * 100);

  return (
    <div className="space-y-5">
      {/* Property Manager Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <Building2 className="w-4 h-4" />
            <span>KSK & Xususiy Turar-Joy Majmualari (Property Management)</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            Bino, Blok va Xonadonlar Boshqaruv Markazi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ko'p qavatli uylar infratuzilmasi, lift, nasos, tozalash va kommunal hisob-kitoblar
          </p>
        </div>

        {/* Building Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Bino:</span>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.totalApartments} ta xonadon)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Building Overview KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            Jami Xonadonlar / Aholi
          </span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {selectedBuilding?.occupiedApartments} / {selectedBuilding?.totalApartments}
          </p>
          <p className="text-[11px] text-slate-400">
            {selectedBuilding?.residentsCount} nafar ro'yxatdan o'tgan fuqaro
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            Lift va Gidrofor Holati
          </span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums flex items-center gap-2">
            <span>{selectedBuilding?.elevatorsCount} lift</span>
            <span className="text-xs px-2 py-0.5 rounded font-sans font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              {selectedBuilding?.pumpSystemStatus}
            </span>
          </p>
          <p className="text-[11px] text-slate-400">
            OTIS Gen2 smart telemetriya ulanishi faol
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            KSK Yig'im Ko'rsatkichi
          </span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {collectionRate}%
          </p>
          <p className="text-[11px] text-slate-400">
            Oylik xizmat haqi: {selectedBuilding?.monthlyServiceFeeUzs.toLocaleString()} UZS
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            Mavjud Qarzdorlik
          </span>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
            {totalDebtUzs.toLocaleString()} UZS
          </p>
          <p className="text-[11px] text-slate-400">
            Avtomat SMS ogohlantirishlar yuborilgan
          </p>
        </div>
      </div>

      {/* Building Engineering Equipment Passport */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-500" />
            <span>Bino Muhandislik Tizimlari va Texnik Xizmat Holati</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {selectedBuilding?.address}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Elevator module */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Yo'lovchi Liftlari ({selectedBuilding?.elevatorsCount} dona)</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Yuksalish A-blok OTIS smart lifti reduktor datchiklari bilan ulangan.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60 flex justify-between">
              <span>Xizmat ko'rsatuvchi:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Smart Lift Servis</span>
            </div>
          </div>

          {/* Water Booster Station */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Gidrofor Nasos Stansiyasi</span>
              <span className="text-[10px] text-sky-600 font-bold bg-sky-100 dark:bg-sky-950 px-1.5 py-0.5 rounded">
                4.8 Bar
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Grundfos 3 bosqichli nasoslar. 1-qavatdan 12-qavatgacha barqaror bosim ta'minlanadi.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60 flex justify-between">
              <span>Profilaktika:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Har oyning 10-sanasi</span>
            </div>
          </div>

          {/* Cleaning and Sanitation */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Tozalash va Sanitariya</span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                Jadval asosida
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {selectedBuilding?.cleaningSchedule}. Yo'laklar, lift kabinasi va hovli tozaligi.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-700/60 flex justify-between">
              <span>Mas'ul xodim:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Zulxumor O.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apartment Directory & Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Xonadonlar Reyestri va Kommunal Balans
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aholi aloqa ma'lumotlari, xizmat ko'rsatish balansi va arizalar
            </p>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setApartmentFilter('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                apartmentFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Barcha ({buildingApartments.length})
            </button>
            <button
              onClick={() => setApartmentFilter('debt')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                apartmentFilter === 'debt'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Qarzdorlar ({buildingApartments.filter((a) => a.balanceUzs < 0).length})
            </button>
            <button
              onClick={() => setApartmentFilter('active-tickets')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                apartmentFilter === 'active-tickets'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Aktiv Murojaatlar ({buildingApartments.filter((a) => a.activeRequestsCount > 0).length})
            </button>
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Xonadon</th>
                <th className="px-4 py-3">Mulkdor</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Maydon (m²)</th>
                <th className="px-4 py-3">Oylik To'lov</th>
                <th className="px-4 py-3">Balans Holati</th>
                <th className="px-4 py-3 text-right">Arizalar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filteredApartments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                    № {apt.unitNumber} ({apt.floor}-qavat)
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {apt.ownerName}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {apt.ownerPhone}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                    {apt.areaSqM} m²
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-200">
                    {apt.monthlyFeeUzs.toLocaleString()} UZS
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold">
                    {apt.balanceUzs < 0 ? (
                      <span className="text-rose-500">
                        {apt.balanceUzs.toLocaleString()} UZS (Qarz)
                      </span>
                    ) : apt.balanceUzs > 0 ? (
                      <span className="text-emerald-500">
                        +{apt.balanceUzs.toLocaleString()} UZS (Oldindan)
                      </span>
                    ) : (
                      <span className="text-slate-400">0 UZS (To'langan)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {apt.activeRequestsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                        {apt.activeRequestsCount} ta faol ariza
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Ariza yo'q</span>
                    )}
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
