import { FaceLandmark } from "./faceMesh";

export type BlinkResult = {
  passed: boolean;
  leftEAR: number;
  rightEAR: number;
  averageEAR: number;
  message: string;
};

function distance(a: FaceLandmark, b: FaceLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function calculateEAR(
  landmarks: FaceLandmark[],
  eyeIndices: number[]
): number {
  const p1 = landmarks[eyeIndices[0]];
  const p2 = landmarks[eyeIndices[1]];
  const p3 = landmarks[eyeIndices[2]];
  const p4 = landmarks[eyeIndices[3]];
  const p5 = landmarks[eyeIndices[4]];
  const p6 = landmarks[eyeIndices[5]];

  if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) {
    return 1;
  }

  const vertical1 = distance(p2, p6);
  const vertical2 = distance(p3, p5);
  const horizontal = distance(p1, p4);

  if (horizontal === 0) {
    return 1;
  }

  return (vertical1 + vertical2) / (2.0 * horizontal);
}

/**
 * MediaPipe FaceMesh eye indices:
 * Left eye: 33, 160, 158, 133, 153, 144
 * Right eye: 362, 385, 387, 263, 373, 380
 */
export function detectBlinkFromLandmarks(
  landmarks: FaceLandmark[]
): BlinkResult {
  if (landmarks.length < 468) {
    return {
      passed: false,
      leftEAR: 1,
      rightEAR: 1,
      averageEAR: 1,
      message: `Not enough FaceMesh landmarks detected. Found ${landmarks.length}.`
    };
  }

  const leftEye = [33, 160, 158, 133, 153, 144];
  const rightEye = [362, 385, 387, 263, 373, 380];

  const leftEAR = calculateEAR(landmarks, leftEye);
  const rightEAR = calculateEAR(landmarks, rightEye);
  const averageEAR = (leftEAR + rightEAR) / 2;

  console.log("Blink EAR:", {
    leftEAR,
    rightEAR,
    averageEAR
  });

  const BLINK_THRESHOLD = 0.22;

  const passed = averageEAR < BLINK_THRESHOLD;

  return {
    passed,
    leftEAR,
    rightEAR,
    averageEAR,
    message: passed
      ? `Blink verified. EAR: ${averageEAR.toFixed(3)}`
      : `Blink not detected. EAR: ${averageEAR.toFixed(3)}`
  };
}