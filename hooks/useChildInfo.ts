import { useState, useEffect, useCallback } from 'react';
import { ChildInfo, getChildInfo, saveChildInfo, clearChildInfo } from '@/utils/storage';

interface UseChildInfoResult {
  childInfo: ChildInfo | null;
  isLoading: boolean;
  save: (info: ChildInfo) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useChildInfo(): UseChildInfoResult {
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const info = await getChildInfo();
      setChildInfo(info);
    } catch (error) {
      console.error('Failed to load child info:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (info: ChildInfo) => {
    await saveChildInfo(info);
    setChildInfo(info);
  }, []);

  const clear = useCallback(async () => {
    await clearChildInfo();
    setChildInfo(null);
  }, []);

  return { childInfo, isLoading, save, clear, refresh };
}
