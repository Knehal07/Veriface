import * as tf from "@tensorflow/tfjs";
import jpeg from "jpeg-js";
import RNFS from "react-native-fs";

import { initTensorFlowJS } from "./tfSetup";
import { detectFace } from "./blazeFace";
import { cropFace, resizeFace } from "./preprocess";
import { cropAndResizeFaceFast } from "./preprocess";
export type FaceValidationResult = {
  valid: boolean;
  message: string;
  faceTensor?: tf.Tensor3D;
};

const MAX_IMAGE_WIDTH = 320;

export async function imagePathToTensor(path: string): Promise<tf.Tensor3D> {
  await initTensorFlowJS();

  const cleanPath = path.replace("file://", "");

  console.log("Reading image from:", cleanPath);

  const base64 = await RNFS.readFile(cleanPath, "base64");
  const raw = Buffer.from(base64, "base64");

  const decoded = jpeg.decode(raw, {
    useTArray: true,
    tolerantDecoding: true
  });

  const { width, height, data } = decoded;

  console.log("Original decoded image size:", width, height);

  const scale = width > MAX_IMAGE_WIDTH ? MAX_IMAGE_WIDTH / width : 1;

  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  console.log("Resized tensor image size:", targetWidth, targetHeight);

  const buffer = new Float32Array(targetWidth * targetHeight * 3);

  let offset = 0;

  for (let y = 0; y < targetHeight; y++) {
    const sourceY = Math.floor(y / scale);

    for (let x = 0; x < targetWidth; x++) {
      const sourceX = Math.floor(x / scale);
      const sourceIndex = (sourceY * width + sourceX) * 4;

      buffer[offset++] = data[sourceIndex];
      buffer[offset++] = data[sourceIndex + 1];
      buffer[offset++] = data[sourceIndex + 2];
    }
  }

  return tf.tensor3d(buffer, [targetHeight, targetWidth, 3], "float32");
}

export async function validateFaceFromImage(
  imagePath: string
): Promise<FaceValidationResult> {
  const totalStart = Date.now();

  let imageTensor: tf.Tensor3D | null = null;
  let resized: tf.Tensor3D | null = null;

  try {
    console.log("Starting face validation");

    await initTensorFlowJS();

    const tensorStart = Date.now();

    imageTensor = await imagePathToTensor(imagePath);

    console.log("Image tensor creation time:", Date.now() - tensorStart, "ms");
    console.log("Image tensor shape:", imageTensor.shape);

    const detectionStart = Date.now();

    const faceBox = await detectFace(imageTensor);

    console.log("Face detection only time:", Date.now() - detectionStart, "ms");
    console.log("Detected face box:", faceBox);

    if (!faceBox) {
      imageTensor.dispose();

      return {
        valid: false,
        message:
          "No face detected. Please keep your full face inside the camera frame."
      };
    }

    const fastCropStart = Date.now();

    resized = await cropAndResizeFaceFast(imageTensor, faceBox, 112);

    console.log(
      "Fast crop + resize time:",
      Date.now() - fastCropStart,
      "ms"
    );

    console.log("Resized face shape:", resized.shape);

    imageTensor.dispose();

    console.log(
      "Face validation total internal time:",
      Date.now() - totalStart,
      "ms"
    );

    return {
      valid: true,
      message: "Face detected successfully.",
      faceTensor: resized
    };
  } catch (error) {
    imageTensor?.dispose();
    resized?.dispose();

    console.log("Face validation error:", error);
    console.log("Face validation failed after:", Date.now() - totalStart, "ms");

    return {
      valid: false,
      message: String(error)
    };
  }
}