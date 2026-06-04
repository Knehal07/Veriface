import * as tf from "@tensorflow/tfjs";

export type FaceBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  score?: number;
};

export function cropFace(
  imageTensor: tf.Tensor3D,
  box: FaceBox
): tf.Tensor3D {
  const [height, width] = imageTensor.shape;

  const padding = 0.15;

  const boxWidth = box.x2 - box.x1;
  const boxHeight = box.y2 - box.y1;

  const x1 = Math.max(0, Math.floor(box.x1 - boxWidth * padding));
  const y1 = Math.max(0, Math.floor(box.y1 - boxHeight * padding));
  const x2 = Math.min(width, Math.floor(box.x2 + boxWidth * padding));
  const y2 = Math.min(height, Math.floor(box.y2 + boxHeight * padding));

  const cropWidth = Math.max(1, x2 - x1);
  const cropHeight = Math.max(1, y2 - y1);

  return tf.slice(
    imageTensor,
    [y1, x1, 0],
    [cropHeight, cropWidth, 3]
  );
}

export function resizeFace(
  faceTensor: tf.Tensor3D,
  size = 112
): tf.Tensor3D {
  return tf.image.resizeBilinear(faceTensor, [size, size]) as tf.Tensor3D;
}

export function normalizeForMobileFaceNet(
  faceTensor: tf.Tensor3D
): tf.Tensor3D {
  return faceTensor.sub(127.5).div(128.0) as tf.Tensor3D;
}

/**
 * Fast crop + resize replacement for tf.slice + tf.image.resizeBilinear.
 * This avoids the slow TensorFlow.js CPU crop path.
 */
export async function cropAndResizeFaceFast(
  imageTensor: tf.Tensor3D,
  box: FaceBox,
  outputSize = 112
): Promise<tf.Tensor3D> {
  const [height, width] = imageTensor.shape;

  const padding = 0.15;

  const boxWidth = box.x2 - box.x1;
  const boxHeight = box.y2 - box.y1;

  const x1 = Math.max(0, Math.floor(box.x1 - boxWidth * padding));
  const y1 = Math.max(0, Math.floor(box.y1 - boxHeight * padding));
  const x2 = Math.min(width - 1, Math.floor(box.x2 + boxWidth * padding));
  const y2 = Math.min(height - 1, Math.floor(box.y2 + boxHeight * padding));

  const cropWidth = Math.max(1, x2 - x1);
  const cropHeight = Math.max(1, y2 - y1);

  const source = await imageTensor.data();
  const output = new Float32Array(outputSize * outputSize * 3);

  let outIndex = 0;

  for (let y = 0; y < outputSize; y++) {
    const sourceY = y1 + Math.floor((y / outputSize) * cropHeight);

    for (let x = 0; x < outputSize; x++) {
      const sourceX = x1 + Math.floor((x / outputSize) * cropWidth);

      const sourceIndex = (sourceY * width + sourceX) * 3;

      output[outIndex++] = source[sourceIndex];
      output[outIndex++] = source[sourceIndex + 1];
      output[outIndex++] = source[sourceIndex + 2];
    }
  }

  return tf.tensor3d(output, [outputSize, outputSize, 3], "float32");
}