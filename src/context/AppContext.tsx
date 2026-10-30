/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Complaint,
  ComplaintCluster,
  WorkOrder,
  InfrastructureAsset,
  IoTDevice,
  Building,
  Apartment,
  District,
  Neighborhood,
  PublicAnnouncement,
  AuditLogItem,
  User,
  UserRole,
  ComplaintStatus,
} from '../types';

interface AppContextType {
  // State
  complaints: Complaint[];
  clusters: ComplaintCluster[];
  workOrders: WorkOrder[];
  assets: InfrastructureAsset[];
  iotDevices: IoTDevice[];
  buildings: Building[];
  apartments: Apartment[];
  districts: District[];
  neighborhoods: Neighborhood[];
  announcements: PublicAnnouncement[];
  auditLogs: AuditLogItem[];
  users: User[];
  isLoading: boolean;
  error: string | null;

  // View & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User | undefined;
  viewMode: 'CITIZEN' | 'OPERATIONS';
  setViewMode: (mode: 'CITIZEN' | 'OPERATIONS') => void;
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;
  selectedNeighborhoodId: string;
  setSelectedNeighborhoodId: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;

  // Actions
  refreshState: () => Promise<void>;
  createComplaint: (data: Partial<Complaint>) => Promise<Complaint | null>;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    comment?: string,
    evidencePhotoUrl?: string,
    beforePhotoUrl?: string,
    afterPhotoUrl?: string
  ) => Promise<boolean>;
  createWorkOrder: (orderData: Partial<WorkOrder>) => Promise<boolean>;
  mergeCluster: (primaryId: string, duplicateIds: string[]) => Promise<boolean>;
  triggerIoTAlert: (deviceId: string, alertActive?: boolean, value?: number) => Promise<boolean>;
  analyzeIssueWithAI: (
    imageBase64?: string,
    textPrompt?: string
  ) => Promise<{
    detectedCategory: string;
    confidence: number;
    suggestedTitle: string;
    descriptionSummary: string;
    suggestedPriority: string;
    recommendedAction?: string;
    estimatedSlaHours?: number;
  } | null>;
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [clusters, setClusters] = useState<ComplaintCluster[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [assets, setAssets] = useState<InfrastructureAsset[]>([]);
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentRole, setCurrentRole] = useState<UserRole>('RESIDENT');
  const [viewMode, setViewMode] = useState<'CITIZEN' | 'OPERATIONS'>('CITIZEN');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Theme setup
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Sync dark class on html
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const fetchState = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Ma\'lumotlarni yuklab bo\'lmadi');
      const data = await res.json();
      setComplaints(data.complaints || []);
      setClusters(data.clusters || []);
      setWorkOrders(data.workOrders || []);
      setAssets(data.assets || []);
      setIotDevices(data.iotDevices || []);
      setBuildings(data.buildings || []);
      setApartments(data.apartments || []);
      setDistricts(data.districts || []);
      setNeighborhoods(data.neighborhoods || []);
      setAnnouncements(data.announcements || []);
      setAuditLogs(data.auditLogs || []);
      setUsers(data.users || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Sync viewMode when role changes
  useEffect(() => {
    if (currentRole === 'RESIDENT') {
      setViewMode('CITIZEN');
    } else {
      setViewMode('OPERATIONS');
    }
  }, [currentRole]);

  const currentUser = users.find((u) => u.role === currentRole) || users[0];

  const createComplaint = async (data: Partial<Complaint>): Promise<Complaint | null> => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          citizenId: currentUser?.id,
          citizenName: currentUser?.fullName,
          citizenPhone: currentUser?.phone,
        }),
      });
      const result = await res.json();
      if (result.success && result.complaint) {
        await fetchState();
        return result.complaint;
      }
      return null;
    } catch (err) {
      console.error('Error creating complaint:', err);
      return null;
    }
  };

  const updateComplaintStatus = async (
    id: string,
    status: ComplaintStatus,
    comment?: string,
    evidencePhotoUrl?: string,
    beforePhotoUrl?: string,
    afterPhotoUrl?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          actorName: currentUser?.fullName || 'Operator',
          actorRole: currentRole,
          comment,
          evidencePhotoUrl,
          beforePhotoUrl,
          afterPhotoUrl,
        }),
      });
      const result = await res.json();
      if (result.success) {
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating complaint status:', err);
      return false;
    }
  };

  const createWorkOrder = async (orderData: Partial<WorkOrder>): Promise<boolean> => {
    try {
      const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (result.success) {
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating work order:', err);
      return false;
    }
  };

  const mergeCluster = async (primaryId: string, duplicateIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/clusters/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryId, duplicateIds }),
      });
      const result = await res.json();
      if (result.success) {
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error merging cluster:', err);
      return false;
    }
  };

  const triggerIoTAlert = async (
    deviceId: string,
    alertActive?: boolean,
    value?: number
  ): Promise<boolean> => {
    try {
      const dev = iotDevices.find((d) => d.id === deviceId);
      const res = await fetch('/api/iot/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          type: dev?.type,
          alertActive,
          value,
        }),
      });
      const result = await res.json();
      if (result.success) {
        await fetchState();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error triggering IoT:', err);
      return false;
    }
  };

  const analyzeIssueWithAI = async (
    imageBase64?: string,
    textPrompt?: string
  ) => {
    try {
      const res = await fetch('/api/ai/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, textPrompt }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
      return null;
    } catch (err) {
      console.error('Error with AI analysis:', err);
      return null;
    }
  };

  const resetDemoData = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
      await fetchState();
    } catch (err) {
      console.error('Error resetting demo:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        complaints,
        clusters,
        workOrders,
        assets,
        iotDevices,
        buildings,
        apartments,
        districts,
        neighborhoods,
        announcements,
        auditLogs,
        users,
        isLoading,
        error,
        currentRole,
        setCurrentRole,
        currentUser,
        viewMode,
        setViewMode,
        selectedDistrictId,
        setSelectedDistrictId,
        selectedNeighborhoodId,
        setSelectedNeighborhoodId,
        theme,
        toggleTheme,
        isCreateModalOpen,
        setIsCreateModalOpen,
        refreshState: fetchState,
        createComplaint,
        updateComplaintStatus,
        createWorkOrder,
        mergeCluster,
        triggerIoTAlert,
        analyzeIssueWithAI,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
