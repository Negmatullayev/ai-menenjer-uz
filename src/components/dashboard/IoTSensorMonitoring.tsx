/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Wifi,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Trash2,
  Activity,
  Wind,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';

export const IoTSensorMonitoring: React.FC = () => {
  const { iotDevices, triggerIoTAlert } = useApp();
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeAlerts = iotDevices.filter((d) => d.alertActive);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              LIVE DEMO REJIM · IoT TELEMETRIYA & MQTT SHLYUZI
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
            Aqlli Sensorlar va Infratuzilma Monitoring Markazi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Suv bosimi, quvur sizishi, chiqindi to'lishi, lift tebranishi va havo sifati real vaqt oqimi
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Trigger or toggle water pressure drop
              triggerIoTAlert('iot-press-01', true, 1.8);
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Suv bosimi tushishini sinash</span>
          </button>

          <button
            onClick={() => {
              // Reset all to optimal
              triggerIoTAlert('iot-press-01', false, 5.2);
              triggerIoTAlert('iot-waste-01', false, 32);
              triggerIoTAlert('iot-lift-01', false, 1.2);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Normal holatga qaytarish</span>
          </button>
        </div>
      </div>

      {/* Active Alerts Banner if any */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Faol Sensor Signallari ({activeAlerts.length} ta datchikda cheklov buzilgan):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {activeAlerts.map((dev) => (
              <div
                key={dev.id}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {dev.name}
                  </span>
                  <span className="text-[11px] text-rose-600 dark:text-rose-400">
                    {dev.alertMessage || 'Anomal ko\'rsatkich'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(dev.lastPing).toLocaleTimeString('uz-UZ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {iotDevices.map((device) => {
          return (
            <div
              key={device.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 space-y-3.5 transition-all ${
                device.alertActive
                  ? 'border-rose-500/50 shadow-md shadow-rose-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Sensor Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-slate-400 font-bold">
                  {device.deviceId}
                </span>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <Wifi className="w-3 h-3 text-emerald-500" />
                    <span>{device.signalStrengthDbm} dBm</span>
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <Battery className="w-3 h-3 text-sky-500" />
                    <span>{device.batteryPct}%</span>
                  </span>
                </div>
              </div>

              {/* Sensor Name & Category */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {device.name}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {device.assetName}
                </p>
              </div>

              {/* Sensor Metric Visualizer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                {device.type === 'WATER_PRESSURE' && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-500" />
                        <span>Magistral bosimi:</span>
                      </span>
                      <span
                        className={`font-mono font-bold text-base ${
                          (device.telemetry.pressureBar || 0) < 3.0
                            ? 'text-rose-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {device.telemetry.pressureBar} bar
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (device.telemetry.pressureBar || 0) < 3.0
                            ? 'bg-rose-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, ((device.telemetry.pressureBar || 0) / 6) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {device.type === 'WASTE_BIN_LEVEL' && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5 text-teal-500" />
                        <span>Konteyner to'lishi:</span>
                      </span>
                      <span
                        className={`font-mono font-bold text-base ${
                          (device.telemetry.fillPercentage || 0) > 80
                            ? 'text-rose-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {device.telemetry.fillPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (device.telemetry.fillPercentage || 0) > 80
                            ? 'bg-rose-500'
                            : 'bg-teal-500'
                        }`}
                        style={{ width: `${device.telemetry.fillPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {device.type === 'AIR_QUALITY' && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-sky-500" />
                        <span>Havo indeksi (AQI):</span>
                      </span>
                      <span className="font-mono font-bold text-base text-emerald-500">
                        {device.telemetry.aqi} (Yaxshi)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>
                )}

                {device.type === 'ELEVATOR_VIBRATION' && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-purple-500" />
                        <span>Tebranish (mm/s):</span>
                      </span>
                      <span
                        className={`font-mono font-bold text-base ${
                          (device.telemetry.vibrationMmS || 0) > 3.0
                            ? 'text-rose-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {device.telemetry.vibrationMmS} mm/s
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (device.telemetry.vibrationMmS || 0) > 3.0
                            ? 'bg-rose-500'
                            : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, ((device.telemetry.vibrationMmS || 0) / 6) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sensor State & Action */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400">
                  Oxirgi signal: {new Date(device.lastPing).toLocaleTimeString('uz-UZ')}
                </span>

                <button
                  onClick={() => triggerIoTAlert(device.id)}
                  className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
                >
                  {device.alertActive ? 'O\'chirish' : 'Signal berish'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
