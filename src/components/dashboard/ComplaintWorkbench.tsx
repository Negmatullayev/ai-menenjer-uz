/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus, IssueCategory, IssuePriority } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Layers,
  Merge,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  ShieldCheck,
  Send,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const ALL_STATUSES: ComplaintStatus[] = [
  'SUBMITTED',
  'RECEIVED',
  'UNDER_REVIEW',
  'VERIFIED',
  'ASSIGNED',
  'IN_PROGRESS',
  'WAITING_FOR_PARTS',
  'RESOLVED',
  'REJECTED',
  'REOPENED',
  'CLOSED',
];

export const ComplaintWorkbench: React.FC = () => {
  const {
    complaints,
    clusters,
    mergeCluster,
    updateComplaintStatus,
    currentRole,
    currentUser,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Status change state
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [statusComment, setStatusComment] = useState<string>('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Cluster merge dialog
  const [activeClusterModal, setActiveClusterModal] = useState<any>(null);

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.citizenName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    const ok = await updateComplaintStatus(
      selectedComplaint.id,
      newStatus,
      statusComment || `Status "${newStatus}" ga o'zgartirildi`,
      afterPhotoUrl || undefined,
      selectedComplaint.photoUrl,
      afterPhotoUrl || undefined
    );
    setIsUpdating(false);

    if (ok) {
      setStatusComment('');
      setAfterPhotoUrl('');
      // update local reference
      const updated = complaints.find((c) => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Murojaatlar Ish Stoli va Smart Duplicate Boshqaruvi</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aholidan tushgan arizalar, o'xshashliklarni klasterlash, SLA nazorati va foto-dalillar
            </p>
          </div>

          {/* Quick Clusters Alert Badge */}
          {clusters.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-medium flex items-center gap-1.5">
                <Merge className="w-3.5 h-3.5" />
                <span>{clusters.length} ta sun'iy intellekt klasteri aniqlandi</span>
              </span>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Kuzatuv kodi (#NAM-...), fuqaro ismi yoki sarlavha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="all">Barcha Statuslar</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="all">Barcha Toifalar</option>
            <option value="WATER">WATER (Ichimlik suvi)</option>
            <option value="ELEVATOR">ELEVATOR (Lift)</option>
            <option value="WASTE">WASTE (Chiqindi)</option>
            <option value="ELECTRICITY">ELECTRICITY (Elektr)</option>
            <option value="ROADS">ROADS (Yo'llar)</option>
            <option value="LIGHTING">LIGHTING (Chiroqlar)</option>
          </select>
        </div>
      </div>

      {/* 2. Smart Duplicate Clusters Banner */}
      {clusters.length > 0 && (
        <div className="bg-sky-50/70 dark:bg-sky-950/20 border border-sky-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Merge className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Smart Duplicate Detection: Yaqin atrofdagi takroriy murojaatlar
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Geolokatsiya (120m) va fotosurat tahlili asosida
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clusters.map((cl) => {
              const primary = complaints.find((c) => c.id === cl.primaryComplaintId);
              return (
                <div
                  key={cl.id}
                  className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-600 dark:text-sky-400 font-mono">
                      Klaster #{cl.id.slice(-6)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                      {cl.totalReports} ta murojaat birlashtirilgan
                    </span>
                  </div>

                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    Asosiy ariza: {primary?.title || 'Quvur sizishi'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>O'xshashlik: {Math.round(cl.similarityScore * 100)}%</span>
                    <span>Holat: {cl.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Complaints Table & Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-3">Kod & Toifa</th>
                  <th className="px-3.5 py-3">Sarlavha & Manzil</th>
                  <th className="px-3.5 py-3">Ustuvorlik</th>
                  <th className="px-3.5 py-3">Holat</th>
                  <th className="px-3.5 py-3 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredComplaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''
                      }`}
                    >
                      <td className="px-3.5 py-3">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 block">
                          {c.trackingNumber}
                        </span>
                        <span className="text-[10px] text-slate-500">{c.category}</span>
                      </td>

                      <td className="px-3.5 py-3 max-w-xs">
                        <span className="font-semibold text-slate-900 dark:text-white block truncate">
                          {c.title}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {c.location.address}
                        </span>
                      </td>

                      <td className="px-3.5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.priority === 'EMERGENCY'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : c.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>

                      <td className="px-3.5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaint(c);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          Ko'rish
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel for selected complaint */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          {selectedComplaint ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                    {selectedComplaint.trackingNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedComplaint.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedComplaint.status}
                </span>
              </div>

              {/* Citizen & Location metadata */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fuqaro:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedComplaint.citizenName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telefon:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedComplaint.citizenPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Manzil:</span>
                  <span className="text-right text-slate-700 dark:text-slate-300 max-w-[170px] truncate">
                    {selectedComplaint.location.address}
                  </span>
                </div>
              </div>

              {/* Photo preview */}
              {selectedComplaint.photoUrl && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Murojaat surati:</span>
                  <img
                    src={selectedComplaint.photoUrl}
                    alt="Surat"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Status Update Form (Operator action) */}
              <form onSubmit={handleUpdateStatus} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Statusni yangilash & Ijro nazorati:
                </span>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Yangi status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Operator / Mas'ul izohi:</label>
                  <input
                    type="text"
                    required
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Bajarilgan ish yoki yangilanish haqida izoh..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {newStatus === 'RESOLVED' && (
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Bajarilgan ish fotosurati (Keyingi holat dalili) *:
                    </label>
                    <input
                      type="url"
                      placeholder="https://... rasm havolasi"
                      value={afterPhotoUrl}
                      onChange={(e) => setAfterPhotoUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Dalil suratisiz arizani asossiz yopish taqiqlangan.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUpdating || !statusComment.trim()}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isUpdating ? "Yangilanmoqda..." : "Statusni tasdiqlash"}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400 text-xs">
              Jadvaldan murojaatni tanlang
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
