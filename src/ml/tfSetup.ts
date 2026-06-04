import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import { setPlatform } from "@tensorflow/tfjs-core";

let ready = false;
let platformRegistered = false;

function registerReactNativePlatform() {
  if (platformRegistered) {
    return;
  }

  try {
    setPlatform("react-native-custom", {
      now: () => Date.now(),

      fetch: global.fetch,

      encode: (text: string, encoding: string) => {
        if (encoding !== "utf-8" && encoding !== "utf8") {
          throw new Error(`Unsupported encoding: ${encoding}`);
        }

        const encoded = unescape(encodeURIComponent(text));
        const result = new Uint8Array(encoded.length);

        for (let i = 0; i < encoded.length; i++) {
          result[i] = encoded.charCodeAt(i);
        }

        return result;
      },

      decode: (bytes: Uint8Array, encoding: string) => {
        if (encoding !== "utf-8" && encoding !== "utf8") {
          throw new Error(`Unsupported encoding: ${encoding}`);
        }

        let result = "";

        for (let i = 0; i < bytes.length; i++) {
          result += String.fromCharCode(bytes[i]);
        }

        return decodeURIComponent(escape(result));
      },

      isTypedArray: (value: unknown) => {
        return (
          value instanceof Float32Array ||
          value instanceof Int32Array ||
          value instanceof Uint8Array
        );
      }
    } as any);

    platformRegistered = true;
    console.log("Custom React Native TensorFlow platform registered");
  } catch (error) {
    platformRegistered = true;
    console.log("TensorFlow platform already registered or failed:", error);
  }
}

export async function initTensorFlowJS() {
  if (ready) {
    return;
  }

  registerReactNativePlatform();

  await tf.setBackend("cpu");
  await tf.ready();

  ready = true;

  console.log("TensorFlow backend:", tf.getBackend());
}