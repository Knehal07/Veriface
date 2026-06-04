import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Registration</Text>

      <Text style={styles.desc}>
        Capture your face to register for offline login.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("FaceCapture", {
            mode: "register"
          })
        }
      >
        <Text style={styles.buttonText}>
          Start Face Registration
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 16
  },
  desc: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 30
  },
  button: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 14
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  }
});