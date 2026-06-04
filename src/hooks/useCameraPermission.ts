import { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";

export default function useCameraPermission() {
  const [granted, setGranted] =
    useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  async function checkPermission() {
    const status =
      await Camera.getCameraPermissionStatus();

    if (status === "granted") {
      setGranted(true);
      return;
    }

    const result =
      await Camera.requestCameraPermission();

    setGranted(result === "granted");
  }

  return granted;
}