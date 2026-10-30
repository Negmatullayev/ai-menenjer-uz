/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkOrder, IssuePriority } from '../../types';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  DollarSign,
  Plus,
  Send,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

export const TaskManagementSLA: React.FC = () => {
  const { workOrders, complaints, createWorkOrder } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');
  const [assignedOrgName, setAssignedOrgName] = useState<string>('Namangan Suv Ta\'minoti AJ');
  const [contractorName, setContractorName] = useState<string>('Namangan Kommunal RemStroy MCHJ');
  const [assigneeName, setAssigneeName] = useState<string>('Davron Ergashev (Brigadir)');
  const [priority, setPriority] = useState<IssuePriority>('HIGH');
  const [slaHours, setSlaHours] = useState<number>(6);
  const [estimatedCostUzs, setEstimatedCostUzs] = useState<number>(1500000);
  const [materials, setMaterials] = useState<string>('PE-100 Quvur, Biriktiruvchi mufta');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter unassigned open complaints for dispatch modal
  const openComplaints = complaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'VERIFIED' || c.status === 'ASSIGNED'
  );

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintId) return;

    setIsSubmitting(true);
    await createWorkOrder({
      complaintId: selectedComplaintId,
      assignedOrgName,
      contractorName,
      assigneeName,
      priority,
      slaHours,
      estimatedCostUzs,
      materialsRequired: materials.split(',').map((s) => s.trim()),
    });
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-500" />
            <span>Smart Task Management & SLA Monitoring Markazi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kommunal xizmatlar va pudratchilarga vazifalar taqsimoti, SLA muddatlari va xarajatlar
          </p>
        </div>

        <button
          onClick={() => {
            if (openComplaints[0]) setSelectedComplaintId(openComplaints[0].id);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi Ish Topshirig'i ochish</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs">Jami Ish Topshiriqlari</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {workOrders.length}
          </p>
          <p className="text-[11px] text-slate-400">Davlatobod va Yangi Namangan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs">Jarayonda (In Work)</span>
          <p className="text-xl font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
            {workOrders.filter((w) => w.status === 'IN_WORK' || w.status === 'ASSIGNED').length}
          </p>
          <p className="text-[11px] text-slate-400">Avariya brigadalari yo'lda</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs">SLA Bo'yicha Bajarilgan</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            96.2%
          </p>
          <p className="text-[11px] text-emerald-500">Muddati buzilmagan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 text-xs">Taxminiy Ta'mirlash Xarajati</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {(workOrders.reduce((acc, w) => acc + w.estimatedCostUzs, 0) / 1000000).toFixed(1)} mln UZS
          </p>
          <p className="text-[11px] text-slate-400">Pudratchilar smetasi</p>
        </div>
      </div>

      {/* Work Orders List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workOrders.map((order) => {
          const comp = complaints.find((c) => c.id === order.complaintId);
          return (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400 mx-1.5">·</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {comp?.trackingNumber || 'CMP-001'}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    order.priority === 'EMERGENCY'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}
                >
                  {order.priority} · SLA: {order.slaHours} soat
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {comp?.title || 'Kommunal ta\'mirlash vazifasi'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {comp?.location.address}
                </p>
              </div>

              {/* Assignment details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mas'ul tashkilot:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {order.assignedOrgName}
                  </span>
                </div>
                {order.contractorName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pudratchi:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {order.contractorName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Brigadir / Usta:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {order.assigneeName}
                  </span>
                </div>
              </div>

              {/* Materials & Cost */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 font-mono">
                <span className="text-slate-500">
                  Smeta: <strong className="text-slate-900 dark:text-white">{order.estimatedCostUzs.toLocaleString()} UZS</strong>
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold">
                  Holat: {order.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Yangi Ish Topshirig'i Biriktirish
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Murojaatni tanlang:
                </label>
                <select
                  value={selectedComplaintId}
                  onChange={(e) => setSelectedComplaintId(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {openComplaints.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.trackingNumber} — {c.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Mas'ul Tashkilot:
                </label>
                <input
                  type="text"
                  required
                  value={assignedOrgName}
                  onChange={(e) => setAssignedOrgName(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Pudratchi Korxona:
                  </label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Mas'ul Usta / Brigadir:
                  </label>
                  <input
                    type="text"
                    required
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    SLA Muddat (soat):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={slaHours}
                    onChange={(e) => setSlaHours(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Taxminiy xarajat (UZS):
                  </label>
                  <input
                    type="number"
                    value={estimatedCostUzs}
                    onChange={(e) => setEstimatedCostUzs(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold mt-2 cursor-pointer"
              >
                Topshiriqni rasmiylashtirish va jo'natish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
