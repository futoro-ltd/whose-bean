'use client';

import { create } from 'zustand';

interface DeleteDomainModal {
  open: boolean;
  domainId: string | null;
  domainName: string | null;
}

interface Alerts {
  error: string;
  success: string;
}

interface UIState {
  deleteDomainModal: DeleteDomainModal;
  alerts: Alerts;
  openDeleteDomainModal: (domainId: string, domainName: string) => void;
  closeDeleteDomainModal: () => void;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
  clearAlerts: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  deleteDomainModal: {
    open: false,
    domainId: null,
    domainName: null,
  },
  alerts: {
    error: '',
    success: '',
  },
  openDeleteDomainModal: (domainId, domainName) =>
    set({
      deleteDomainModal: { open: true, domainId, domainName },
    }),
  closeDeleteDomainModal: () =>
    set({
      deleteDomainModal: { open: false, domainId: null, domainName: null },
    }),
  setError: (message) =>
    set((state) => ({
      alerts: { ...state.alerts, error: message },
    })),
  setSuccess: (message) =>
    set((state) => ({
      alerts: { ...state.alerts, success: message },
    })),
  clearError: () =>
    set((state) => ({
      alerts: { ...state.alerts, error: '' },
    })),
  clearSuccess: () =>
    set((state) => ({
      alerts: { ...state.alerts, success: '' },
    })),
  clearAlerts: () =>
    set({
      alerts: { error: '', success: '' },
    }),
}));
