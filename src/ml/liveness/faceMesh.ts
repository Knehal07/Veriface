import * as tf from "@tensorflow/tfjs";
import { loadTensorflowModel } from "react-native-fast-tflite";

import { initTensorFlowJS } from "../tfSetup";

const FACE_LANDMARK_MODEL =
  require("../../../assets/models/face_landmark.tflite");

export type FaceLandmark = {
  x: number;
  y: number;
  z: number;
};

let model: any = null;

async function loadFaceMeshModel() {
  if (!model) {
    model = await loadTensorflowModel(FACE_LANDMARK_MODEL);
    console.log("FaceMesh landmark model loaded");
  }

  return model;
}

export async function runFaceMesh(
  faceTensor: tf.Tensor3D
): Promise<FaceLandmark[]> {
  await initTensorFlowJS();

  const faceMesh = await loadFaceMeshModel();

  const resized = tf.image.resizeBilinear(faceTensor, [192, 192]);
  const normalized = resized.div(255.0);
  const batched = normalized.expandDims(0);

  const input = await batched.data();

  resized.dispose();
  normalized.dispose();
  batched.dispose();

  const outputs = await faceMesh.run([
    new Float32Array(input as Float32Array)
  ]);

  console.log(
    "FaceMesh output lengths:",
    outputs.map((o: Float32Array) => o.length)
  );

  const raw = outputs[0] as Float32Array;

  const landmarks: FaceLandmark[] = [];

  for (let i = 0; i + 2 < raw.length; i += 3) {
    landmarks.push({
      x: raw[i],
      y: raw[i + 1],
      z: raw[i + 2]
    });
  }

  console.log("Parsed FaceMesh landmarks:", landmarks.length);

  return landmarks;
}