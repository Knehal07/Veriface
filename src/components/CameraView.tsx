import React, { useMemo, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import {
  Camera,
  useCameraDevice,
  useCameraFormat
} from "react-native-vision-camera";

type Props = {
  onCapture: (path: string) => Promise<void> | void;
};

export default function CameraView({ onCapture }: Props) {
  const cameraRef = useRef<Camera>(null);

  const device = useCameraDevice("front");

  const format = useCameraFormat(device, [
    { photoResolution: { width: 320, height: 240 } }
  ]);

  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  async function capture() {
    if (!cameraReady || !cameraRef.current || capturing) {
      return;
    }

    try {
      setCapturing(true);

      const photo = await cameraRef.current.takePhoto({
        flash: "off"
      });

      console.log("Photo path:", photo.path);

      await onCapture(photo.path);
    } catch (error) {
      console.log("Capture error:", error);
    } finally {
      setCapturing(false);
    }
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No front camera found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        isActive={true}
        photo={true}
        onInitialized={() => setCameraReady(true)}
      />

      <TouchableOpacity
        style={[
          styles.captureButton,
          (!cameraReady || capturing) && styles.disabled
        ]}
        onPress={capture}
        disabled={!cameraReady || capturing}
      >
        {capturing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.captureText}>Capture</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 40
  },
  disabled: {
    opacity: 0.5
  },
  captureText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16
  }
});