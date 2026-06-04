import React, { useMemo } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

import {
  getChallengeText,
  getRandomLivenessChallenge
} from "../services/livenessService";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LivenessCheckScreen() {
  const navigation = useNavigation<Nav>();

  const challenge = useMemo(() => getRandomLivenessChallenge(), []);

  function startVerification() {
    navigation.navigate("FaceCapture", {
      mode: "liveness",
      challenge
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.badge}>ANTI-SPOOF CHECK</Text>

        <Text style={styles.title}>
          Presence Verification
        </Text>

        <Text style={styles.subtitle}>
          veriface needs to confirm that a real person is present before allowing secure login.
        </Text>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.sectionTitle}>
          Verification Instruction
        </Text>

        <Text style={styles.instructionText}>
          {getChallengeText(challenge)}
        </Text>

        <Text style={styles.helperText}>
          Keep your face clearly visible, follow the instruction once, then capture your face.
        </Text>
      </View>

      <View style={styles.securityCard}>
        <Text style={styles.sectionTitle}>
          Security Checks
        </Text>

        <View style={styles.checkRow}>
          <Text style={styles.checkDot}>✓</Text>
          <Text style={styles.checkText}>
            Face visibility validation
          </Text>
        </View>

        <View style={styles.checkRow}>
          <Text style={styles.checkDot}>✓</Text>
          <Text style={styles.checkText}>
            Movement-based anti-spoof check
          </Text>
        </View>

        <View style={styles.checkRow}>
          <Text style={styles.checkDot}>✓</Text>
          <Text style={styles.checkText}>
            Offline biometric matching
          </Text>
        </View>

        <View style={styles.checkRow}>
          <Text style={styles.checkDot}>✓</Text>
          <Text style={styles.checkText}>
            No network required
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={startVerification}
      >
        <Text style={styles.primaryButtonText}>
          Start Verification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
    justifyContent: "center"
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

  instructionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    elevation: 3
  },

  securityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 22,
    elevation: 3
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 14
  },

  instructionText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2563eb",
    marginBottom: 12
  },

  helperText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 21
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },

  checkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "900",
    marginRight: 12
  },

  checkText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "700",
    flex: 1
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12
  },

  primaryButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900"
  },

  secondaryButton: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2563eb"
  },

  secondaryButtonText: {
    color: "#2563eb",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900"
  }
});