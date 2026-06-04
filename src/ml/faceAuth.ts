import { validateFaceFromImage } from "./faceValidator";
import { getFaceEmbedding } from "./mobileFaceNet";
import { cosineSimilarity } from "./similarity";

import {
  saveFaceEmbedding,
  getStoredFaceEmbedding
} from "../services/faceStorage";

import { addActivityLog } from "../services/activityLog";
import { saveLastMatchScore } from "../services/securityMetrics";

const MATCH_THRESHOLD = 0.40;

export async function registerFace(imagePath: string) {
  const start = Date.now();

  const result = await validateFaceFromImage(imagePath);

  console.log("Registration face validation time:", Date.now() - start, "ms");

  if (!result.valid || !result.faceTensor) {
    return {
      success: false,
      message: result.message
    };
  }

  const embeddingStart = Date.now();

  const embedding = await getFaceEmbedding(result.faceTensor);

  console.log("Registration embedding time:", Date.now() - embeddingStart, "ms");
  console.log("Registration total time:", Date.now() - start, "ms");
  console.log("Generated registration embedding:", embedding.length);

  result.faceTensor.dispose();

  if (!embedding || embedding.length === 0) {
    return {
      success: false,
      message: "Failed to generate face embedding."
    };
  }

  await saveFaceEmbedding(embedding);

  await addActivityLog(
    "Face Registered",
    "New face embedding saved securely on this device."
  );

  return {
    success: true,
    message: "Face registered successfully. You can now login."
  };
}

export async function loginWithFace(imagePath: string) {
  const start = Date.now();

  const storedEmbedding = await getStoredFaceEmbedding();

  if (!storedEmbedding) {
    return {
      success: false,
      message: "No registered face found. Please register first."
    };
  }

  const result = await validateFaceFromImage(imagePath);

  console.log("Login face validation time:", Date.now() - start, "ms");

  if (!result.valid || !result.faceTensor) {
    return {
      success: false,
      message: result.message
    };
  }

  const embeddingStart = Date.now();

  const currentEmbedding = await getFaceEmbedding(result.faceTensor);

  console.log("Login embedding time:", Date.now() - embeddingStart, "ms");

  result.faceTensor.dispose();

  const score = cosineSimilarity(currentEmbedding, storedEmbedding);

  console.log("Face match score:", score);
  console.log("Login total time:", Date.now() - start, "ms");

  if (score >= MATCH_THRESHOLD) {
    await saveLastMatchScore(score);

    await addActivityLog(
      "Login Successful",
      `Face matched with score ${score.toFixed(3)}`
    );

    return {
      success: true,
      message: `Login successful. Match score: ${score.toFixed(3)}`
    };
  }

  await addActivityLog(
    "Login Failed",
    `Face match failed with score ${score.toFixed(3)}`
  );

  return {
    success: false,
    message: `Face not matched. Score: ${score.toFixed(
      3
    )}. Try again with face centered and same lighting.`
  };
}

export async function verifyFaceOnly(imagePath: string) {
  const start = Date.now();

  const storedEmbedding = await getStoredFaceEmbedding();

  if (!storedEmbedding) {
    return {
      success: false,
      message: "No registered face found. Please register first."
    };
  }

  const result = await validateFaceFromImage(imagePath);

  console.log("Protected verification validation time:", Date.now() - start, "ms");

  if (!result.valid || !result.faceTensor) {
    return {
      success: false,
      message: result.message
    };
  }

  const embeddingStart = Date.now();

  const currentEmbedding = await getFaceEmbedding(result.faceTensor);

  console.log("Protected verification embedding time:", Date.now() - embeddingStart, "ms");

  result.faceTensor.dispose();

  const score = cosineSimilarity(currentEmbedding, storedEmbedding);

  console.log("Protected verification score:", score);
  console.log("Protected verification total time:", Date.now() - start, "ms");

  if (score >= MATCH_THRESHOLD) {
    await addActivityLog(
      "Protected Identity Verified",
      `Protected action verified with score ${score.toFixed(3)}`
    );

    return {
      success: true,
      message: `Identity verified. Score: ${score.toFixed(3)}`
    };
  }

  await addActivityLog(
    "Protected Verification Failed",
    `Protected action failed with score ${score.toFixed(3)}`
  );

  return {
    success: false,
    message: `Verification failed. Score: ${score.toFixed(3)}`
  };
}