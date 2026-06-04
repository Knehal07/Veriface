import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentLocation } from "./locationService";
import { addToSyncQueue } from "./syncService";

const ATTENDANCE_KEY = "FACELOCK_ATTENDANCE_RECORDS";

export type AttendanceRecord = {
  id: string;
  time: string;
  status: "verified";
  method: "face-auth";
  latitude: number;
  longitude: number;
  accuracy: number;
  mapUrl: string;
};

export async function markAttendance() {
  const location = await getCurrentLocation();

  const records = await getAttendanceRecords();

  const newRecord: AttendanceRecord = {
    id: Date.now().toString(),
    time: new Date().toLocaleString(),
    status: "verified",
    method: "face-auth",
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    mapUrl: location.mapUrl
  };

  const updated = [newRecord, ...records].slice(0, 20);

  await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updated));

  await addToSyncQueue("attendance", newRecord);

  return newRecord;
}

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  const data = await AsyncStorage.getItem(ATTENDANCE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function clearAttendanceRecords() {
  await AsyncStorage.removeItem(ATTENDANCE_KEY);
}