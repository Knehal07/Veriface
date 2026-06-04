import CryptoJS from "crypto-js";

import {
  secureSetItem,
  secureGetItem,
  secureRemoveItem
} from "./secureStorage";

import { getLastMatchScore } from "./securityMetrics";
import { getAttendanceRecords } from "./attendanceService";
import { getLastLivenessResult } from "./livenessService";

const PROOF_KEY = "FACELOCK_LAST_PROOF";

export type SecureProof = {
  id: string;
  proofCode: string;
  generatedAt: string;
  method: "offline-face-auth";
  status: "verified";

  matchScore: number | null;

  livenessPassed: boolean;
  livenessChallenge: string | null;
  livenessCompletedAt: string | null;

  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  mapUrl: string | null;

  hash: string;
};

function generateProofCode() {
  return `FLA-${Date.now()}-${Math.floor(Math.random() * 999999)}`;
}

export async function generateSecureProof(): Promise<SecureProof> {
  const matchScore = await getLastMatchScore();
  const attendanceRecords = await getAttendanceRecords();
  const liveness = await getLastLivenessResult();

  const latestAttendance =
    attendanceRecords.length > 0 ? attendanceRecords[0] : null;

  const proofCode = generateProofCode();
  const generatedAt = new Date().toLocaleString();

  const rawProofData = JSON.stringify({
    proofCode,
    generatedAt,
    method: "offline-face-auth",
    status: "verified",
    matchScore,
    livenessPassed: !!liveness?.passed,
    livenessChallenge: liveness?.challenge ?? null,
    livenessCompletedAt: liveness?.completedAt ?? null,
    latitude: latestAttendance?.latitude ?? null,
    longitude: latestAttendance?.longitude ?? null,
    accuracy: latestAttendance?.accuracy ?? null,
    mapUrl: latestAttendance?.mapUrl ?? null
  });

  const hash = CryptoJS.SHA256(rawProofData).toString();

  const proof: SecureProof = {
    id: Date.now().toString(),
    proofCode,
    generatedAt,
    method: "offline-face-auth",
    status: "verified",

    matchScore,

    livenessPassed: !!liveness?.passed,
    livenessChallenge: liveness?.challenge ?? null,
    livenessCompletedAt: liveness?.completedAt ?? null,

    latitude: latestAttendance?.latitude ?? null,
    longitude: latestAttendance?.longitude ?? null,
    accuracy: latestAttendance?.accuracy ?? null,
    mapUrl: latestAttendance?.mapUrl ?? null,

    hash
  };

  await secureSetItem(PROOF_KEY, JSON.stringify(proof));

  return proof;
}

export async function getLastSecureProof(): Promise<SecureProof | null> {
  const data = await secureGetItem(PROOF_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export async function clearSecureProof() {
  await secureRemoveItem(PROOF_KEY);
}

export function getProofQRPayload(proof: SecureProof): string {
  return JSON.stringify({
    app: "VeriFace",
    proofCode: proof.proofCode,
    generatedAt: proof.generatedAt,
    method: proof.method,
    status: proof.status,
    matchScore: proof.matchScore,
    livenessPassed: proof.livenessPassed,
    livenessChallenge: proof.livenessChallenge,
    livenessCompletedAt: proof.livenessCompletedAt,
    latitude: proof.latitude,
    longitude: proof.longitude,
    accuracy: proof.accuracy,
    mapUrl: proof.mapUrl,
    hash: proof.hash
  });
}

export async function verifyLocalProof(
  proofCode: string,
  hash: string
): Promise<{
  valid: boolean;
  message: string;
  proof?: SecureProof;
}> {
  const storedProof = await getLastSecureProof();

  if (!storedProof) {
    return {
      valid: false,
      message: "No local proof found on this device."
    };
  }

  const codeMatches =
    storedProof.proofCode.trim() === proofCode.trim();

  const hashMatches =
    storedProof.hash.trim().toLowerCase() === hash.trim().toLowerCase();

  if (codeMatches && hashMatches) {
    return {
      valid: true,
      message: "Proof verified successfully.",
      proof: storedProof
    };
  }

  return {
    valid: false,
    message:
      "Proof verification failed. The proof may be invalid or tampered."
  };
}