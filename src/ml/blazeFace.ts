import * as tf from "@tensorflow/tfjs";
import { loadTensorflowModel } from "react-native-fast-tflite";

import { FaceBox } from "./preprocess";

const BLAZEFACE_MODEL = require("../../assets/models/blazeface.tflite");

let model: any = null;

type Anchor = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export async function loadFaceDetectionModel() {
  if (!model) {
    model = await loadTensorflowModel(BLAZEFACE_MODEL);
    console.log("Face detection model loaded");
  }

  return model;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function generateAnchors(): Anchor[] {
  const anchors: Anchor[] = [];

  const inputSize = 128;
  const strides = [8, 16, 16, 16];

  let layerId = 0;

  while (layerId < strides.length) {
    const lastSameStrideLayer = layerId;
    let repeats = 0;

    while (
      layerId < strides.length &&
      strides[layerId] === strides[lastSameStrideLayer]
    ) {
      repeats += 2;
      layerId++;
    }

    const stride = strides[lastSameStrideLayer];
    const featureMapSize = Math.ceil(inputSize / stride);

    for (let y = 0; y < featureMapSize; y++) {
      for (let x = 0; x < featureMapSize; x++) {
        for (let r = 0; r < repeats; r++) {
          anchors.push({
            x: (x + 0.5) / featureMapSize,
            y: (y + 0.5) / featureMapSize,
            w: 1.0,
            h: 1.0
          });
        }
      }
    }
  }

  console.log("Generated anchors:", anchors.length);

  return anchors;
}

const ANCHORS = generateAnchors();

function decodeBestFace(
  rawBoxes: number[],
  rawScores: number[],
  imageWidth: number,
  imageHeight: number
): FaceBox | null {
  let bestIndex = -1;
  let bestScore = 0;

  for (let i = 0; i < rawScores.length; i++) {
    const score = sigmoid(rawScores[i]);

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  console.log("Best face score:", bestScore);

  if (bestIndex < 0 || bestScore < 0.55) {
    return null;
  }

  const anchor = ANCHORS[bestIndex];

  if (!anchor) {
    console.log("No anchor found for index:", bestIndex);
    return null;
  }

  const boxOffset = bestIndex * 16;

  const xCenter =
    rawBoxes[boxOffset + 0] / 128.0 * anchor.w + anchor.x;

  const yCenter =
    rawBoxes[boxOffset + 1] / 128.0 * anchor.h + anchor.y;

  const width =
    rawBoxes[boxOffset + 2] / 128.0 * anchor.w;

  const height =
    rawBoxes[boxOffset + 3] / 128.0 * anchor.h;

  const x1 = (xCenter - width / 2) * imageWidth;
  const y1 = (yCenter - height / 2) * imageHeight;
  const x2 = (xCenter + width / 2) * imageWidth;
  const y2 = (yCenter + height / 2) * imageHeight;

  return {
    x1,
    y1,
    x2,
    y2,
    score: bestScore
  };
}

export async function detectFace(
  imageTensor: tf.Tensor3D
): Promise<FaceBox | null> {
  const faceModel = await loadFaceDetectionModel();

  const [imageHeight, imageWidth] = imageTensor.shape;

  const resized = tf.image.resizeBilinear(imageTensor, [128, 128]);
  const normalized = resized.sub(127.5).div(127.5);
  const batched = normalized.expandDims(0);

  const inputData = await batched.data();

  resized.dispose();
  normalized.dispose();
  batched.dispose();

  const outputs = await faceModel.run([
    new Float32Array(inputData as Float32Array)
  ]);

  console.log(
    "Face detection output lengths:",
    outputs.map((o: Float32Array) => o.length)
  );

  let rawBoxes: number[] = [];
  let rawScores: number[] = [];

  const output0 = outputs[0] as Float32Array;
  const output1 = outputs[1] as Float32Array;

  if (output0.length > output1.length) {
    rawBoxes = Array.from(output0);
    rawScores = Array.from(output1);
  } else {
    rawBoxes = Array.from(output1);
    rawScores = Array.from(output0);
  }

  return decodeBestFace(
    rawBoxes,
    rawScores,
    imageWidth,
    imageHeight
  );
}