/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_COMPLAINTS,
  INITIAL_BUILDINGS,
  INITIAL_APARTMENTS,
  INITIAL_INFRASTRUCTURE_ASSETS,
  INITIAL_IOT_DEVICES,
  INITIAL_WORK_ORDERS,
  INITIAL_CLUSTERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
  INITIAL_DISTRICTS,
  INITIAL_NEIGHBORHOODS,
} from './src/data/initialData.ts';
import { Complaint, ComplaintCluster, WorkOrder, AuditLogItem, IoTDevice } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server State Store
let complaints: Complaint[] = [...INITIAL_COMPLAINTS];
let clusters: ComplaintCluster[] = [...INITIAL_CLUSTERS];
let workOrders: WorkOrder[] = [...INITIAL_WORK_ORDERS];
let iotDevices: IoTDevice[] = [...INITIAL_IOT_DEVICES];
let auditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];
const buildings = [...INITIAL_BUILDINGS];
const apartments = [...INITIAL_APARTMENTS];
const assets = [...INITIAL_INFRASTRUCTURE_ASSETS];
const announcements = [...INITIAL_ANNOUNCEMENTS];
const users = [...INITIAL_USERS];
const districts = [...INITIAL_DISTRICTS];
const neighborhoods = [...INITIAL_NEIGHBORHOODS];

// Haversine distance in meters between two coordinates
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ----------------- API ROUTES -----------------

// 1. Get complete state
app.get('/api/state', (_req: Request, res: Response) => {
  res.json({
    complaints,
    clusters,
    workOrders,
    iotDevices,
    auditLogs,
    buildings,
    apartments,
    assets,
    announcements,
    users,
    districts,
    neighborhoods,
  });
});

