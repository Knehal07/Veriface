"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var proofService_1 = require("../services/proofService");
var activityLog_1 = require("../services/activityLog");
function ProofVerificationScreen() {
    var _a = react_1.useState(""), proofCode = _a[0], setProofCode = _a[1];
    var _b = react_1.useState(""), hash = _b[0], setHash = _b[1];
    var _c = react_1.useState(null), result = _c[0], setResult = _c[1];
    function handleVerifyProof() {
        return __awaiter(this, void 0, void 0, function () {
            var verification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!proofCode.trim() || !hash.trim()) {
                            react_native_1.Alert.alert("Missing Details", "Please enter both Proof Code and SHA-256 Hash.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, proofService_1.verifyLocalProof(proofCode, hash)];
                    case 1:
                        verification = _a.sent();
                        setResult({
                            valid: verification.valid,
                            message: verification.message
                        });
                        return [4 /*yield*/, activityLog_1.addActivityLog(verification.valid
                                ? "Proof Verification Passed"
                                : "Proof Verification Failed", verification.message)];
                    case 2:
                        _a.sent();
                        react_native_1.Alert.alert(verification.valid ? "Valid Proof" : "Invalid Proof", verification.message);
                        return [2 /*return*/];
                }
            });
        });
    }
    function clearForm() {
        setProofCode("");
        setHash("");
        setResult(null);
    }
    return (react_1["default"].createElement(react_native_1.ScrollView, { contentContainerStyle: styles.container },
        react_1["default"].createElement(react_native_1.View, { style: styles.headerCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.badge }, "LOCAL VERIFICATION"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Verify Secure Proof"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.subtitle }, "Enter the proof code and SHA-256 hash to verify whether the proof exists locally and has not been tampered with.")),
        react_1["default"].createElement(react_native_1.View, { style: styles.card },
            react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Proof Code"),
            react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, value: proofCode, onChangeText: setProofCode, placeholder: "FLA-...", placeholderTextColor: "#94a3b8", autoCapitalize: "characters" }),
            react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "SHA-256 Hash"),
            react_1["default"].createElement(react_native_1.TextInput, { style: [styles.input, styles.hashInput], value: hash, onChangeText: setHash, placeholder: "Paste proof hash", placeholderTextColor: "#94a3b8", autoCapitalize: "none", multiline: true }),
            react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.primaryButton, onPress: handleVerifyProof },
                react_1["default"].createElement(react_native_1.Text, { style: styles.primaryButtonText }, "Verify Proof")),
            react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.secondaryButton, onPress: clearForm },
                react_1["default"].createElement(react_native_1.Text, { style: styles.secondaryButtonText }, "Clear"))),
        result && (react_1["default"].createElement(react_native_1.View, { style: [
                styles.resultCard,
                result.valid ? styles.validCard : styles.invalidCard
            ] },
            react_1["default"].createElement(react_native_1.Text, { style: [
                    styles.resultTitle,
                    result.valid ? styles.validText : styles.invalidText
                ] }, result.valid ? "VALID PROOF" : "INVALID PROOF"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.resultMessage }, result.message)))));
}
exports["default"] = ProofVerificationScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f8fafc"
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
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        elevation: 3
    },
    label: {
        fontSize: 13,
        fontWeight: "900",
        color: "#475569",
        marginBottom: 8,
        marginTop: 12
    },
    input: {
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#0f172a"
    },
    hashInput: {
        minHeight: 100,
        textAlignVertical: "top"
    },
    primaryButton: {
        backgroundColor: "#2563eb",
        padding: 16,
        borderRadius: 16,
        marginTop: 20
    },
    primaryButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 16
    },
    secondaryButton: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#2563eb"
    },
    secondaryButtonText: {
        color: "#2563eb",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 16
    },
    resultCard: {
        borderRadius: 22,
        padding: 20,
        marginTop: 18
    },
    validCard: {
        backgroundColor: "#dcfce7"
    },
    invalidCard: {
        backgroundColor: "#fee2e2"
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: "900",
        marginBottom: 8
    },
    validText: {
        color: "#16a34a"
    },
    invalidText: {
        color: "#dc2626"
    },
    resultMessage: {
        color: "#0f172a",
        fontSize: 15,
        lineHeight: 22,
        fontWeight: "700"
    }
});
