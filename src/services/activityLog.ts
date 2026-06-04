import AsyncStorage from "@react-native-async-storage/async-storage";

const LOG_KEY = "FACELOCK_ACTIVITY_LOG";

export type ActivityLogItem = {
  id: string;
  title: string;
  message: string;
  time: string;
};

export async function addActivityLog(title: string, message: string) {
  const existing = await getActivityLogs();

  const newLog: ActivityLogItem = {
    id: Date.now().toString(),
    title,
    message,
    time: new Date().toLocaleString()
  };

  const updated = [newLog, ...existing].slice(0, 10);

  await AsyncStorage.setItem(LOG_KEY, JSON.stringify(updated));
}

export async function getActivityLogs(): Promise<ActivityLogItem[]> {
  const data = await AsyncStorage.getItem(LOG_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function clearActivityLogs() {
  await AsyncStorage.removeItem(LOG_KEY);
}