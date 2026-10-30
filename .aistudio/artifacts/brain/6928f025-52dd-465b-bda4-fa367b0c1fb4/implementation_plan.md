# MAHALLA OS — AI-Powered Smart City & Property Management Platform

MAHALLA OS — Namangan shahrining Davlatobod va Yangi Namangan tumanlaridagi mahallalar hamda xususiy turar-joy majmualari (KSK / Boshqaruv kompaniyalari) uchun mo'ljallangan, sun'iy intellekt bilan qurollangan raqamli boshqaruv platformasi. Tizim fuqarolar murojaatlarini AI ko'magida tahlil qilish, dublikatlarni klasterlash, muhandislik infratuzilmasining raqamli egizagi (Digital Twin GIS) va IoT datchiklar telemetriyasini yagona operatsion markazda birlashtiradi.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Quyidagi asosiy yo'nalishlar foydalanuvchi bilan Phase 1 da kelishib olindi va arxitekturaga kiritildi:

- **Birlamchi MVP yo'nalishi (Tasdiqlangan)**: Xususiy turar joy majmualari (Property Management) va KSK (Boshqaruv servis kompaniyalari) hamda mahalla boshqaruvi. Bino, blok, xonadonlar, lift, nasos, tozalash va ta'mirlash xizmatlari to'liq qamrab olinadi.
- **Pilot hudud (Tasdiqlangan)**: Namangan shahri markaziy mahallalari — Davlatobod tumani (Yuksalish, Yangi Tong massivlari) va Yangi Namangan tumani (Afsonalar vodiysi, Bobur massivlari).
- **Sun'iy intellekt (Gemini 3.8 Flash) roli (Tasdiqlangan)**: Suratdan muammoni aniqlash (computer vision), avtomatik toifa va ustuvorlik belgilash, geolokatsiya va matn asosida o'xshash murojaatlarni klasterlash (Smart Duplicate Detection).

---

## 1. Overview & Core Concept

