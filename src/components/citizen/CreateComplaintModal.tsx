/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueCategory, IssuePriority } from '../../types';
import {
  X,
  Upload,
  Sparkles,
  Camera,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Building,
} from 'lucide-react';

const CATEGORIES: { id: IssueCategory; label: string; icon: string }[] = [
  { id: 'WATER', label: 'Ichimlik suvi', icon: '💧' },
  { id: 'SEWAGE', label: 'Kanalizatsiya', icon: '🚰' },
  { id: 'ELECTRICITY', label: 'Elektr ta\'minoti', icon: '⚡' },
  { id: 'GAS', label: 'Tabiiy gaz', icon: '🔥' },
  { id: 'ROADS', label: 'Yo\'llar va chuqurlar', icon: '🛣️' },
  { id: 'LIGHTING', label: 'Ko\'cha chiroqlari', icon: '💡' },
  { id: 'WASTE', label: 'Chiqindilar', icon: '🗑️' },
  { id: 'LANDSCAPING', label: 'Daraxtlar va obodonlashtirish', icon: '🌳' },
  { id: 'ELEVATOR', label: 'Lift va bino jihozlari', icon: '🛗' },
  { id: 'HOUSING', label: 'Tom / podval / fasad', icon: '🏢' },
  { id: 'OTHER', label: 'Boshqa muammolar', icon: '📋' },
];

const SAMPLE_PHOTOS = [
  {
    name: 'Suv sizishi',
    category: 'WATER' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
    prompt: 'Ko\'chada magistral quvur yorilgan va suv toshmoqda',
  },
  {
    name: 'Lift to\'xtashi',
    category: 'ELEVATOR' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=600&q=80',
    prompt: 'Ko\'p qavatli bino lifti 7-qavatda qulflanib to\'xtab qolgan',
  },
  {
    name: 'Chiqindi qutisi',
    category: 'WASTE' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    prompt: 'Chiqindi konteynerlari to\'lib ketgan va atrofga sochilgan',
  },
  {
    name: 'Yo\'l o\'yig\'i',
    category: 'ROADS' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    prompt: 'Katta asfalt yo\'lda chuqur hosil bo\'lgan va harakatga xavf tug\'diryapti',
  },
];