// 2. Submit new complaint with smart duplicate detection
app.post('/api/complaints', (req: Request, res: Response) => {
  try {
    const data = req.body;
    const complaintId = `cmp-${Date.now().toString().slice(-6)}`;
    const trackingNumber = `NAM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint: Complaint = {
      id: complaintId,
      trackingNumber,
      citizenId: data.citizenId || 'user-resident-1',
      citizenName: data.citizenName || 'Fuqaro',
      citizenPhone: data.citizenPhone || '+998 90 000 00 00',
      title: data.title || 'Murojaat',
      description: data.description || '',
      category: data.category || 'OTHER',
      priority: data.priority || 'MEDIUM',
      status: 'SUBMITTED',
      location: data.location || {
        lat: 41.0018,
        lng: 71.6249,
        address: 'Davlatobod tumani, Yuksalish',
        districtId: 'dist-davlatobod',
        neighborhoodId: 'm-yuksalish',
      },
      photoUrl: data.photoUrl,
      videoUrl: data.videoUrl,
      aiAnalysis: data.aiAnalysis,
      slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          actorName: data.citizenName || 'Fuqaro',
          actorRole: 'RESIDENT',
          comment: 'Murojaat platforma orqali rasmiylashtirildi',
        },
      ],
    };

    // Smart Duplicate Clustering: check proximity (within 100 meters) and same category
    const nearbySameCategory = complaints.find((c) => {
      if (c.category !== newComplaint.category) return false;
      if (c.status === 'RESOLVED' || c.status === 'CLOSED' || c.status === 'REJECTED') return false;
      const dist = getDistanceMeters(
        c.location.lat,
        c.location.lng,
        newComplaint.location.lat,
        newComplaint.location.lng
      );
      return dist <= 120; // 120 meters radius
    });

    if (nearbySameCategory) {
      let targetCluster = clusters.find(
        (cl) => cl.id === nearbySameCategory.clusterId || cl.primaryComplaintId === nearbySameCategory.id
      );

      if (!targetCluster) {
        targetCluster = {
          id: `cluster-${Date.now().toString().slice(-5)}`,
          primaryComplaintId: nearbySameCategory.id,
          childComplaintIds: [newComplaint.id],
          category: newComplaint.category,
          centroid: {
            lat: (nearbySameCategory.location.lat + newComplaint.location.lat) / 2,
            lng: (nearbySameCategory.location.lng + newComplaint.location.lng) / 2,
            address: nearbySameCategory.location.address,
          },
          totalReports: 2,
          similarityScore: 0.92,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
        clusters.push(targetCluster);
        nearbySameCategory.clusterId = targetCluster.id;
      } else {
        if (!targetCluster.childComplaintIds.includes(newComplaint.id)) {
          targetCluster.childComplaintIds.push(newComplaint.id);
          targetCluster.totalReports += 1;
        }
      }

      newComplaint.clusterId = targetCluster.id;
      newComplaint.isDuplicateOf = targetCluster.primaryComplaintId;

      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: 'AI Duplicate Cluster Engine',
        actorRole: 'COMMUNITY_MANAGER',
        action: 'SMART_DUPLICATE_GROUPED',
        targetEntity: 'Complaint',
        targetId: newComplaint.id,
        details: `Murojaat ${nearbySameCategory.trackingNumber} ga 120m masofadagi klasterga biriktirildi`,
      });
    }

    complaints.unshift(newComplaint);

    // Audit log
    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: newComplaint.citizenName,
      actorRole: 'RESIDENT',
      action: 'COMPLAINT_CREATED',
      targetEntity: 'Complaint',
      targetId: newComplaint.id,
      details: `Yangi murojaat qabul qilindi: ${newComplaint.title}`,
    });

    res.status(201).json({ success: true, complaint: newComplaint });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// 3. Update complaint status
app.post('/api/complaints/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, actorName, actorRole, comment, evidencePhotoUrl, beforePhotoUrl, afterPhotoUrl, workSummary } = req.body;

    const complaint = complaints.find((c) => c.id === id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();

    const historyItem = {
      id: `sh-${Date.now()}`,
      status,
      timestamp: new Date().toISOString(),
      actorName: actorName || 'Operator',
      actorRole: actorRole || 'COMMUNITY_MANAGER',
      comment: comment || `Status o'zgartirildi: ${status}`,
      evidencePhotoUrl,
    };
    complaint.statusHistory.push(historyItem);

    if (status === 'RESOLVED' && (beforePhotoUrl || afterPhotoUrl || evidencePhotoUrl)) {
      complaint.resolutionEvidence = {
        beforePhotoUrl: beforePhotoUrl || complaint.photoUrl || '',
        afterPhotoUrl: afterPhotoUrl || evidencePhotoUrl || '',
        workSummary: workSummary || comment || 'Ta\'mirlash ishlari muvaffaqiyatli yakunlandi.',
        resolvedAt: new Date().toISOString(),
        citizenConfirmed: true,
        citizenRating: 5,
      };
    }

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: actorName || 'Operator',
      actorRole: actorRole || 'COMMUNITY_MANAGER',
      action: 'STATUS_UPDATED',
      targetEntity: 'Complaint',
      targetId: complaint.id,
      details: `${complaint.trackingNumber} statusi "${status}" ga o'zgartirildi. Izoh: ${comment || '—'}`,
    });

    res.json({ success: true, complaint });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// 4. Create or update work order
