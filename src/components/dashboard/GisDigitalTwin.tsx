/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InfrastructureAsset, Complaint } from '../../types';
import {
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Zap,
  Trash2,
  ShieldCheck,
  Building,
  Wrench,
  Search,
  Filter,
  Eye,
  X,
} from 'lucide-react';

export const GisDigitalTwin: React.FC = () => {
  const { assets, complaints, buildings, iotDevices } = useApp();

  const [activeLayers, setActiveLayers] = useState<{
    water: boolean;
    electricity: boolean;
    lighting: boolean;
    waste: boolean;
    buildings: boolean;
    complaints: boolean;
    iot: boolean;
  }>({
    water: true,
    electricity: true,
    lighting: true,
    waste: true,
    buildings: true,
    complaints: true,
    iot: true,
  });

  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);
  const [selectedMapComplaint, setSelectedMapComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toggle individual layer
  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const filteredAssets = assets.filter((a) => {
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.assetTag.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (a.category === 'WATER_PIPE' && !activeLayers.water) return false;
    if (a.category === 'TRANSFORMER' && !activeLayers.electricity) return false;
    if (a.category === 'STREET_LIGHT' && !activeLayers.lighting) return false;
    if (a.category === 'WASTE_CONTAINER' && !activeLayers.waste) return false;
    if ((a.category === 'ELEVATOR' || a.category === 'PUMP_STATION') && !activeLayers.buildings) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Digital Mahalla Twin · Namangan GIS Infratuzilma Xaritasi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Davlatobod va Yangi Namangan tumanlari infratuzilma aktivlari va raqamli pasportlari
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Aktiv nomi yoki pasport kodi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Layer Visibility Toggles */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-slate-500 font-semibold px-2">Qatlamlar (GIS Layers):</span>

        <button
          onClick={() => toggleLayer('water')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLayers.water
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Suv quvurlari ({assets.filter((a) => a.category === 'WATER_PIPE').length})</span>
        </button>

        <button
          onClick={() => toggleLayer('electricity')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLayers.electricity
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Elektr & TP ({assets.filter((a) => a.category === 'TRANSFORMER').length})</span>
        </button>

        <button
          onClick={() => toggleLayer('lighting')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLayers.lighting
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>💡 Ko'cha chiroqlari</span>
        </button>

        <button
          onClick={() => toggleLayer('waste')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLayers.waste
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Chiqindi nuqtalari</span>
        </button>

        <button
          onClick={() => toggleLayer('buildings')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLayers.buildings
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Turar-joy bloklari ({buildings.length})</span>
        </button>

        <button
          onClick={() => toggleLayer('complaints')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLayers.complaints
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Ochiq murojaatlar ({complaints.filter((c) => c.status !== 'RESOLVED').length})</span>
        </button>
      </div>

      {/* Main Vector GIS Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Canvas / Vector Viewport */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 relative h-[520px] overflow-hidden flex flex-col">
          {/* Coordinates & Region watermark */}
          <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NAMANGAN 41.0018° N, 71.6249° E</span>
          </div>

          <div className="absolute top-3 right-3 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            Davlatobod & Yangi Namangan Pilot
          </div>

          {/* Interactive SVG Urban Grid Map */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0A0F1D]">
            <svg
              className="w-full h-full cursor-grab active:cursor-grabbing"
              viewBox="0 0 1000 650"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
                <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="powerLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <rect width="1000" height="650" fill="url(#grid)" />

              {/* District Boundary Polygons */}
              {/* Davlatobod Tumani Sector */}
              <path
                d="M 60,80 L 480,50 L 520,380 L 100,420 Z"
                fill="rgba(14, 165, 233, 0.03)"
                stroke="rgba(14, 165, 233, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="80" y="110" fill="#38BDF8" fontSize="12" fontWeight="bold" opacity="0.6">
                DAVLATOBOD TUMANI (Yuksalish / Yangi Tong)
              </text>

              {/* Yangi Namangan Tumani Sector */}
              <path
                d="M 540,40 L 940,70 L 900,400 L 550,370 Z"
                fill="rgba(168, 85, 247, 0.03)"
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="560" y="80" fill="#C084FC" fontSize="12" fontWeight="bold" opacity="0.6">
                YANGI NAMANGAN TUMANI (Afsonalar / Bobur)
              </text>

              {/* Major Roads / Arteries */}
              <path
                d="M 40,240 Q 500,220 960,260"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M 40,240 Q 500,220 960,260"
                stroke="#1E293B"
                strokeWidth="8"
                fill="none"
              />
              <path
                d="M 40,240 Q 500,220 960,260"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeDasharray="6 6"
                fill="none"
              />
              <text x="220" y="232" fill="#94A3B8" fontSize="10">
                Yuksalish Shoh Ko'chasi
              </text>
              <text x="700" y="252" fill="#94A3B8" fontSize="10">
                Islom Karimov Shoh Ko'chasi
              </text>

              {/* Secondary Cross Street */}
              <path
                d="M 320,60 L 280,580"
                stroke="#1E293B"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M 720,50 L 700,560"
                stroke="#1E293B"
                strokeWidth="6"
                fill="none"
              />

              {/* LAYER: Water Supply Pipe Network */}
              {activeLayers.water && (
                <g>
                  {/* Water Main D-300 */}
                  <path
                    d="M 60,260 L 460,240 L 480,480"
                    stroke="url(#waterFlow)"
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Branch to blocks */}
                  <path
                    d="M 240,250 L 240,160"
                    stroke="#0EA5E9"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    fill="none"
                  />
                  <path
                    d="M 380,245 L 380,360"
                    stroke="#0EA5E9"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    fill="none"
                  />
                </g>
              )}

              {/* LAYER: Power Grid Network */}
              {activeLayers.electricity && (
                <g>
                  <path
                    d="M 380,120 L 480,210 L 780,180"
                    stroke="url(#powerLine)"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    fill="none"
                  />
                </g>
              )}

              {/* LAYER: Buildings footprint */}
              {activeLayers.buildings && (
                <g>
                  {/* Yuksalish Block A */}
                  <rect
                    x="200"
                    y="130"
                    width="70"
                    height="50"
                    rx="4"
                    fill="#312E81"
                    stroke="#4338CA"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      const ast = assets.find((a) => a.id === 'asset-lift-1');
                      if (ast) setSelectedAsset(ast);
                    }}
                  />
                  <text x="210" y="160" fill="#E0E7FF" fontSize="9" fontWeight="bold">
                    Blok A
                  </text>

                  {/* Yuksalish Block B */}
                  <rect
                    x="290"
                    y="130"
                    width="70"
                    height="50"
                    rx="4"
                    fill="#312E81"
                    stroke="#4338CA"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => {
                      const ast = assets.find((a) => a.id === 'asset-pump-1');
                      if (ast) setSelectedAsset(ast);
                    }}
                  />
                  <text x="300" y="160" fill="#E0E7FF" fontSize="9" fontWeight="bold">
                    Blok B
                  </text>

                  {/* Yangi Namangan Star Tower */}
                  <rect
                    x="680"
                    y="140"
                    width="80"
                    height="65"
                    rx="6"
                    fill="#4C1D95"
                    stroke="#6D28D9"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80"
                  />
                  <text x="692" y="176" fill="#EDE9FE" fontSize="9" fontWeight="bold">
                    Star Tower
                  </text>
                </g>
              )}

              {/* LAYER: Assets Icons */}
              {filteredAssets.map((asset) => {
                // Map coordinates approximately to SVG viewbox
                let cx = 250;
                let cy = 250;
                if (asset.id === 'asset-water-1') { cx = 240; cy = 250; }
                if (asset.id === 'asset-trans-1') { cx = 380; cy = 120; }
                if (asset.id === 'asset-light-1') { cx = 780; cy = 180; }
                if (asset.id === 'asset-waste-1') { cx = 170; cy = 290; }
                if (asset.id === 'asset-lift-1') { cx = 235; cy = 155; }
                if (asset.id === 'asset-pump-1') { cx = 325; cy = 155; }

                const isSelected = selectedAsset?.id === asset.id;

                return (
                  <g
                    key={asset.id}
                    className="cursor-pointer transition-transform duration-150 hover:scale-110"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setSelectedMapComplaint(null);
                    }}
                  >
                    {/* Pulsing ring for critical/attention assets */}
                    {asset.technicalCondition === 'CRITICAL' && (
                      <circle cx={cx} cy={cy} r="18" fill="rgba(244,63,94,0.2)" stroke="#F43F5E" strokeWidth="1">
                        <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '14' : '10'}
                      fill={
                        asset.category === 'WATER_PIPE'
                          ? '#0284C7'
                          : asset.category === 'TRANSFORMER'
                          ? '#D97706'
                          : asset.category === 'WASTE_CONTAINER'
                          ? '#0D9488'
                          : asset.category === 'ELEVATOR'
                          ? '#7C3AED'
                          : '#475569'
                      }
                      stroke={isSelected ? '#38BDF8' : '#FFFFFF'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                    />

                    {/* Small inner label */}
                    <text
                      x={cx}
                      y={cy + 3}
                      fill="#FFFFFF"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {asset.category === 'WATER_PIPE' ? 'W' : asset.category === 'TRANSFORMER' ? 'E' : asset.category === 'ELEVATOR' ? 'L' : 'A'}
                    </text>
                  </g>
                );
              })}

              {/* LAYER: Live Complaints Pins */}
              {activeLayers.complaints &&
                complaints
                  .filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED')
                  .map((comp) => {
                    let px = 255;
                    let py = 245;
                    if (comp.id === 'cmp-001') { px = 250; py = 240; }
                    if (comp.id === 'cmp-002') { px = 265; py = 250; }
                    if (comp.id === 'cmp-003') { px = 240; py = 125; }

                    const isSelected = selectedMapComplaint?.id === comp.id;

                    return (
                      <g
                        key={comp.id}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => {
                          setSelectedMapComplaint(comp);
                          setSelectedAsset(null);
                        }}
                      >
                        <circle
                          cx={px}
                          cy={py}
                          r={isSelected ? '12' : '8'}
                          fill={comp.priority === 'EMERGENCY' ? '#E11D48' : '#F59E0B'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={px}
                          y={py + 3}
                          fill="#FFFFFF"
                          fontSize="7"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          !
                        </text>
                      </g>
                    );
                  })}
            </svg>
          </div>

          {/* Map bottom legend */}
          <div className="bg-slate-950 p-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Suv magistrali</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Elektr TP</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>KSK Binolar</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Aktiv muammo</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-500">
              Aktiv pasportini ochish uchun ustiga bosing
            </span>
          </div>
        </div>

        {/* Right Detail Panel: Digital Asset Passport or Selected Complaint */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between h-[520px] overflow-y-auto">
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
                    RAQAMLI PASPORT · {selectedAsset.assetTag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedAsset.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Condition & Health Meter */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Texnik holati:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedAsset.technicalCondition === 'OPTIMAL'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : selectedAsset.technicalCondition === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    {selectedAsset.technicalCondition}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Aktiv salomatlik indeksi (Health Score):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedAsset.healthScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedAsset.healthScore > 80
                          ? 'bg-emerald-500'
                          : selectedAsset.healthScore > 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${selectedAsset.healthScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Passport Specs */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Pasport Ma'lumotlari:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 block">Mas'ul tashkilot:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {selectedAsset.responsibleOrg}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 block">O'rnatilgan sana:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {selectedAsset.installationDate}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 block">Oxirgi tekshiruv:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {selectedAsset.lastInspectionDate}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 block">Keyingi xizmat:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {selectedAsset.nextScheduledMaintenance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              {selectedAsset.maintenanceHistory.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Ta'mirlar tarixi:
                  </span>
                  {selectedAsset.maintenanceHistory.map((m, idx) => (
                    <div key={idx} className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px]">
                      <div className="flex justify-between text-slate-500 font-mono">
                        <span>{m.date}</span>
                        <span>{m.costUzs.toLocaleString()} UZS</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5">
                        {m.action} ({m.technician})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedMapComplaint ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-sky-600 font-bold">
                    {selectedMapComplaint.trackingNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedMapComplaint.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMapComplaint(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Holat:</span>
                  <span className="font-bold text-sky-600">{selectedMapComplaint.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ustuvorlik:</span>
                  <span className="font-bold text-rose-500">{selectedMapComplaint.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Manzil:</span>
                  <span className="text-right text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    {selectedMapComplaint.location.address}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {selectedMapComplaint.description}
              </p>

              {selectedMapComplaint.photoUrl && (
                <img
                  src={selectedMapComplaint.photoUrl}
                  alt="Muammo"
                  className="w-full h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <MapPin className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-xs">
                Xaritadagi quvur, transformator, lift yoki murojaat ustiga bosing
              </p>
              <p className="text-[11px] text-slate-500">
                Aktivning to'liq raqamli pasporti, texnik holati va oxirgi ta'mirlar tarixi shu yerda ko'rinadi.
              </p>
            </div>
          )}

          {/* Quick GIS action button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                const first = assets[0];
                if (first) setSelectedAsset(first);
              }}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Birinchi aktiv pasportini ko'rish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
