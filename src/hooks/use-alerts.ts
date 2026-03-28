'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/ui-store';

const DEFAULT_AUTO_CLEAR_DELAY = 5000;

export function useAlerts() {
  const {
    alerts,
    setError: storeSetError,
    setSuccess: storeSetSuccess,
    clearError: storeClearError,
    clearSuccess: storeClearSuccess,
    clearAlerts: storeClearAlerts,
  } = useUIStore();

  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
    storeClearError();
  }, [storeClearError]);

  const clearSuccess = useCallback(() => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    storeClearSuccess();
  }, [storeClearSuccess]);

  const clearAlerts = useCallback(() => {
    clearError();
    clearSuccess();
    storeClearAlerts();
  }, [clearError, clearSuccess, storeClearAlerts]);

  // Auto-clear error after delay
  useEffect(() => {
    if (alerts.error) {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(() => {
        clearError();
      }, DEFAULT_AUTO_CLEAR_DELAY);
    }

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = null;
      }
    };
  }, [alerts.error, clearError]);

  // Auto-clear success after delay
  useEffect(() => {
    if (alerts.success) {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        clearSuccess();
      }, DEFAULT_AUTO_CLEAR_DELAY);
    }

    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [alerts.success, clearSuccess]);

  const setError = (message: string) => {
    clearAlerts();
    storeSetError(message);
  };

  const setSuccess = (message: string) => {
    clearAlerts();
    storeSetSuccess(message);
  };

  return {
    error: alerts.error,
    success: alerts.success,
    setError,
    setSuccess,
    defaultAutoClearDelay: DEFAULT_AUTO_CLEAR_DELAY,
  };
}
