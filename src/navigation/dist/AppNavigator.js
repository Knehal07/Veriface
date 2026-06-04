"use strict";
exports.__esModule = true;
var react_1 = require("react");
var native_stack_1 = require("@react-navigation/native-stack");
var LoginScreen_1 = require("../screens/LoginScreen");
var RegisterScreen_1 = require("../screens/RegisterScreen");
var LivenessCheckScreen_1 = require("../screens/LivenessCheckScreen");
var FaceCaptureScreen_1 = require("../screens/FaceCaptureScreen");
var DashboardScreen_1 = require("../screens/DashboardScreen");
var ProofVerificationScreen_1 = require("../screens/ProofVerificationScreen");
var Stack = native_stack_1.createNativeStackNavigator();
function AppNavigator() {
    return (react_1["default"].createElement(Stack.Navigator, { initialRouteName: "Login", screenOptions: {
            headerTitleAlign: "center"
        } },
        react_1["default"].createElement(Stack.Screen, { name: "Login", component: LoginScreen_1["default"], options: {
                title: "VeriFace"
            } }),
        react_1["default"].createElement(Stack.Screen, { name: "Register", component: RegisterScreen_1["default"], options: {
                title: "New Registration"
            } }),
        react_1["default"].createElement(Stack.Screen, { name: "LivenessCheck", component: LivenessCheckScreen_1["default"], options: {
                title: "Presence Verification"
            } }),
        react_1["default"].createElement(Stack.Screen, { name: "FaceCapture", component: FaceCaptureScreen_1["default"], options: {
                title: "Face Capture"
            } }),
        react_1["default"].createElement(Stack.Screen, { name: "Dashboard", component: DashboardScreen_1["default"], options: {
                title: "Secure Dashboard",
                headerBackVisible: false
            } }),
        react_1["default"].createElement(Stack.Screen, { name: "ProofVerification", component: ProofVerificationScreen_1["default"], options: {
                title: "Verify Proof"
            } })));
}
exports["default"] = AppNavigator;
