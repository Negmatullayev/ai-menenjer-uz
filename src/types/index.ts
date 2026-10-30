/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'RESIDENT'
  | 'COMMUNITY_MANAGER'
  | 'PROPERTY_MANAGER'
  | 'SERVICE_ORG'
  | 'CONTRACTOR'
  | 'CITY_ADMIN'
  | 'SUPER_ADMIN';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  organizationId?: string;
  districtId: string;
  neighborhoodId: string;
  buildingId?: string;
  apartmentNumber?: string;
  avatarUrl?: string;
}

export type IssueCategory =
  | 'WATER'
  | 'SEWAGE'
  | 'ELECTRICITY'
  | 'GAS'
  | 'ROADS'
  | 'LIGHTING'
  | 'WASTE'
  | 'LANDSCAPING'
  | 'ELEVATOR'
  | 'HOUSING'
  | 'OTHER';

export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_PARTS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'REOPENED'
  | 'CLOSED';

export interface StatusHistoryItem {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  comment: string;
  evidencePhotoUrl?: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: ComplaintStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
    districtId: string;
    neighborhoodId: string;
    buildingId?: string;
    apartmentNumber?: string;
  };
  photoUrl?: string;
  videoUrl?: string;
  aiAnalysis?: {
    detectedCategory: IssueCategory;
    confidence: number;
    descriptionSummary: string;
    suggestedPriority: IssuePriority;
    isPotentialDuplicate: boolean;
    clusterReason?: string;
  };
  clusterId?: string;
  isDuplicateOf?: string;
  assignedOrgId?: string;
  assignedContractorId?: string;
  assignedWorkerName?: string;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  resolutionEvidence?: {
    beforePhotoUrl: string;
    afterPhotoUrl: string;
    workSummary: string;
    resolvedAt: string;
    citizenConfirmed: boolean;
    citizenRating?: number;
  };
}

export interface ComplaintCluster {
  id: string;
  primaryComplaintId: string;
  childComplaintIds: string[];
  category: IssueCategory;
  centroid: {
    lat: number;
    lng: number;
    address: string;
  };
  totalReports: number;
  similarityScore: number;
  status: 'ACTIVE' | 'MERGED' | 'DISMISSED';
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  complaintId: string;
  assignedOrgName: string;
  contractorName?: string;
  assigneeName: string;
  priority: IssuePriority;
  slaHours: number;
  deadline: string;
  status: 'NEW' | 'ASSIGNED' | 'DISPATCHED' | 'IN_WORK' | 'INSPECTION' | 'COMPLETED' | 'OVERDUE';
  estimatedCostUzs: number;
  materialsRequired: string[];
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export type AssetCategory =
  | 'WATER_PIPE'
  | 'SEWAGE_MAIN'
  | 'TRANSFORMER'
  | 'STREET_LIGHT'
  | 'WASTE_CONTAINER'
  | 'PUMP_STATION'
  | 'ELEVATOR'
  | 'BUILDING_BLOCK';

export interface InfrastructureAsset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
    neighborhood: string;
  };
  installationDate: string;
  technicalCondition: 'OPTIMAL' | 'FAIR' | 'CRITICAL' | 'UNDER_REPAIR';
  healthScore: number; // 0 - 100
  lastInspectionDate: string;
  nextScheduledMaintenance: string;
  responsibleOrg: string;
  specs: Record<string, string | number>;
  activeComplaintsCount: number;
  maintenanceHistory: {
    date: string;
    action: string;
    technician: string;
    costUzs: number;
  }[];
}

export interface IoTDevice {
  id: string;
  deviceId: string;
  name: string;
  assetId?: string;
  assetName: string;
  type: 'WATER_PRESSURE' | 'LEAK_DETECTOR' | 'WASTE_BIN_LEVEL' | 'LIGHT_CONTROLLER' | 'AIR_QUALITY' | 'ELEVATOR_VIBRATION';
  batteryPct: number;
  signalStrengthDbm: number;
  lastPing: string;
  isOnline: boolean;
  telemetry: {
    pressureBar?: number;
    leakDetected?: boolean;
    fillPercentage?: number;
    lightStatus?: 'ON' | 'OFF' | 'FAULT';
    aqi?: number;
    temperatureC?: number;
    vibrationMmS?: number;
  };
  alertActive: boolean;
  alertMessage?: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  districtId: string;
  neighborhoodId: string;
  neighborhoodName: string;
  address: string;
  totalFloors: number;
  totalApartments: number;
  occupiedApartments: number;
  elevatorsCount: number;
  pumpSystemStatus: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  cleaningSchedule: string;
  managerOrgName: string;
  monthlyServiceFeeUzs: number;
  residentsCount: number;
  activeTicketsCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Apartment {
  id: string;
  buildingId: string;
  buildingName: string;
  unitNumber: string;
  floor: number;
  ownerName: string;
  ownerPhone: string;
  areaSqM: number;
  monthlyFeeUzs: number;
  balanceUzs: number; // positive = prepaid, negative = debt
  activeRequestsCount: number;
}

export interface District {
  id: string;
  name: string;
  city: string;
}

export interface Neighborhood {
  id: string;
  districtId: string;
  name: string;
  population: number;
  householdsCount: number;
  chairmanName: string;
  contactPhone: string;
  boundaryCoordinates: { lat: number; lng: number }[];
}

export interface PublicAnnouncement {
  id: string;
  title: string;
  content: string;
  category: 'MAINTENANCE' | 'UTILITY_CUT' | 'EVENT' | 'SECURITY';
  neighborhoodId?: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  isEmergency: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
}
