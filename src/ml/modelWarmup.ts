import { initTensorFlowJS } from "./tfSetup";
import { loadFaceDetectionModel } from "./blazeFace";
import { loadMobileFaceNetModel } from "./mobileFaceNet";

let warmedUp = false;

export async function warmupModels() {
  if (warmedUp) {
    return;
  }

  try {
    console.log("Warming up ML models...");

    const start = Date.now();

    await initTensorFlowJS();
    await loadFaceDetectionModel();
    await loadMobileFaceNetModel();

    warmedUp = true;

    console.log("ML models warmed up in:", Date.now() - start, "ms");
  } catch (error) {
    console.log("Model warmup failed:", error);
  }
}