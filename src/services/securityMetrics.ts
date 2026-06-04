import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_MATCH_SCORE_KEY = "FACELOCK_LAST_MATCH_SCORE";
const LAST_LOGIN_TIME_KEY = "FACELOCK_LAST_LOGIN_TIME";

export async function saveLastMatchScore(score: number) {
  await AsyncStorage.setItem(LAST_MATCH_SCORE_KEY, score.toString());
  await AsyncStorage.setItem(LAST_LOGIN_TIME_KEY, new Date().toLocaleString());
}

export async function getLastMatchScore(): Promise<number | null> {
  const value = await AsyncStorage.getItem(LAST_MATCH_SCORE_KEY);

  if (!value) {
    return null;
  }

  return Number(value);
}

export async function getLastLoginTime(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_LOGIN_TIME_KEY);
}

export async function clearSecurityMetrics() {
  await AsyncStorage.removeItem(LAST_MATCH_SCORE_KEY);
  await AsyncStorage.removeItem(LAST_LOGIN_TIME_KEY);
}