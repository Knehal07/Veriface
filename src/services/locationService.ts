import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapUrl: string;
};

async function requestAndroidLocationPermission(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  const fineLocation = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Location Permission Required",
      message:
        "VeriFace needs your current location to mark secure attendance.",
      buttonPositive: "Allow",
      buttonNegative: "Deny"
    }
  );

  return fineLocation === PermissionsAndroid.RESULTS.GRANTED;
}

export async function getCurrentLocation(): Promise<CurrentLocation> {
  const granted = await requestAndroidLocationPermission();

  if (!granted) {
    throw new Error("Location permission denied.");
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;

        resolve({
          latitude,
          longitude,
          accuracy,
          mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
        });
      },
      error => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        forceRequestLocation: true,
        showLocationDialog: true
      }
    );
  });
}