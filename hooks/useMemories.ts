import { useState, useEffect, useCallback } from 'react';
import {
  MemoryEntry,
  getMemories,
  saveMemory as saveMemoryToStorage,
  deleteMemory as deleteMemoryFromStorage,
} from '@/utils/storage';

interface UseMemoriesResult {
  memories: MemoryEntry[];
  isLoading: boolean;
  save: (memory: MemoryEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMemories(): UseMemoriesResult {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getMemories();
      setMemories(data);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (memory: MemoryEntry) => {
      await saveMemoryToStorage(memory);
      setMemories((prev) => [memory, ...prev]);
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteMemoryFromStorage(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    },
    []
  );

  return { memories, isLoading, save, remove, refresh };
}
