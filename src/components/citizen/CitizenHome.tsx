/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus } from '../../types';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Bell,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Phone,
  Flame,
  Droplets,
  Trash2,
} from 'lucide-react';

const STATUS_STEPS: { status: ComplaintStatus; label: string }[] = [
  { status: 'SUBMITTED', label: 'Yuborildi' },
  { status: 'VERIFIED', label: 'AI Tasdiqladi' },
  { status: 'ASSIGNED', label: 'Biriktirildi' },
  { status: 'IN_PROGRESS', label: 'Jarayonda' },
  { status: 'RESOLVED', label: 'Bajarildi' },
];

function getStatusStepIndex(status: ComplaintStatus): number {
  switch (status) {
    case 'SUBMITTED':
    case 'RECEIVED':
      return 0;
    case 'UNDER_REVIEW':
    case 'VERIFIED':
      return 1;
    case 'ASSIGNED':
      return 2;
    case 'IN_PROGRESS':
    case 'WAITING_FOR_PARTS':
      return 3;
    case 'RESOLVED':
    case 'CLOSED':
      return 4;
    default:
      return 0;
  }
}

export const CitizenHome: React.FC = () => {
  const {
    currentUser,
    complaints,
    buildings,
    apartments,
    announcements,
    setIsCreateModalOpen,
    updateComplaintStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my-issues' | 'apartment' | 'feed'>('my-issues');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Filter complaints of current citizen
  const myComplaints = complaints.filter(
    (c) => c.citizenId === currentUser?.id || c.citizenPhone === currentUser?.phone
  );

  // Public complaints in neighborhood
  const publicComplaints = complaints.filter(
    (c) => c.location.neighborhoodId === currentUser?.neighborhoodId
  );

  const myBuilding = buildings.find((b) => b.id === currentUser?.buildingId) || buildings[0];
  const myApartment = apartments.find((a) => a.buildingId === myBuilding?.id) || apartments[0];

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || myComplaints[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Citizen Welcome & Location Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Namangan Smart City · Davlatobod tumani</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
              Assalomu alaykum, {currentUser?.fullName || 'Hurmatli Fuqaro'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{myBuilding?.address}, {currentUser?.apartmentNumber || '42'}-xonadon</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
              Yuksalish MFY
            </span>
            <span className="text-[11px] text-slate-400">
              ID: {currentUser?.id}
            </span>
          </div>
        </div>

        {/* Primary Thumb Zone Action Banner */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Mahallangiz yoki uyingizda nosozlik bormi?</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Suratga oling, AI 30 soniyada toifani aniqlab mas'ul KSK va xizmatga yo'naltiradi.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Muammo haqida xabar berish</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('my-issues')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer text-center ${
            activeTab === 'my-issues'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Mening murojaatlarim ({myComplaints.length})
        </button>

        <button
          onClick={() => setActiveTab('apartment')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer text-center ${
            activeTab === 'apartment'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Xonadon & KSK Xizmatlari
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer text-center ${
            activeTab === 'feed'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Mahalla ochiq lentasi ({publicComplaints.length})
        </button>
      </div>

      {/* TAB 1: My Issues Timeline & Details */}
      {activeTab === 'my-issues' && (
        <div className="space-y-4">
          {myComplaints.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sizda ochiq murojaatlar mavjud emas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Mahallangiz yoki ko'p qavatli uyingizda biron nosozlik kuzatilsa, darhol xabar bering.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Yangi murojaat qo'shish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Column: Complaint Cards List */}
              <div className="md:col-span-1 space-y-2.5">
                {myComplaints.map((c) => {
                  const isSelected = (selectedComplaint?.id || myComplaints[0]?.id) === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedComplaintId(c.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                          {c.trackingNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {c.title}
                      </h4>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                        <span>{c.category}</span>
                        <span>·</span>
                        <span className="truncate">{c.location.address}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Timeline & Evidence */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
                {selectedComplaint ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                            {selectedComplaint.trackingNumber}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(selectedComplaint.createdAt).toLocaleDateString('uz-UZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedComplaint.title}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-mono text-slate-500">
                          SLA Muddat: {new Date(selectedComplaint.slaDeadline).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Murojaat bosqichlari (Real-Time Tracking)
                      </p>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {STATUS_STEPS.map((s, idx) => {
                          const currentIdx = getStatusStepIndex(selectedComplaint.status);
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div key={s.status} className="space-y-1">
                              <div
                                className={`h-1.5 rounded-full transition-all ${
                                  isDone
                                    ? 'bg-sky-500'
                                    : 'bg-slate-200 dark:bg-slate-800'
                                }`}
                              />
                              <span
                                className={`block text-[10px] ${
                                  isCurrent
                                    ? 'font-bold text-sky-600 dark:text-sky-400'
                                    : isDone
                                    ? 'text-slate-700 dark:text-slate-300'
                                    : 'text-slate-400'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Photo & Description details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {selectedComplaint.photoUrl && (
                        <div className="sm:col-span-1 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                          <img
                            src={selectedComplaint.photoUrl}
                            alt="Muammo surati"
                            className="w-full h-28 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="p-1.5 bg-slate-50 dark:bg-slate-800 text-[10px] text-center text-slate-500">
                            Birlamchi dalil surati
                          </div>
                        </div>
                      )}

                      <div className={`space-y-2 ${selectedComplaint.photoUrl ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Mas'ul tashkilot & Xodim:
                          </span>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {selectedComplaint.assignedOrgId || 'Namangan Shahar Dispetcherligi'}
                          </p>
                          {selectedComplaint.assignedWorkerName && (
                            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                              Ijrochi: {selectedComplaint.assignedWorkerName}
                            </p>
                          )}
                        </div>

                        {selectedComplaint.aiAnalysis && (
                          <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-500/20 rounded-xl text-xs space-y-1 text-sky-900 dark:text-sky-200">
                            <span className="font-semibold flex items-center gap-1 text-sky-600 dark:text-sky-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              AI Diagnostika
                            </span>
                            <p className="text-[11px]">
                              {selectedComplaint.aiAnalysis.descriptionSummary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resolution evidence & Citizen Rating if resolved */}
                    {selectedComplaint.status === 'RESOLVED' && selectedComplaint.resolutionEvidence && (
                      <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Bajarilgan ish foto-dalili ("Oldin" va "Keyin")
                          </span>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            Tasdiqlangan
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-semibold">OLDIN:</span>
                            <img
                              src={selectedComplaint.resolutionEvidence.beforePhotoUrl}
                              alt="Oldin"
                              className="w-full h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-emerald-600 font-semibold">KEYIN:</span>
                            <img
                              src={selectedComplaint.resolutionEvidence.afterPhotoUrl}
                              alt="Keyin"
                              className="w-full h-24 object-cover rounded-lg border border-emerald-500/30"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {selectedComplaint.resolutionEvidence.workSummary}
                        </p>

                        <div className="flex items-center gap-1 text-amber-500">
                          <span className="text-xs text-slate-600 dark:text-slate-400 mr-2">
                            Fuqaro bahosi:
                          </span>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* History trail */}
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        Amallar tarixi:
                      </p>
                      <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-3">
                        {selectedComplaint.statusHistory.map((h) => (
                          <div key={h.id} className="text-xs space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {h.status}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(h.timestamp).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              {h.comment} ({h.actorName})
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Murojaatni tanlang
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Apartment & KSK Property Management View */}
      {activeTab === 'apartment' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {myBuilding?.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Boshqaruvchi KSK: <span className="font-semibold text-slate-700 dark:text-slate-300">{myBuilding?.managerOrgName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:+998692241020"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>KSK Dispetcher</span>
                </a>
              </div>
            </div>

            {/* Smart Equipment & Utility Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Lift status */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Lift (OTIS Gen2)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Ishchi holatda
                  </span>
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  12 qavat · Faol
                </p>
                <p className="text-[10px] text-slate-400">
                  Keyingi profilaktika: 31-oktabr
                </p>
              </div>

              {/* Hydrofor water pressure */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Suv bosimi (Gidrofor)</span>
                  <Droplets className="w-4 h-4 text-sky-500" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  4.8 bar
                </p>
                <p className="text-[10px] text-emerald-500 font-medium">
                  Optimal bosim darajasida
                </p>
              </div>

              {/* Cleaning schedule */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Tozalash jadvali</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  07:00 va 18:00
                </p>
                <p className="text-[10px] text-slate-400">
                  Bugungi ertalabki qavat tozalovi: Bajarildi
                </p>
              </div>

              {/* HOA dues & billing */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">KSK To'lov holati</span>
                  <span className="text-emerald-500 text-[10px] font-bold">Qarzdorlik yo'q</span>
                </div>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +320,000 UZS
                </p>
                <p className="text-[10px] text-slate-400">
                  Oldindan to'langan (2 oylik)
                </p>
              </div>
            </div>

            {/* Quick Apartment Maintenance Request Trigger */}
            <div className="pt-2 flex items-center justify-between bg-sky-50/50 dark:bg-sky-950/20 border border-sky-500/20 rounded-xl p-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Xonadoningizga usta (santexnik, elektrik) chaqirish kerakmi?
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Boshqaruv kompaniyasining navbatchi chilangari arizangiz bo'yicha 1 soatda chiqadi.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:opacity-90 shrink-0 cursor-pointer"
              >
                Usta chaqirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Public Transparency Feed & Announcements */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Important Announcements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mahalla e'lonlari va ogohlantirishlar
            </h3>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-sky-500" />
                    {ann.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(ann.publishedAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {ann.content}
                </p>
                <p className="text-[11px] text-slate-400">
                  Manba: {ann.authorName} ({ann.authorRole})
                </p>
              </div>
            ))}
          </div>

          {/* Neighborhood Complaints Transparency */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Yuksalish MFY hududidagi ommaviy murojaatlar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {publicComplaints.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
                      {c.trackingNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {c.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{c.location.address}</span>
                    {c.clusterId && (
                      <span className="text-sky-600 font-medium">Klasterda</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
