import * as tf from "@tensorflow/tfjs";
import { loadTensorflowModel } from "react-native-fast-tflite";
import { initTensorFlowJS } from "./tfSetup";

const MODEL_PATH = require("../../assets/models/mobilefacenet.tflite");

let model: any = null;

export async function loadMobileFaceNetModel() {
  if (!model) {
    model = await loadTensorflowModel(MODEL_PATH);
    console.log("MobileFaceNet model loaded");
  }

  return model;
}

function l2Normalize(values: number[]): number[] {
  let sum = 0;

  for (const value of values) {
    sum += value * value;
  }

  const norm = Math.sqrt(sum);

  if (norm === 0) {
    return values;
  }

  return values.map(value => value / norm);
}

export async function getFaceEmbedding(faceTensor: tf.Tensor3D): Promise<number[]> {
  await initTensorFlowJS();
  const mobileFaceNet = await loadMobileFaceNetModel();

  const resized = tf.image.resizeBilinear(faceTensor, [112, 112]);
  const normalized = resized.sub(127.5).div(128.0);
  const batched = normalized.expandDims(0);

  const inputData = await batched.data();

  resized.dispose();
  normalized.dispose();
  batched.dispose();

  const output = await mobileFaceNet.run([new Float32Array(inputData)]);

  const embedding = Array.from(output[0] as Float32Array);

  return l2Normalize(embedding);
}