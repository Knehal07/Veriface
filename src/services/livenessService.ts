import AsyncStorage from "@react-native-async-storage/async-storage";

const LIVENESS_KEY = "FACELOCK_LAST_LIVENESS_RESULT";

export type LivenessChallenge =
  | "TURN_HEAD_LEFT"
  | "TURN_HEAD_RIGHT"
  | "BLINK_ONCE";

export type LivenessResult = {
  challenge: LivenessChallenge;
  passed: boolean;
  completedAt: string;
};

const CHALLENGES: LivenessChallenge[] = [
  "TURN_HEAD_LEFT",
  "TURN_HEAD_RIGHT",
 /* "BLINK_ONCE" */
];

export function getRandomLivenessChallenge(): LivenessChallenge {
  const index = Math.floor(Math.random() * CHALLENGES.length);
  return CHALLENGES[index];
}

export function getChallengeText(challenge: LivenessChallenge): string {
  switch (challenge) {
    case "TURN_HEAD_LEFT":
      return "Turn your face slightly to the left";

    case "TURN_HEAD_RIGHT":
      return "Turn your face slightly to the right";

    case "BLINK_ONCE":
      return "Blink once naturally";

    default:
      return "Complete the presence verification step";
  }
}

export async function saveLivenessResult(result: LivenessResult) {
  await AsyncStorage.setItem(LIVENESS_KEY, JSON.stringify(result));
}

export async function getLastLivenessResult(): Promise<LivenessResult | null> {
  const data = await AsyncStorage.getItem(LIVENESS_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export async function clearLivenessResult() {
  await AsyncStorage.removeItem(LIVENESS_KEY);
}