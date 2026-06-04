import React, { useEffect } from "react";
import { Alert, Linking } from "react-native";
import { Buffer } from "buffer";
import { NavigationContainer } from "@react-navigation/native";
import { Camera } from "react-native-vision-camera";

import AppNavigator from "./src/navigation/AppNavigator";
import { warmupModels } from "./src/ml/modelWarmup";

global.Buffer = Buffer;

export default function App() {
  useEffect(() => {
    requestCameraPermission();
    warmupModels();
  }, []);

  async function requestCameraPermission() {
    const status = await Camera.getCameraPermissionStatus();

    if (status === "granted") {
      return;
    }

    const result = await Camera.requestCameraPermission();

    if (result !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera permission from app settings.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings()
          }
        ]
      );
    }
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}