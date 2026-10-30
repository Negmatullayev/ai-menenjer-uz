/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Smartphone,
  LayoutDashboard,
  Sun,
  Moon,
  Plus,
  RotateCcw,
  Building2,
  MapPin,
} from 'lucide-react';

const ROLE_LABELS: Record<UserRole, { label: string; desc: string }> = {
  RESIDENT: { label: 'Fuqaro (Aholi)', desc: 'Murojaat yuborish va xonadon xizmatlari' },
  COMMUNITY_MANAGER: { label: 'Mahalla Operatori', desc: 'Arizalarni qabul qilish va dublikatlarni birlashtirish' },
  PROPERTY_MANAGER: { label: 'Property Manager (KSK)', desc: 'Bino, blok, lift va xonadonlar boshqaruvi' },
  SERVICE_ORG: { label: 'Kommunal Tashkilot', desc: 'Suv / Elektr / Chiqindi avariya xizmatlari' },
  CONTRACTOR: { label: 'Pudratchi Korxona', desc: 'Ta\'mirlash topshiriqlari va hisobotlar' },
  CITY_ADMIN: { label: 'Shahar Monitoringi', desc: 'Namangan shahri umumiy GIS tahlili' },
  SUPER_ADMIN: { label: 'Super Admin', desc: 'Tizim konfiguratsiyasi va audit logs' },
};

export const Header: React.FC<{ activeNav: string; setActiveNav: (nav: string) => void }> = ({
  activeNav,
  setActiveNav,
}) => {
  const {
    currentRole,
    setCurrentRole,
    viewMode,
    setViewMode,
    theme,
    toggleTheme,
    setIsCreateModalOpen,
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    resetDemoData,
    iotDevices,
  } = useApp();

  const activeAlertsCount = iotDevices.filter((d) => d.alertActive).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Primary Top Bar adhering strictly to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveNav('home');
              setViewMode('CITIZEN');
            }}
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 text-left whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm shadow-sky-500/20">
              MO
            </span>
            <span>MAHALLA OS</span>
          </button>
          <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500 font-medium">
            Namangan Pilot v1.0
          </span>
        </div>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              setViewMode('CITIZEN');
              setActiveNav('citizen');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              viewMode === 'CITIZEN'
                ? 'border-sky-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fuqaro Ilovasi
          </button>

          <button
            onClick={() => {
              setViewMode('OPERATIONS');
              setActiveNav('gis-twin');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              viewMode === 'OPERATIONS' && activeNav === 'gis-twin'
                ? 'border-sky-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Digital Twin GIS
          </button>

          <button
            onClick={() => {
              setViewMode('OPERATIONS');
              setActiveNav('property-ksk');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              viewMode === 'OPERATIONS' && activeNav === 'property-ksk'
                ? 'border-sky-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Property & KSK
          </button>

          <button
            onClick={() => {
              setViewMode('OPERATIONS');
              setActiveNav('tasks-sla');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              viewMode === 'OPERATIONS' && activeNav === 'tasks-sla'
                ? 'border-sky-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ish Topshiriqlari
          </button>

          <button
            onClick={() => {
              setViewMode('OPERATIONS');
              setActiveNav('iot-telemetry');
            }}
            className={`relative transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              viewMode === 'OPERATIONS' && activeNav === 'iot-telemetry'
                ? 'border-sky-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            IoT Sensorlar
            {activeAlertsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded font-mono">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm shadow-sky-600/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Murojaat yuborish</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Testing Controls, Role Switcher & Pilot Filters */}
      <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Role selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">
              Faol Rol:
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r].label}
                </option>
              ))}
            </select>

            <span className="hidden xl:inline text-slate-400 dark:text-slate-500 text-[11px]">
              ({ROLE_LABELS[currentRole].desc})
            </span>
          </div>

          {/* Right utility buttons: View toggle, District filter, Theme, Reset */}
          <div className="flex items-center gap-2">
            {/* View Mode Segmented Switch */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setViewMode('CITIZEN')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'CITIZEN'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Fuqaro</span>
              </button>
              <button
                onClick={() => setViewMode('OPERATIONS')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'OPERATIONS'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Boshqaruv</span>
              </button>
            </div>

            {/* Pilot District Selector */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="all">Barcha Tumanlar (Namangan)</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Mavzuni almashtirish"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Demo */}
            <button
              onClick={resetDemoData}
              className="flex items-center gap-1 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              title="Ma'lumotlarni boshlang'ich holatga qaytarish"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
