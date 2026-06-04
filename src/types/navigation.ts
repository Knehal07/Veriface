export type RootStackParamList = {
  Login: undefined;
  Register: undefined;

  LivenessCheck: undefined;

  FaceCapture: {
    mode: "register" | "login" | "verify" | "liveness";
    challenge?: "TURN_HEAD_LEFT" | "TURN_HEAD_RIGHT" | "BLINK_ONCE";
  };

  Dashboard: undefined;
  ProofVerification: undefined;
};