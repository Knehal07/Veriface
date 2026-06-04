import RNFS from "react-native-fs";

import {
  getLastSecureProof,
  getProofQRPayload,
  SecureProof
} from "./proofService";

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "_");
}

function buildProofExportPayload(proof: SecureProof) {
  return {
    app: "VeriFace",
    exportType: "LOCAL_SECURE_PROOF",
    exportedAt: new Date().toLocaleString(),

    proofCode: proof.proofCode,
    generatedAt: proof.generatedAt,
    method: proof.method,
    status: proof.status,

    matchScore: proof.matchScore,

    presenceVerification: {
      passed: proof.livenessPassed,
      challenge: proof.livenessChallenge,
      completedAt: proof.livenessCompletedAt
    },

    location: {
      latitude: proof.latitude,
      longitude: proof.longitude,
      accuracy: proof.accuracy,
      mapUrl: proof.mapUrl
    },

    integrity: {
      algorithm: "SHA-256",
      hash: proof.hash
    },

    qrPayload: getProofQRPayload(proof)
  };
}

function buildCertificateText(proof: SecureProof) {
  return `
VeriFace SECURE LOCAL PROOF
================================

Proof Code:
${proof.proofCode}

Status:
${proof.status.toUpperCase()}

Method:
${proof.method}

Generated At:
${proof.generatedAt}

Face Match Score:
${proof.matchScore !== null ? proof.matchScore.toFixed(3) : "N/A"}

Presence Verification:
${proof.livenessPassed ? "PASSED" : "NOT AVAILABLE"}

Presence Instruction:
${proof.livenessChallenge ?? "N/A"}

Presence Completed At:
${proof.livenessCompletedAt ?? "N/A"}

GPS Location:
${
  proof.latitude !== null && proof.longitude !== null
    ? `${proof.latitude.toFixed(6)}, ${proof.longitude.toFixed(6)}`
    : "N/A"
}

GPS Accuracy:
${proof.accuracy !== null ? `${Math.round(proof.accuracy)} meters` : "N/A"}

Map URL:
${proof.mapUrl ?? "N/A"}

SHA-256 Hash:
${proof.hash}

Verification Note:
This proof was generated locally on the device using offline face authentication.
The SHA-256 hash can be used to detect tampering.
`.trim();
}

export async function exportProofAsJsonFile() {
  const proof = await getLastSecureProof();

  if (!proof) {
    throw new Error("No secure proof found. Generate a proof first.");
  }

  const payload = buildProofExportPayload(proof);

  const fileName = `VeriFace_Proof_${safeFileName(
    proof.proofCode
  )}.json`;

  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  await RNFS.writeFile(
    filePath,
    JSON.stringify(payload, null, 2),
    "utf8"
  );

  return {
    filePath,
    fileName,
    proof
  };
}

export async function exportProofAsCertificateFile() {
  const proof = await getLastSecureProof();

  if (!proof) {
    throw new Error("No secure proof found. Generate a proof first.");
  }

  const certificateText = buildCertificateText(proof);

  const fileName = `VeriFace_Certificate_${safeFileName(
    proof.proofCode
  )}.txt`;

  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  await RNFS.writeFile(filePath, certificateText, "utf8");

  return {
    filePath,
    fileName,
    proof
  };
}