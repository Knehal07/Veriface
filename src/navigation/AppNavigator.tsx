import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LivenessCheckScreen from "../screens/LivenessCheckScreen";
import FaceCaptureScreen from "../screens/FaceCaptureScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProofVerificationScreen from "../screens/ProofVerificationScreen";

import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: "center"
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "VeriFace"
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "New Registration"
        }}
      />

      <Stack.Screen
        name="LivenessCheck"
        component={LivenessCheckScreen}
        options={{
          title: "Presence Verification"
        }}
      />

      <Stack.Screen
        name="FaceCapture"
        component={FaceCaptureScreen}
        options={{
          title: "Face Capture"
        }}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Secure Dashboard",
          headerBackVisible: false
        }}
      />

      <Stack.Screen
        name="ProofVerification"
        component={ProofVerificationScreen}
        options={{
          title: "Verify Proof"
        }}
      />
    </Stack.Navigator>
  );
}