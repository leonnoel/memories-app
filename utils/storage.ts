import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CHILD_INFO: '@little_moments/child_info',
  MEMORIES: '@little_moments/memories',
} as const;

export interface ChildInfo {
  name: string;
  birthday: string; // ISO date string
}

export interface MemoryEntry {
  id: string;
  frameId: string;
  date: string; // ISO date string
  ageLabel: string;
  thumbnail: string; // base64 data URI
}

// Child Info
export async function getChildInfo(): Promise<ChildInfo | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.CHILD_INFO);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function saveChildInfo(info: ChildInfo): Promise<void> {
  await AsyncStorage.setItem(KEYS.CHILD_INFO, JSON.stringify(info));
}

export async function clearChildInfo(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.CHILD_INFO);
}

// Memories
export async function getMemories(): Promise<MemoryEntry[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.MEMORIES);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveMemory(memory: MemoryEntry): Promise<void> {
  const memories = await getMemories();
  memories.unshift(memory); // newest first
  await AsyncStorage.setItem(KEYS.MEMORIES, JSON.stringify(memories));
}

export async function deleteMemory(id: string): Promise<void> {
  const memories = await getMemories();
  const filtered = memories.filter((m) => m.id !== id);
  await AsyncStorage.setItem(KEYS.MEMORIES, JSON.stringify(filtered));
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.CHILD_INFO, KEYS.MEMORIES]);
}
