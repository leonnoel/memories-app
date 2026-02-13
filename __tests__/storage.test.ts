import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getChildInfo,
  saveChildInfo,
  clearChildInfo,
  getMemories,
  saveMemory,
  deleteMemory,
  clearAllData,
  ChildInfo,
  MemoryEntry,
} from '../utils/storage';

// AsyncStorage is auto-mocked by jest-expo
beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('Child Info', () => {
  const testChild: ChildInfo = {
    name: 'Emma',
    birthday: '2024-06-15T00:00:00.000Z',
  };

  it('returns null when no child info saved', async () => {
    const result = await getChildInfo();
    expect(result).toBeNull();
  });

  it('saves and retrieves child info', async () => {
    await saveChildInfo(testChild);
    const result = await getChildInfo();
    expect(result).toEqual(testChild);
  });

  it('overwrites existing child info', async () => {
    await saveChildInfo(testChild);
    const updated = { name: 'Oliver', birthday: '2025-01-01T00:00:00.000Z' };
    await saveChildInfo(updated);
    const result = await getChildInfo();
    expect(result).toEqual(updated);
  });

  it('clears child info', async () => {
    await saveChildInfo(testChild);
    await clearChildInfo();
    const result = await getChildInfo();
    expect(result).toBeNull();
  });
});

describe('Memories', () => {
  const testMemory: MemoryEntry = {
    id: '1',
    frameId: 'mountain',
    date: '2026-02-13T00:00:00.000Z',
    ageLabel: '1 year & 8 months',
    thumbnail: 'data:image/png;base64,abc',
  };

  it('returns empty array when no memories saved', async () => {
    const result = await getMemories();
    expect(result).toEqual([]);
  });

  it('saves and retrieves a memory', async () => {
    await saveMemory(testMemory);
    const result = await getMemories();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testMemory);
  });

  it('saves newest memory first', async () => {
    const memory1 = { ...testMemory, id: '1' };
    const memory2 = { ...testMemory, id: '2' };
    await saveMemory(memory1);
    await saveMemory(memory2);
    const result = await getMemories();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('2'); // newest first
    expect(result[1].id).toBe('1');
  });

  it('deletes a specific memory', async () => {
    const memory1 = { ...testMemory, id: '1' };
    const memory2 = { ...testMemory, id: '2' };
    await saveMemory(memory1);
    await saveMemory(memory2);
    await deleteMemory('1');
    const result = await getMemories();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('handles deleting non-existent memory gracefully', async () => {
    await saveMemory(testMemory);
    await deleteMemory('nonexistent');
    const result = await getMemories();
    expect(result).toHaveLength(1);
  });
});

describe('clearAllData', () => {
  it('clears both child info and memories', async () => {
    await saveChildInfo({ name: 'Emma', birthday: '2024-06-15T00:00:00.000Z' });
    await saveMemory({
      id: '1',
      frameId: 'mountain',
      date: '2026-02-13T00:00:00.000Z',
      ageLabel: '1 year',
      thumbnail: 'data:image/png;base64,abc',
    });
    await clearAllData();
    const childInfo = await getChildInfo();
    const memories = await getMemories();
    expect(childInfo).toBeNull();
    expect(memories).toEqual([]);
  });
});