- **Nima qiladi**: Fuqaro o'z xonadoni yoki mahallasi infratuzilmasidagi har qanday muammoni (suv sizishi, elektr nosozligi, chiqindi, lift to'xtashi, yo'l o'yig'i) rasmga olib 30 soniyada yuboradi. AI muammoni tanib, tegishli KSK yoki kommunal xizmatga yo'naltiradi. Operatorlar va bino boshqaruvchilari Digital Twin xaritasida butun hudud holatini real vaqtda kuzatib, SLA bo'yicha topshiriqlarni nazorat qiladi.
- **Auditoriya**: Turar-joy aholisi (Residents), KSK / Property boshqaruvchilari, Mahalla operatorlari, Kommunal tashkilotlar (Suvta'minot, Hududiy elektr, Toza hudud), Xususiy pudratchilar va Shahar monitoring markazi.
- **Asosiy qiymat**: Qog'ozbozlik va telefonda yo'qolib ketadigan shikoyatlarni bartaraf etish, takroriy arizalarni avtomat birlashtirish, xizmat ko'rsatuvchi xodimlar ishini foto-dalil ("oldin" va "keyin") bilan tasdiqlash hamda infratuzilma buzilishlarini erta aniqlash.

---

## 2. User Experience & Visual Design

### Asosiy Foydalanuvchi Oqimlari (Key User Flows)

```
[Fuqaro / Aholi Oqimi]
Uy sahifasi ──> Muammo suratini yuklash ──> Gemini AI tahlili ──> Toifa & Manzil tasdiqlash ──> Murojaat kuzatuvi (Timeline + SLA) ──> Bajarilgan ishni baholash

[Boshqaruvchi / Operator Oqimi]
Boshqaruv Paneli ──> Digital Twin GIS Xaritasi ──> Dublikat klasterlarni birlashtirish ──> Pudratchi/Ustaga topshiriq biriktirish ──> Foto-dalilni tekshirish ──> Murojaatni yopish

[Property / KSK Oqimi]
Bino va Bloklar ──> Xonadonlar & Ijarachilar ──> Lift/Nasos/Uskunalar pasporti ──> Tozalash & Texnik xizmat jadvallari ──> To'lov va xizmat holati
```

### Vizual Identitet va Dizayn Tizimi

- **Estetika**: "Futuristic Smart City & Enterprise Minimal" — ortiqcha gradientlarsiz, toza ma'lumotlar vizualizatsiyasi, aniq tipografik ierarxiya va qulay boshqaruv elementlari.
- **Ranglar palitrasi**:
  - Asosiy fon (60%): Deep Slate & Navy (`#0A0F1D` / `#0F172A`) dark rejimda, toza oq & ochiq kulrang (`#F8FAFC`) light rejimda.
  - Strukturaviy yuzalar (30%): Hairline hoshiyalar (`border-slate-200 dark:border-slate-800`), yumshoq kartalar (`bg-white dark:bg-slate-900/90`).
  - Aktsentlar (10%): Cyan/Electric Sky (`#0EA5E9` va `#06B6D4`) texnologik va AI elementlar uchun, Emerald (`#10B981`) muvaffaqiyat/normal holat uchun, Amber (`#F59E0B`) ogohlantirish uchun, Crimson (`#EF4444`) shoshilinch avariya holatlari uchun.
- **Tipografiya**:
  - Sarlavhalar va brend: `Plus Jakarta Sans` / `Outfit` (aniq geometrik sans).
  - Matn va formalar: `Plus Jakarta Sans` / `DM Sans`.
  - Telemetriya, raqamlar, koordinatalar va hisobotlar: `font-mono tabular-nums` (`JetBrains Mono`).
- **Zero-Pill & Anti-Slop Intizomi**: Statik yorliqlar uchun ortiqcha konfet-belgilar (pill badge sandwich) taqiqlanadi; toza tipografik ajratgichlar (`·`, `/`) ishlatiladi. Faqat bosiluvchi filtr va tablar tugma ko'rinishida beriladi.
- **Ikki xil ixtisoslashgan interfeys**:
  1. *Citizen Mobile View*: Bir qo'l bilan boshqarish uchun pastki 40% ergonomik zonada asosiy tugmalar, tezkor foto-murojaat, timeline kuzatuv.
  2. *Operations & Property Command Center*: Keng 1440px desktop boshqaruvi, interaktiv GIS xaritasi, ko'p qatlamli filtrlar, bino uskunalari monitoringi.

---

## 3. Key Product Decisions & Trade-Offs

- **Qaror 1: Gemini 3.8 Flash orqali server-side multimodal tahlil**
  - *Tanlangan yondashuv*: Fuqaro yuklagan rasmni Express backenddagi `/api/ai/analyze-issue` marshruti orqali `gemini-3.8-flash` modeliga uzatish. Model muammoni tanib, JSON formatida toifa, jiddiylik darajasi (SLA tavsiyasi) va qisqa xulosa beradi.
  - *Sababi*: Xavfsiz API-key boshqaruvi, yuqori tezlik va aniq strukturaviy JSON chiqishi.
  - *Muqobillar*: Client-side tahlil (API key fosh bo'lish xavfi tufayli rad etildi).
- **Qaror 2: Property Management (KSK) va Mahalla GIS integratsiyasi**
  - *Tanlangan yondashuv*: Namangan shahrining Davlatobod ("Yuksalish", "Yangi Tong") va Yangi Namangan tumanlaridagi ko'p qavatli uylar va xususiy turar-joy majmualarini bino-blok-xonadon strukturasi bilan Digital Twin xaritasiga kiritish.
  - *Sababi*: Foydalanuvchi birinchi navbatda xususiy turar joy majmualari boshqaruvini so'raganligi sababli, KSK xizmatlari va shahar kommunal tarmoqlari o'rtasidagi bog'liqlik to'liq modellashtiriladi.
- **Qaror 3: Real vaqtli telemetriya va IoT datchiklar simulyatsiyasi (Demo / Live Mode)**
  - *Tanlangan yondashuv*: Suv bosimi, oqish sensori, lift yuklanishi, axlat qutisi sig'imi va havo sifati (AQI) sensorlari uchun jonli tebranish generatori va kritik o'zgarishlarda avtomatik avariya xabarnomasi chiqarish.
  - *Sababi*: Haqiqiy apparat sensori bo'lmagan sharoitda soxta telemetriya deb yashirmasdan, tizimning haqiqiy MQTT/telemetriya integratsiyasiga tayyorligini isbotlovchi real ma'lumotlar oqimi modeli taqdim etiladi.

---

## 4. Technical Architecture & Data Strategy

### Tizim Arxitekturasi

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MAHALLA OS CLIENT (React 19)                    │
│                                                                        │
│  ┌───────────────────────┐ ┌────────────────────────────────────────┐  │
│  │ Citizen Mobile View   │ │ Enterprise Operations & Property Desk  │  │
│  │ - 1-Click AI Issue    │ │ - GIS Digital Twin (Namangan Layers)   │  │
│  │ - Timeline & Status   │ │ - KSK Building & Apartment Manager     │  │
│  │ - Apartment Services  │ │ - Smart Duplicate Cluster Workbench    │  │
│  │ - Community Feed      │ │ - IoT Telemetry & Alert Center         │  │
│  └───────────┬───────────┘ └───────────────────┬────────────────────┘  │
│              │                                 │                       │
│              └────────────────┬────────────────┘                       │
└───────────────────────────────┼────────────────────────────────────────┘
                                │ REST API / JSON
┌───────────────────────────────▼────────────────────────────────────────┐
│                    NODE.JS / EXPRESS.JS BACKEND                        │
│                                                                        │
│  ┌───────────────────────┐ ┌────────────────────────────────────────┐  │
│  │ API Endpoints         │ │ AI Intelligence Core                   │  │
│  │ /api/complaints       │ │ - Gemini 3.8 Flash Vision Analyzer     │  │
│  │ /api/properties       │ │ - Duplicate Clustering Algorithm       │  │
│  │ /api/digital-twin     │ │ - SLA Risk & Priority Predictor        │  │
│  │ /api/iot-telemetry    │ │                                        │  │
│  │ /api/work-orders      │ │                                        │  │
│  └───────────┬───────────┘ └───────────────────┬────────────────────┘  │
│              │                                 │                       │
│  ┌───────────▼─────────────────────────────────▼────────────────────┐  │
│  │ Persistent Store & In-Memory Index (GeoJSON + Relations)         │  │
│  │ - 30+ relational entity models (Complaints, Assets, Buildings...) │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Ma'lumotlar Modellari (Core Schema Entities)

1. **User & Auth**: `id, phone, full_name, role (RESIDENT | COMMUNITY_MANAGER | PROPERTY_MANAGER | SERVICE_ORG | CONTRACTOR | CITY_ADMIN | SUPER_ADMIN), district_id, neighborhood_id, apartment_id`
2. **City & District**: Namangan shahri, Davlatobod tumani, Yangi Namangan tumani, Mahallalar (Yuksalish, Mustaqillik, Yangi Tong, Afsonalar, Bobur).
3. **Property & Building (KSK)**: `id, name, address, total_blocks, total_apartments, elevators_count, pump_system_status, manager_org_id, monthly_service_fee`.
4. **Apartment**: `id, building_id, unit_number, floor, resident_id, debt_amount, contract_status`.
5. **Complaint / Murojaat**: `id, citizen_id, title, description, category_id, photo_url, location (lat, lng, address), status (SUBMITTED ... RESOLVED), priority (LOW, MEDIUM, HIGH, EMERGENCY), ai_confidence, cluster_id, created_at, updated_at`.
6. **WorkOrder**: `id, complaint_id, assigned_org_id, contractor_id, assignee_name, deadline_sla, status, cost_estimate, materials_used, before_photo_url, after_photo_url, completed_at`.
7. **InfrastructureAsset (Digital Twin)**: `id, asset_tag, name, category (WATER_PIPE, TRANSFORMER, TRASH_CONTAINER, LIGHT_POST, PUMP_STATION, ELEVATOR), location, install_date, technical_condition, last_maintenance, health_score`.
8. **IoTDevice & Telemetry**: `id, asset_id, device_type, battery_pct, last_ping, metrics (pressure_bar, leak_detected, fill_level_pct, aqi, temp_c), alert_active`.
9. **ComplaintCluster (Smart Duplicate)**: `id, primary_complaint_id, child_complaint_ids, centroid_lat, centroid_lng, radius_meters, similarity_score`.
10. **AuditLog**: `id, entity_type, entity_id, actor_id, action, timestamp, metadata`.

---

## 5. Bosqichma-bosqich Implementatsiya Rejasi (MVP Roadmap)

- [ ] **Bosqich 1: Loyiha strukturasi va Backend poydevori**
  - Express backend serverini yo'lga qo'yish (`server.ts`).
  - Ma'lumotlar ombori (JSON/in-memory persistent service) va dastlabki Namangan pilot ma'lumotlarini (Davlatobod va Yangi Namangan mahallalari, ko'p qavatli massivlar, infratuzilma obyektlari) yuklash.
  - Gemini 3.8 Flash API integratsiyasi: muammoni suratdan aniqlash, toifa/ustuvorlik belgilash va dublikat klasterlarni hisoblash.
- [ ] **Bosqich 2: Dizayn tizimi va Rol almashtirish vositasi**
  - Tailwind v4 mavzusi, qulay navigatsiya, dark/light rejim.
  - Yuqori paneldagi bitta bosish bilan rollarni (Fuqaro, Mahalla operatori, KSK boshqaruvchisi, Kommunal xizmat, Pudratchi, Shahar hokimi) almashtirib sinab ko'rish imkoniyati.
- [ ] **Bosqich 3: Citizen Mobile Application**
  - Zamonaviy mobile-first bosh sahifa.
  - AI ko'magida tezkor shikoyat/murojaat yuborish (kamera/rasm yuklash, AI auto-tagging, geolokatsiya).
  - Mening murojaatlarim: real vaqtli status timeline, ijrochi aloqasi va "Oldin / Keyin" natijasi.
  - KSK va xonadon xizmatlari (tozalash jadvali, hisob-kitob, lift/nasos holati).
- [ ] **Bosqich 4: Property Management & KSK Moduli**
  - Turar-joy binolari, bloklar va xonadonlar reyestri.
  - Muhandislik jihozlari pasportlari (liftlar, gidroforlar, yong'in xavfsizligi).
  - Profilaktik texnik xizmat ko'rsatish jadvali va arizalarni qabul qilish.
- [ ] **Bosqich 5: Digital Mahalla Twin & GIS Xaritasi**
  - Namangan shahri, Davlatobod va Yangi Namangan tumanlari interaktiv xaritasi (SVG/Canvas GIS).
  - Qatlamlar (Layers): Suv quvurlari, transformatorlar, ko'cha chiroqlari, chiqindi punktlari, bino bloklari.
  - Har bir infratuzilma obyektining raqamli pasporti va ta'mirlar tarixi.
- [ ] **Bosqich 6: Smart Duplicate Detection & Task Management (Ish topshiriqlari)**
  - Operatorlar uchun o'xshash murojaatlarni bitta klasterga birlashtirish oynasi.
  - Xizmat ko'rsatuvchi tashkilotlar va pudratchilarga vazifa biriktirish, SLA hisoblagichi, material/xarajat qaydnomasi.
  - "Oldin" va "Keyin" rasmli dalil bilan topshiriqni tasdiqlash va yopish.
- [ ] **Bosqich 7: IoT Telemetriya & Sensor Monitoring (Live Demo)**
  - Suv bosimi, to'lish darajasi, yorug'lik va havo sifati datchiklari.
  - Jonli yangilanishlar va avariya chegarasi buzilganda avtomatik signal (Emergency alert).
- [ ] **Bosqich 8: Analytics, Audit Logs & Tekshiruv**
  - Shahar va KSK samaradorlik hisobotlari, o'rtacha hal qilish vaqti, takrorlanuvchi nuqsonlar.
  - Harakatlar tarixi (Audit logs) va to'liq tizim integratsiya testi (`compile_applet`).
