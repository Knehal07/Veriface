import AsyncStorage from "@react-native-async-storage/async-storage";

export type SyncStatus = "pending_sync" | "synced" | "failed";

export type SyncRecordType =
  | "attendance"
  | "secure_proof"
  | "activity_log"
  | "security_metric";

export type SyncQueueRecord = {
  id: string;
  type: SyncRecordType;
  payload: unknown;
  syncStatus: SyncStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  lastError?: string;
};

const SYNC_QUEUE_KEY = "FACELOCK_SYNC_QUEUE";
const MAX_RETRY_COUNT = 3;
const SYNCED_RECORD_RETENTION_DAYS = 30;

export async function addToSyncQueue(
  type: SyncRecordType,
  payload: unknown
): Promise<SyncQueueRecord> {
  const queue = await getSyncQueue();

  const now = new Date().toISOString();

  const record: SyncQueueRecord = {
    id: `${type}-${Date.now()}`,
    type,
    payload,
    syncStatus: "pending_sync",
    retryCount: 0,
    createdAt: now,
    updatedAt: now
  };

  const updatedQueue = [record, ...queue];

  await saveSyncQueue(updatedQueue);

  console.log("Added record to sync queue:", record.id);

  return record;
}

export async function getSyncQueue(): Promise<SyncQueueRecord[]> {
  const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.log("Failed to parse sync queue:", error);
    return [];
  }
}

async function saveSyncQueue(queue: SyncQueueRecord[]) {
  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export async function getPendingSyncRecords(): Promise<SyncQueueRecord[]> {
  const queue = await getSyncQueue();

  return queue.filter(
    item =>
      item.syncStatus === "pending_sync" ||
      (item.syncStatus === "failed" && item.retryCount < MAX_RETRY_COUNT)
  );
}

export async function markRecordSynced(recordId: string) {
  const queue = await getSyncQueue();
  const now = new Date().toISOString();

  const updatedQueue = queue.map(item => {
    if (item.id !== recordId) {
      return item;
    }

    return {
      ...item,
      syncStatus: "synced" as SyncStatus,
      updatedAt: now,
      syncedAt: now,
      lastError: undefined
    };
  });

  await saveSyncQueue(updatedQueue);
}

export async function markRecordFailed(
  recordId: string,
  errorMessage: string
) {
  const queue = await getSyncQueue();
  const now = new Date().toISOString();

  const updatedQueue = queue.map(item => {
    if (item.id !== recordId) {
      return item;
    }

    return {
      ...item,
      syncStatus: "failed" as SyncStatus,
      retryCount: item.retryCount + 1,
      updatedAt: now,
      lastError: errorMessage
    };
  });

  await saveSyncQueue(updatedQueue);
}

export async function purgeSyncedRecords(
  retentionDays = SYNCED_RECORD_RETENTION_DAYS
) {
  const queue = await getSyncQueue();

  const now = Date.now();
  const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

  const updatedQueue = queue.filter(item => {
    if (item.syncStatus !== "synced") {
      return true;
    }

    if (!item.syncedAt) {
      return true;
    }

    const syncedTime = new Date(item.syncedAt).getTime();

    return now - syncedTime < retentionMs;
  });

  await saveSyncQueue(updatedQueue);

  return {
    before: queue.length,
    after: updatedQueue.length,
    removed: queue.length - updatedQueue.length
  };
}

export async function clearSyncQueue() {
  await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
}

export async function getSyncSummary() {
  const queue = await getSyncQueue();

  const pending = queue.filter(
    item => item.syncStatus === "pending_sync"
  ).length;

  const synced = queue.filter(
    item => item.syncStatus === "synced"
  ).length;

  const failed = queue.filter(
    item => item.syncStatus === "failed"
  ).length;

  return {
    total: queue.length,
    pending,
    synced,
    failed
  };
}

export async function runOfflineToOnlineSync() {
  const pendingRecords = await getPendingSyncRecords();

  console.log("Pending sync records:", pendingRecords.length);

  for (const record of pendingRecords) {
    try {
      await mockUploadRecord(record);

      await markRecordSynced(record.id);

      console.log("Synced record:", record.id);
    } catch (error) {
      await markRecordFailed(record.id, String(error));

      console.log("Failed to sync record:", record.id, error);
    }
  }

  await purgeSyncedRecords();

  return getSyncSummary();
}

async function mockUploadRecord(record: SyncQueueRecord) {
  console.log("Mock uploading record:", record.id, record.type);

  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true
  };
}