app.post('/api/work-orders', (req: Request, res: Response) => {
  try {
    const { complaintId, assignedOrgName, contractorName, assigneeName, priority, slaHours, estimatedCostUzs, materialsRequired } = req.body;

    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) {
      return res.status(404).json({ error: 'Associated complaint not found' });
    }

    const orderNumber = `WO-NAM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const deadline = new Date(Date.now() + (slaHours || 6) * 3600 * 1000).toISOString();

    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber,
      complaintId,
      assignedOrgName: assignedOrgName || 'Namangan Kommunal Servis',
      contractorName,
      assigneeName: assigneeName || 'Mas\'ul Mutaxassis',
      priority: priority || complaint.priority || 'MEDIUM',
      slaHours: slaHours || 6,
      deadline,
      status: 'ASSIGNED',
      estimatedCostUzs: estimatedCostUzs || 500000,
      materialsRequired: materialsRequired || ['Standart ehtiyot qismlar'],
      beforePhotoUrl: complaint.photoUrl,
      createdAt: new Date().toISOString(),
    };

    workOrders.unshift(newOrder);

    // Update complaint status to ASSIGNED
    complaint.status = 'ASSIGNED';
    complaint.assignedOrgId = assignedOrgName;
    complaint.assignedWorkerName = assigneeName;
    complaint.statusHistory.push({
      id: `sh-${Date.now()}`,
      status: 'ASSIGNED',
      timestamp: new Date().toISOString(),
      actorName: 'Dispatcher',
      actorRole: 'COMMUNITY_MANAGER',
      comment: `${assignedOrgName} (${assigneeName}) ga topshiriq biriktirildi. Ish raqami: ${orderNumber}`,
    });

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'Dispatcher',
      actorRole: 'COMMUNITY_MANAGER',
      action: 'WORK_ORDER_CREATED',
      targetEntity: 'WorkOrder',
      targetId: newOrder.id,
      details: `${orderNumber} yaratildi va ${assignedOrgName} ga biriktirildi`,
    });

    res.status(201).json({ success: true, workOrder: newOrder, complaint });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// 5. Merge / manage duplicate cluster
app.post('/api/clusters/merge', (req: Request, res: Response) => {
  try {
    const { primaryId, duplicateIds } = req.body;
    if (!primaryId || !duplicateIds || !Array.isArray(duplicateIds)) {
      return res.status(400).json({ error: 'primaryId and duplicateIds array are required' });
    }

    const primary = complaints.find((c) => c.id === primaryId);
    if (!primary) {
      return res.status(404).json({ error: 'Primary complaint not found' });
    }

    let cluster = clusters.find((cl) => cl.primaryComplaintId === primaryId || cl.id === primary.clusterId);
    if (!cluster) {
      cluster = {
        id: `cluster-${Date.now()}`,
        primaryComplaintId: primaryId,
        childComplaintIds: duplicateIds,
        category: primary.category,
        centroid: {
          lat: primary.location.lat,
          lng: primary.location.lng,
          address: primary.location.address,
        },
        totalReports: 1 + duplicateIds.length,
        similarityScore: 0.95,
        status: 'MERGED',
        createdAt: new Date().toISOString(),
      };
      clusters.push(cluster);
    } else {
      duplicateIds.forEach((id) => {
        if (!cluster!.childComplaintIds.includes(id)) {
          cluster!.childComplaintIds.push(id);
        }
      });
      cluster.totalReports = 1 + cluster.childComplaintIds.length;
      cluster.status = 'MERGED';
    }

    primary.clusterId = cluster.id;

    duplicateIds.forEach((dupId) => {
      const dup = complaints.find((c) => c.id === dupId);
      if (dup) {
        dup.clusterId = cluster!.id;
        dup.isDuplicateOf = primaryId;
        dup.status = primary.status;
        dup.statusHistory.push({
          id: `sh-${Date.now()}`,
          status: primary.status,
          timestamp: new Date().toISOString(),
          actorName: 'Operator',
          actorRole: 'COMMUNITY_MANAGER',
          comment: `Asosiy murojaat ${primary.trackingNumber} ga qo'lda birlashtirildi`,
        });
      }
    });

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'Operator',
      actorRole: 'COMMUNITY_MANAGER',
      action: 'MANUAL_CLUSTER_MERGED',
      targetEntity: 'ComplaintCluster',
      targetId: cluster.id,
      details: `${duplicateIds.length} ta dublikat murojaat ${primary.trackingNumber} ga guruhlandi`,
    });

    res.json({ success: true, cluster });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// 6. IoT Telemetry simulator & trigger
