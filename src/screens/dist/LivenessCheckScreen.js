"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var native_1 = require("@react-navigation/native");
var livenessService_1 = require("../services/livenessService");
function LivenessCheckScreen() {
    var navigation = native_1.useNavigation();
    var challenge = react_1.useMemo(function () { return livenessService_1.getRandomLivenessChallenge(); }, []);
    function startVerification() {
        navigation.navigate("FaceCapture", {
            mode: "liveness",
            challenge: challenge
        });
    }
    return (react_1["default"].createElement(react_native_1.View, { style: styles.container },
        react_1["default"].createElement(react_native_1.View, { style: styles.headerCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.badge }, "ANTI-SPOOF CHECK"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Presence Verification"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.subtitle }, "veriface needs to confirm that a real person is present before allowing secure login.")),
        react_1["default"].createElement(react_native_1.View, { style: styles.instructionCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.sectionTitle }, "Verification Instruction"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.instructionText }, livenessService_1.getChallengeText(challenge)),
            react_1["default"].createElement(react_native_1.Text, { style: styles.helperText }, "Keep your face clearly visible, follow the instruction once, then capture your face.")),
        react_1["default"].createElement(react_native_1.View, { style: styles.securityCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.sectionTitle }, "Security Checks"),
            react_1["default"].createElement(react_native_1.View, { style: styles.checkRow },
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkDot }, "\u2713"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkText }, "Face visibility validation")),
            react_1["default"].createElement(react_native_1.View, { style: styles.checkRow },
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkDot }, "\u2713"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkText }, "Movement-based anti-spoof check")),
            react_1["default"].createElement(react_native_1.View, { style: styles.checkRow },
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkDot }, "\u2713"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkText }, "Offline biometric matching")),
            react_1["default"].createElement(react_native_1.View, { style: styles.checkRow },
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkDot }, "\u2713"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.checkText }, "No network required"))),
        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.primaryButton, onPress: startVerification },
            react_1["default"].createElement(react_native_1.Text, { style: styles.primaryButtonText }, "Start Verification")),
        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.secondaryButton, onPress: function () { return navigation.goBack(); } },
            react_1["default"].createElement(react_native_1.Text, { style: styles.secondaryButtonText }, "Cancel"))));
}
exports["default"] = LivenessCheckScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f8fafc",
        justifyContent: "center"
    },
    headerCard: {
        backgroundColor: "#0f172a",
        borderRadius: 26,
        padding: 26,
        marginBottom: 18
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "#1e293b",
        color: "#93c5fd",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: "900",
        marginBottom: 18
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        color: "#ffffff",
        marginBottom: 10
    },
    subtitle: {
        fontSize: 15,
        color: "#cbd5e1",
        lineHeight: 22
    },
    instructionCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 22,
        marginBottom: 18,
        elevation: 3
    },
    securityCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 22,
        marginBottom: 22,
        elevation: 3
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#0f172a",
        marginBottom: 14
    },
    instructionText: {
        fontSize: 24,
        fontWeight: "900",
        color: "#2563eb",
        marginBottom: 12
    },
    helperText: {
        fontSize: 14,
        color: "#64748b",
        lineHeight: 21
    },
    checkRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    checkDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#dcfce7",
        color: "#16a34a",
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "900",
        marginRight: 12
    },
    checkText: {
        fontSize: 14,
        color: "#334155",
        fontWeight: "700",
        flex: 1
    },
    primaryButton: {
        backgroundColor: "#2563eb",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12
    },
    primaryButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "900"
    },
    secondaryButton: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2563eb"
    },
    secondaryButtonText: {
        color: "#2563eb",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "900"
    }
});
