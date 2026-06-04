import * as tf from "@tensorflow/tfjs";
import jpeg from "jpeg-js";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";

export async function imagePathToTensor(path: string): Promise<tf.Tensor3D> {
  const filePath = path.startsWith("file://") ? path : `file://${path}`;

  const base64 = await RNFS.readFile(filePath, "base64");
  const raw = Buffer.from(base64, "base64");

  const decoded = jpeg.decode(raw, { useTArray: true });

  const { width, height, data } = decoded;

  const buffer = new Uint8Array(width * height * 3);

  let offset = 0;

  for (let i = 0; i < data.length; i += 4) {
    buffer[offset++] = data[i];
    buffer[offset++] = data[i + 1];
    buffer[offset++] = data[i + 2];
  }

  return tf.tensor3d(buffer, [height, width, 3]);
}