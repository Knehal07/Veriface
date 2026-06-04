import { FaceBox } from "../preprocess";
import { LivenessChallenge } from "../../services/livenessService";

export type HeadTurnResult = {
  passed: boolean;
  detectedDirection: "LEFT" | "RIGHT" | "CENTER" | "UNKNOWN";
  message: string;
};

/**
 * Practical offline approximation:
 * We infer head turn using face box position/asymmetry.
 *
 * This works as a first liveness step, but keypoint-based detection
 * will be stronger later.
 */
export function estimateHeadTurnFromFaceBox(
  faceBox: FaceBox,
  imageWidth: number
): "LEFT" | "RIGHT" | "CENTER" | "UNKNOWN" {
  const faceCenterX = (faceBox.x1 + faceBox.x2) / 2;
  const imageCenterX = imageWidth / 2;

  const offsetRatio = (faceCenterX - imageCenterX) / imageWidth;

  console.log("Head pose offset ratio:", offsetRatio);

  if (offsetRatio < -0.08) {
    return "LEFT";
  }

  if (offsetRatio > 0.08) {
    return "RIGHT";
  }

  return "CENTER";
}

export function validateHeadTurnChallenge(
  challenge: LivenessChallenge,
  faceBox: FaceBox,
  imageWidth: number
): HeadTurnResult {
  const detectedDirection = estimateHeadTurnFromFaceBox(faceBox, imageWidth);

  const expectedDirection =
    challenge === "TURN_HEAD_LEFT" ? "LEFT" : "RIGHT";

  const passed = detectedDirection === expectedDirection;

  return {
    passed,
    detectedDirection,
    message: passed
      ? `Liveness passed. Detected head turn: ${detectedDirection}`
      : `Liveness failed. Expected ${expectedDirection}, detected ${detectedDirection}.`
  };
}