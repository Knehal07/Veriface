import { imagePathToTensor } from "../faceValidator";
import { detectFace } from "../blazeFace";
import { cropFace, resizeFace } from "../preprocess";

import { validateHeadTurnChallenge } from "./headPose";
import { runFaceMesh } from "./faceMesh";
import { detectBlinkFromLandmarks } from "./blinkDetector";

import {
  LivenessChallenge,
  saveLivenessResult
} from "../../services/livenessService";

import { addActivityLog } from "../../services/activityLog";

export async function runLivenessChallenge(
  imagePath: string,
  challenge: LivenessChallenge
) {
  const start = Date.now();

  let imageTensor: any = null;
  let cropped: any = null;
  let resized: any = null;

  try {
    imageTensor = await imagePathToTensor(imagePath);

    const [imageHeight, imageWidth] = imageTensor.shape;

    console.log("Liveness image size:", imageWidth, imageHeight);

    const faceBox = await detectFace(imageTensor);

    console.log("Liveness face detection time:", Date.now() - start, "ms");

    if (!faceBox) {
      imageTensor.dispose();

      await addActivityLog(
        "Presence Verification Failed",
        "No face detected during presence verification."
      );

      return {
        success: false,
        message: "No face detected. Please keep your full face inside the frame."
      };
    }

    let passed = false;
    let message = "";

    if (
      challenge === "TURN_HEAD_LEFT" ||
      challenge === "TURN_HEAD_RIGHT"
    ) {
      const headStart = Date.now();

      const result = validateHeadTurnChallenge(
        challenge,
        faceBox,
        imageWidth
      );

      console.log("Head-turn validation time:", Date.now() - headStart, "ms");

      passed = result.passed;
      message = result.message;
    }

    if (challenge === "BLINK_ONCE") {
      const blinkStart = Date.now();

      cropped = cropFace(imageTensor, faceBox);
      resized = resizeFace(cropped, 192);

      const landmarks = await runFaceMesh(resized);
      const blinkResult = detectBlinkFromLandmarks(landmarks);

      console.log("Blink validation time:", Date.now() - blinkStart, "ms");

      passed = blinkResult.passed;
      message = blinkResult.message;
    }

    imageTensor.dispose();
    cropped?.dispose?.();
    resized?.dispose?.();

    await saveLivenessResult({
      challenge,
      passed,
      completedAt: new Date().toLocaleString()
    });

    await addActivityLog(
      passed ? "Presence Verification Passed" : "Presence Verification Failed",
      message
    );

    console.log("Presence verification total time:", Date.now() - start, "ms");

    return {
      success: passed,
      message
    };
  } catch (error) {
    imageTensor?.dispose?.();
    cropped?.dispose?.();
    resized?.dispose?.();

    await addActivityLog(
      "Presence Verification Error",
      String(error)
    );

    console.log("Presence verification error time:", Date.now() - start, "ms");

    return {
      success: false,
      message: String(error)
    };
  }
}