/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GisDigitalTwin } from './GisDigitalTwin';
import { PropertyManagementView } from './PropertyManagementView';
import { ComplaintWorkbench } from './ComplaintWorkbench';
import { TaskManagementSLA } from './TaskManagementSLA';
import { IoTSensorMonitoring } from './IoTSensorMonitoring';
import { AnalyticsAndAudits } from './AnalyticsAndAudits';
import {
  Layers,
  Building2,
  FileText,
  Wrench,
  Radio,
  BarChart3,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

export const OperationsDashboard: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab }) => {
  const { complaints, iotDevices, workOrders, buildings } = useApp();
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'property-ksk');

  const activeAlertsCount = iotDevices.filter((d) => d.alertActive).length;
  const openComplaintsCount = complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('property-ksk')}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'property-ksk'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-purple-500" />
          <span>Property Management (KSK)</span>
        </button>

        <button
          onClick={() => setActiveTab('gis-twin')}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'gis-twin'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-500" />
          <span>Digital Mahalla Twin (GIS)</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'complaints'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-500" />
          <span>Murojaatlar & Duplicate ({openComplaintsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-emerald-500" />
          <span>Ish Topshiriqlari & SLA</span>
        </button>

        <button
          onClick={() => setActiveTab('iot')}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'iot'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-rose-500" />
          <span>IoT Telemetriya</span>
          {activeAlertsCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white rounded font-mono font-bold">
              {activeAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-2 px-3.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tahlil & Audit Logs</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'property-ksk' && <PropertyManagementView />}
      {activeTab === 'gis-twin' && <GisDigitalTwin />}
      {activeTab === 'complaints' && <ComplaintWorkbench />}
      {activeTab === 'tasks' && <TaskManagementSLA />}
      {activeTab === 'iot' && <IoTSensorMonitoring />}
      {activeTab === 'analytics' && <AnalyticsAndAudits />}
    </div>
  );
};
