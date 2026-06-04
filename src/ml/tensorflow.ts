import * as tf from "@tensorflow/tfjs";

let ready = false;

export async function initTensorFlow() {
  if (ready) return;

  await tf.ready();
  ready = true;

  console.log("TensorFlow ready:", tf.getBackend());
}