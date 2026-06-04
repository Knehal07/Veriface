import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  Text
} from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import CameraView from "../components/CameraView";
import { RootStackParamList } from "../types/navigation";
import { loginWithFace, registerFace, verifyFaceOnly } from "../ml/faceAuth";
import { runLivenessChallenge } from "../ml/liveness/livenessAuth";

type RouteType = RouteProp<RootStackParamList, "FaceCapture">;
type NavigationType = NativeStackNavigationProp<RootStackParamList>;

export default function FaceCaptureScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavigationType>();

  const [loading, setLoading] = useState(false);

  async function handleCapture(path: string) {
    console.log("Photo path:", path);
    console.log("FaceCapture mode:", route.params.mode);
    console.log("Presence challenge:", route.params.challenge);

    try {
      setLoading(true);

      if (route.params.mode === "liveness") {
        if (!route.params.challenge) {
          setLoading(false);

          Alert.alert(
            "Presence Verification Error",
            "Missing presence verification instruction."
          );

          return;
        }

        const result = await runLivenessChallenge(
          path,
          route.params.challenge
        );

        setLoading(false);

        if (!result.success) {
          Alert.alert(
            "Presence Verification Failed",
            result.message
          );

          return;
        }

        Alert.alert(
          "Presence Verification Passed",
          result.message,
          [
            {
              text: "Continue Login",
              onPress: () => {
                navigation.replace("FaceCapture", {
                  mode: "login"
                });
              }
            }
          ]
        );

        return;
      }

      const result =
        route.params.mode === "register"
          ? await registerFace(path)
          : route.params.mode === "verify"
          ? await verifyFaceOnly(path)
          : await loginWithFace(path);

      setLoading(false);

      if (!result.success) {
        Alert.alert("Failed", result.message);
        return;
      }

      Alert.alert("Success", result.message, [
        {
          text: "OK",
          onPress: () => {
            if (
              route.params.mode === "login" ||
              route.params.mode === "verify"
            ) {
              navigation.reset({
                index: 0,
                routes: [{ name: "Dashboard" }]
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }]
              });
            }
          }
        }
      ]);
    } catch (error) {
      setLoading(false);

      console.log("Face capture error:", error);

      Alert.alert(
        "Error",
        "Something went wrong while processing the face."
      );
    }
  }

  function getTitle() {
    if (route.params.mode === "register") {
      return "Register your face";
    }

    if (route.params.mode === "login") {
      return "Login with your face";
    }

    if (route.params.mode === "verify") {
      return "Verify your identity";
    }

    if (route.params.mode === "liveness") {
      return "Presence verification";
    }

    return "Face verification";
  }

  function getSubtitle() {
    if (route.params.mode === "liveness") {
      if (route.params.challenge === "TURN_HEAD_LEFT") {
        return "Turn your face slightly to the left, then capture.";
      }

      if (route.params.challenge === "TURN_HEAD_RIGHT") {
        return "Turn your face slightly to the right, then capture.";
      }

      if (route.params.challenge === "BLINK_ONCE") {
        return "Blink once naturally, then capture.";
      }

      return "Complete the presence instruction, then capture.";
    }

    if (route.params.mode === "register") {
      return "Keep your face centered and clearly visible.";
    }

    if (route.params.mode === "login") {
      return "Keep your face centered for authentication.";
    }

    if (route.params.mode === "verify") {
      return "Re-authenticate to continue protected action.";
    }

    return "";
  }

  return (
    <View style={styles.container}>
      <CameraView onCapture={handleCapture} />

      <View style={styles.topLabel}>
        <Text style={styles.topLabelText}>
          {getTitle()}
        </Text>

        <Text style={styles.topSubText}>
          {getSubtitle()}
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />

          <Text style={styles.loadingText}>
            {route.params.mode === "liveness"
              ? "Checking presence..."
              : "Processing face..."}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  topLabel: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    alignSelf: "center",
    backgroundColor: "rgba(15,23,42,0.82)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },

  topLabelText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center"
  },

  topSubText: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center"
  },

  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontWeight: "700"
  }
});