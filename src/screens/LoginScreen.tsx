import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import {
  useFocusEffect,
  useNavigation
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { hasRegisteredFace } from "../services/faceStorage";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();

  const [registered, setRegistered] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkRegisteredFace();
    }, [])
  );

  async function checkRegisteredFace() {
    const exists = await hasRegisteredFace();

    console.log("Login screen registered:", exists);

    setRegistered(exists);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VeriFace</Text>

      <Text style={styles.subtitle}>
        Secure offline facial authentication
      </Text>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          !registered && styles.disabledButton
        ]}
        disabled={!registered}
        onPress={() => navigation.navigate("LivenessCheck")}
      >
        <Text style={styles.buttonText}>
          Login Existing User
        </Text>
      </TouchableOpacity>

      {!registered && (
        <Text style={styles.warning}>
          No registered face found. Please register first.
        </Text>
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>
          New Registration
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={checkRegisteredFace}
      >
        <Text style={styles.refreshText}>
          Refresh Registration Status
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f8fafc"
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    color: "#0f172a"
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 40,
    color: "#475569"
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },
  secondaryButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 14,
    marginTop: 12
  },
  disabledButton: {
    backgroundColor: "#94a3b8"
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16
  },
  warning: {
    color: "#dc2626",
    textAlign: "center",
    marginVertical: 8
  },
  refreshButton: {
    marginTop: 20
  },
  refreshText: {
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "700"
  }
});