export const CreateComplaintModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createComplaint,
    analyzeIssueWithAI,
    districts,
    neighborhoods,
    buildings,
    complaints,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<IssueCategory>('WATER');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [districtId, setDistrictId] = useState<string>('dist-davlatobod');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('m-yuksalish');
  const [buildingId, setBuildingId] = useState<string>('b-yuksalish-1');
  const [address, setAddress] = useState<string>('Yuksalish shoh ko\'chasi, 24-uy');
  const [lat, setLat] = useState<number>(41.0018);
  const [lng, setLng] = useState<number>(71.6249);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTracking, setSubmittedTracking] = useState<string | null>(null);

  if (!isCreateModalOpen) return null;

  // Handle Photo selection and trigger AI scan
  const handleSelectSamplePhoto = async (sample: typeof SAMPLE_PHOTOS[0]) => {
    setPhotoUrl(sample.url);
    setIsScanning(true);
    setAiResult(null);

    // Call server AI endpoint
    const result = await analyzeIssueWithAI(undefined, sample.prompt);
    setIsScanning(false);

    if (result) {
      setAiResult(result);
      if (result.detectedCategory && CATEGORIES.some((c) => c.id === result.detectedCategory)) {
        setCategory(result.detectedCategory as IssueCategory);
      }
      if (result.suggestedTitle) setTitle(result.suggestedTitle);
      if (result.descriptionSummary) setDescription(result.descriptionSummary);
      if (result.suggestedPriority) setPriority(result.suggestedPriority as IssuePriority);

      // Check duplicate warning locally in same category
      const existing = complaints.filter(
        (c) => c.category === result.detectedCategory && c.status !== 'RESOLVED' && c.status !== 'CLOSED'
      );
      if (existing.length > 0) {
        setDuplicateWarning(
          `Ushbu hududda ushbu toifa (${result.detectedCategory}) bo'yicha ${existing.length} ta faol murojaat bor. Sizning arizangiz ularga guruhlanadi!`
        );
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setPhotoUrl(base64);
        setIsScanning(true);
        const result = await analyzeIssueWithAI(base64, 'Suratdagi kommunal yoki infratuzilma muammosini aniqla');
        setIsScanning(false);
        if (result) {
          setAiResult(result);
          if (result.detectedCategory) setCategory(result.detectedCategory as IssueCategory);
          if (result.suggestedTitle) setTitle(result.suggestedTitle);
          if (result.descriptionSummary) setDescription(result.descriptionSummary);
          if (result.suggestedPriority) setPriority(result.suggestedPriority as IssuePriority);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const created = await createComplaint({
      title,
      description,
      category,
      priority,
      photoUrl,
      location: {
        lat,
        lng,
        address,
        districtId,
        neighborhoodId,
        buildingId: buildingId !== 'none' ? buildingId : undefined,
      },
      aiAnalysis: aiResult
        ? {
            detectedCategory: category,
            confidence: aiResult.confidence || 0.95,
            descriptionSummary: description,
            suggestedPriority: priority,
            isPotentialDuplicate: !!duplicateWarning,
          }
        : undefined,
    });

    setIsSubmitting(false);
    if (created) {
      setSubmittedTracking(created.trackingNumber);
    }
  };

  const resetAndClose = () => {
    setIsCreateModalOpen(false);
    setStep(1);
    setPhotoUrl('');
    setTitle('');
    setDescription('');
    setAiResult(null);
    setDuplicateWarning(null);
    setSubmittedTracking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Muammo haqida xabar berish
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI yordamida tezkor tanib olish va xizmatga yo'naltirish
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {submittedTracking ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Murojaatingiz muvaffaqiyatli qabul qilindi!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kuzatuv kodi: <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{submittedTracking}</span>
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Murojaatingiz tegishli mas'ul KSK va dispetcherlik xizmatiga yo'naltirildi. Holat o'zgarishi haqida mobil bildirishnoma olasiz.
              </p>
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:opacity-90"
              >
                Mening murojaatlarimga qaytish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload / Sample selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  1. Muammoning fotosurati yoki namunani tanlang:
                </label>

                {/* Sample cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectSamplePhoto(sample)}
                      className={`relative rounded-lg overflow-hidden border text-left p-1.5 transition-all cursor-pointer ${
                        photoUrl === sample.url
                          ? 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-16 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <span className="block text-[11px] font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">
                        {sample.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* File input button */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer transition-colors w-full">
                    <Upload className="w-3.5 h-3.5" />
                    <span>O'z qurilmangizdan rasm yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* AI Recognition Scanner Banner */}
              {isScanning && (
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center gap-3 text-xs text-sky-600 dark:text-sky-300">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-sky-500" />
                  <span>
                    Gemini 3.8 Flash sun'iy intellekti fotosuratni tahlil qilmoqda va toifani aniqlamoqda...
                  </span>
                </div>
              )}

              {aiResult && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-sky-600 dark:text-sky-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Tahlil Natijasi ({Math.round((aiResult.confidence || 0.95) * 100)}% aniqlik)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      SLA: ~{aiResult.estimatedSlaHours || 6} soat
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {aiResult.descriptionSummary}
                  </p>
                  {aiResult.recommendedAction && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tavsiya: {aiResult.recommendedAction}
                    </p>
                  )}
                </div>
              )}

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Smart Duplicate Guruhlashi:</p>
                    <p className="text-[11px] mt-0.5">{duplicateWarning}</p>
                  </div>
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Muammo toifasi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`flex items-center gap-2 p-2 rounded-md text-xs text-left transition-colors cursor-pointer ${
                        category === c.id
                          ? 'bg-sky-600 text-white font-medium shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span className="truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Muammo sarlavhasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Quvur yorilgan, suv toshmoqda"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batafsil tavsif
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Qo'shimcha tafsilotlar yoki aniq belgilarni kiriting..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                  />
                </div>
              </div>

              {/* Location & Property Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Turar joy binosi (KSK):
                  </label>
                  <select
                    value={buildingId}
                    onChange={(e) => {
                      setBuildingId(e.target.value);
                      const b = buildings.find((x) => x.id === e.target.value);
                      if (b) {
                        setAddress(b.address);
                        setLat(b.coordinates.lat);
                        setLng(b.coordinates.lng);
                      }
                    }}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="none">Ko'cha / Boshqa infratuzilma</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Aniq manzil:
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Priority Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ustuvorlik darajasi:
                </span>
                {(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'] as IssuePriority[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                      priority === p
                        ? p === 'EMERGENCY'
                          ? 'bg-rose-600 text-white'
                          : p === 'HIGH'
                          ? 'bg-amber-600 text-white'
                          : 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Yuborilmoqda...</span>
                    </>
                  ) : (
                    <span>Murojaatni rasmiylashtirish</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
