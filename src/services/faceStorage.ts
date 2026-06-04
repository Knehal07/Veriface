import {
  secureSetItem,
  secureGetItem,
  secureRemoveItem
} from "./secureStorage";

const FACE_KEY = "FACELOCK_REGISTERED_EMBEDDING";

export async function saveFaceEmbedding(embedding: number[]) {
  console.log("Saving encrypted embedding length:", embedding.length);

  await secureSetItem(FACE_KEY, JSON.stringify(embedding));

  const saved = await secureGetItem(FACE_KEY);
  console.log("Encrypted embedding saved:", !!saved);
}

export async function getStoredFaceEmbedding(): Promise<number[] | null> {
  const data = await secureGetItem(FACE_KEY);

  console.log("Encrypted stored embedding exists:", !!data);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export async function hasRegisteredFace(): Promise<boolean> {
  const data = await secureGetItem(FACE_KEY);

  console.log("Checking encrypted registered face:", !!data);

  return !!data;
}

export async function clearFaceEmbedding() {
  await secureRemoveItem(FACE_KEY);
}