app.post('/api/iot/trigger', (req: Request, res: Response) => {
  try {
    const { deviceId, type, alertActive, alertMessage, value } = req.body;
    const device = iotDevices.find((d) => d.id === deviceId || d.deviceId === deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    device.lastPing = new Date().toISOString();
    device.alertActive = alertActive ?? !device.alertActive;
    if (alertMessage) device.alertMessage = alertMessage;

    if (type === 'WATER_PRESSURE' && typeof value === 'number') {
      device.telemetry.pressureBar = value;
      device.telemetry.leakDetected = value < 3.0;
    } else if (type === 'WASTE_BIN_LEVEL' && typeof value === 'number') {
      device.telemetry.fillPercentage = value;
    } else if (type === 'ELEVATOR_VIBRATION' && typeof value === 'number') {
      device.telemetry.vibrationMmS = value;
    }

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'IoT Gateway',
      actorRole: 'CITY_ADMIN',
      action: device.alertActive ? 'IOT_ALERT_TRIGGERED' : 'IOT_ALERT_RESOLVED',
      targetEntity: 'IoTDevice',
      targetId: device.id,
      details: `${device.name}: ${device.alertActive ? device.alertMessage || 'Xavfli signal berildi' : 'Normal holatga qaytdi'}`,
    });

    res.json({ success: true, device });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// 7. AI Issue Detection using Gemini 3.8 Flash
app.post('/api/ai/analyze-issue', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', textPrompt = '' } = req.body;

    const systemPrompt = `Sen O'zbekistonning Namangan shahri "MAHALLA OS" tizimining sun'iy intellekt bo'yicha bosh dispetcherisansan.
Vazifang: Fuqaro yuborgan fotosurat yoki tasvir/matnni tahlil qilib, shahar va turar-joy majmuasi (KSK) infratuzilmasidagi muammoni aniqlash.

Ruxsat etilgan kategoriyalar:
- WATER (Ichimlik suvi ta'minoti, quvurlardagi sizishlar, nosoz kran/klapanlar)
- SEWAGE (Kanalizatsiya tiqilishi, lyuk qopqoqlari, oqava suvlar)
- ELECTRICITY (Elektr simlari uzilishi, transformator, podstansiya nosozligi)
- GAS (Gaz hidi, quvurlar, rostlagichlar)
- ROADS (Yo'l o'yig'i, asfalt buzilishi, piyodalar yo'lagi)
- LIGHTING (Ko'cha chirog'i yonmasligi, singan chiroq ustunlari)
- WASTE (Chiqindi qutisi to'lib ketishi, noqonuniy chiqindixona)
- LANDSCAPING (Buzilgan/qurigan daraxtlar, sug'orish, ariqlar)
- ELEVATOR (Lift nosozligi, to'xtab qolish, siltanish)
- HOUSING (Bino tomi oqishi, podval namlanishi, fasad, umumiy dahliz)
- OTHER (Boshqa turdagi muammolar)

Ustuvorliklar:
- EMERGENCY (Avariya, odam hayotiga xavf, gaz sizishi, liftda odam qolishi, toshqin)
- HIGH (Ichimlik suvi oqishi, elektr uzilishi, asosiy yo'ldagi chuqur)
- MEDIUM (Ko'cha chirog'i, to'lgan chiqindi, fasad)
- LOW (Kichik kosmetik kamchiliklar)

Javobni FAQAT toza JSON formatida quyidagi struktura bilan qaytar:
{
  "detectedCategory": "WATER",
  "confidence": 0.95,
  "suggestedTitle": "Qisqa va aniq sarlavha (o'zbek tilida)",
  "descriptionSummary": "Batafsil tahlil va ko'ringan zararlar (o'zbek tilida)",
  "suggestedPriority": "HIGH",
  "recommendedAction": "Qaysi xizmat tashkilotiga (Suv, Elektr, KSK, Lift Servis) yo'naltirish kerakligi",
  "estimatedSlaHours": 6
}`;

    if (process.env.GEMINI_API_KEY) {
      const parts: any[] = [];

      if (imageBase64) {
        // Remove data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: base64Data,
          },
        });
      }

      const promptText = textPrompt
        ? `Suratdagi holat va fuqaro izohi: "${textPrompt}". Muammoni aniqla va toifa ajrat.`
        : 'Suratdagi infratuzilma yoki bino muammosini tahlil qil va kategoriya ajrat.';

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedCategory: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              suggestedTitle: { type: Type.STRING },
              descriptionSummary: { type: Type.STRING },
              suggestedPriority: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
              estimatedSlaHours: { type: Type.INTEGER },
            },
            required: ['detectedCategory', 'confidence', 'suggestedTitle', 'descriptionSummary', 'suggestedPriority'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, analysis: parsed });
    }

    // Intelligent Fallback if API key is not configured
    const lower = textPrompt.toLowerCase();
    let cat = 'WATER';
    let pri = 'HIGH';
    let title = 'Ichimlik suvi quvurida sizish aniqlandi';
    let summary = 'Fotosuratdagi quvur birikmasidan suv sizib chiqmoqda, bosim pasayishi kuzatilishi mumkin.';
    let action = 'Namangan Suv Ta\'minoti avariya brigadasiga yo\'naltirilsin';
    let sla = 6;

    if (lower.includes('lift') || lower.includes('elevator')) {
      cat = 'ELEVATOR';
      pri = 'EMERGENCY';
      title = 'Ko\'p qavatli bino lifti to\'xtab qolgan';
      summary = 'Lift kabinasi qavatlar orasida qulflangan, texnik xizmat zudlik bilan talab etiladi.';
      action = 'Smart Lift Servis dispetcheriga yuborilsin';
      sla = 2;
    } else if (lower.includes('chiqindi') || lower.includes('axlat') || lower.includes('waste')) {
      cat = 'WASTE';
      pri = 'MEDIUM';
      title = 'Chiqindi konteynerlari to\'lib toshgan';
      summary = 'Maydonchada sanitariya me\'yorlari buzilgan, tozalash va olib ketish talab etiladi.';
      action = 'Toza Hudud korxonasiga yuborilsin';
      sla = 12;
    } else if (lower.includes('elektr') || lower.includes('chiroq') || lower.includes('svet')) {
      cat = 'LIGHTING';
      pri = 'MEDIUM';
      title = 'Ko\'cha chirog\'i ishlamayapti';
      summary = 'Tungi vaqtda ko\'cha yoritish tarmog\'ida nosozlik aniqlandi.';
      action = 'Obodonlashtirish yoritish bo\'limiga yuborilsin';
      sla = 24;
    } else if (lower.includes('yo\'l') || lower.includes('chuqur') || lower.includes('asfalt')) {
      cat = 'ROADS';
      pri = 'HIGH';
      title = 'Yo\'l qoplamasida chuqur va xavfli o\'yiq mavjud';
      summary = 'Piyodalar va avtomobillar harakatiga xalal beruvchi asfalt yemirilishi.';
      action = 'Tuman yo\'l ta\'mirlash korxonasiga yo\'naltirilsin';
      sla = 48;
    }

    res.json({
      success: true,
      analysis: {
        detectedCategory: cat,
        confidence: 0.92,
        suggestedTitle: title,
        descriptionSummary: summary,
        suggestedPriority: pri,
        recommendedAction: action,
        estimatedSlaHours: sla,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('AI Analysis error:', msg);
    res.status(500).json({ error: msg });
  }
});

// 8. Reset state back to initial pilot
app.post('/api/reset-demo', (_req: Request, res: Response) => {
  complaints = [...INITIAL_COMPLAINTS];
  clusters = [...INITIAL_CLUSTERS];
  workOrders = [...INITIAL_WORK_ORDERS];
  iotDevices = [...INITIAL_IOT_DEVICES];
  auditLogs = [...INITIAL_AUDIT_LOGS];
  res.json({ success: true, message: 'Namangan pilot ma\'lumotlari asl holatiga qaytarildi' });
});

// ----------------- VITE DEV / PROD INTEGRATION -----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAHALLA OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
