import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";

import { verifyLocalProof } from "../services/proofService";
import { addActivityLog } from "../services/activityLog";

export default function ProofVerificationScreen() {
  const [proofCode, setProofCode] = useState("");
  const [hash, setHash] = useState("");

  const [result, setResult] = useState<null | {
    valid: boolean;
    message: string;
  }>(null);

  async function handleVerifyProof() {
    if (!proofCode.trim() || !hash.trim()) {
      Alert.alert(
        "Missing Details",
        "Please enter both Proof Code and SHA-256 Hash."
      );
      return;
    }

    const verification = await verifyLocalProof(proofCode, hash);

    setResult({
      valid: verification.valid,
      message: verification.message
    });

    await addActivityLog(
      verification.valid
        ? "Proof Verification Passed"
        : "Proof Verification Failed",
      verification.message
    );

    Alert.alert(
      verification.valid ? "Valid Proof" : "Invalid Proof",
      verification.message
    );
  }

  function clearForm() {
    setProofCode("");
    setHash("");
    setResult(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.badge}>LOCAL VERIFICATION</Text>

        <Text style={styles.title}>Verify Secure Proof</Text>

        <Text style={styles.subtitle}>
          Enter the proof code and SHA-256 hash to verify whether the proof exists locally and has not been tampered with.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Proof Code</Text>

        <TextInput
          style={styles.input}
          value={proofCode}
          onChangeText={setProofCode}
          placeholder="FLA-..."
          placeholderTextColor="#94a3b8"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>SHA-256 Hash</Text>

        <TextInput
          style={[styles.input, styles.hashInput]}
          value={hash}
          onChangeText={setHash}
          placeholder="Paste proof hash"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          multiline
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleVerifyProof}
        >
          <Text style={styles.primaryButtonText}>Verify Proof</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={clearForm}
        >
          <Text style={styles.secondaryButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View
          style={[
            styles.resultCard,
            result.valid ? styles.validCard : styles.invalidCard
          ]}
        >
          <Text
            style={[
              styles.resultTitle,
              result.valid ? styles.validText : styles.invalidText
            ]}
          >
            {result.valid ? "VALID PROOF" : "INVALID PROOF"}
          </Text>

          <Text style={styles.resultMessage}>
            {result.message}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8fafc"
  },

  headerCard: {
    backgroundColor: "#0f172a",
    borderRadius: 26,
    padding: 26,
    marginBottom: 18
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    color: "#93c5fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 18
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 10
  },

  subtitle: {
    fontSize: 15,
    color: "#cbd5e1",
    lineHeight: 22
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 20,
    elevation: 3
  },

  label: {
    fontSize: 13,
    fontWeight: "900",
    color: "#475569",
    marginBottom: 8,
    marginTop: 12
  },

  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a"
  },

  hashInput: {
    minHeight: 100,
    textAlignVertical: "top"
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 16,
    marginTop: 20
  },

  primaryButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16
  },

  secondaryButton: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2563eb"
  },

  secondaryButtonText: {
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16
  },

  resultCard: {
    borderRadius: 22,
    padding: 20,
    marginTop: 18
  },

  validCard: {
    backgroundColor: "#dcfce7"
  },

  invalidCard: {
    backgroundColor: "#fee2e2"
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8
  },

  validText: {
    color: "#16a34a"
  },

  invalidText: {
    color: "#dc2626"
  },

  resultMessage: {
    color: "#0f172a",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700"
  }
});