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
var native_1 = require("@react-navigation/native");
var react_native_qrcode_svg_1 = require("react-native-qrcode-svg");
var faceStorage_1 = require("../services/faceStorage");
var livenessService_1 = require("../services/livenessService");
var proofExportService_1 = require("../services/proofExportService");
var syncService_1 = require("../services/syncService");
var activityLog_1 = require("../services/activityLog");
var securityMetrics_1 = require("../services/securityMetrics");
var attendanceService_1 = require("../services/attendanceService");
var proofService_1 = require("../services/proofService");
function DashboardScreen() {
    var navigation = native_1.useNavigation();
    var _a = react_1.useState(false), livenessPassed = _a[0], setLivenessPassed = _a[1];
    var _b = react_1.useState(false), sessionActive = _b[0], setSessionActive = _b[1];
    var _c = react_1.useState([]), activityLogs = _c[0], setActivityLogs = _c[1];
    var _d = react_1.useState(null), lastMatchScore = _d[0], setLastMatchScore = _d[1];
    var _e = react_1.useState(null), lastLoginTime = _e[0], setLastLoginTime = _e[1];
    var _f = react_1.useState([]), attendanceRecords = _f[0], setAttendanceRecords = _f[1];
    var _g = react_1.useState(null), lastProof = _g[0], setLastProof = _g[1];
    var _h = react_1.useState({
        total: 0,
        pending: 0,
        synced: 0,
        failed: 0
    }), syncSummary = _h[0], setSyncSummary = _h[1];
    native_1.useFocusEffect(react_1.useCallback(function () {
        loadDashboardData();
    }, []));
    function loadDashboardData() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            loadLogs(),
                            loadSecurityMetrics(),
                            loadAttendanceRecords(),
                            loadLastProof(),
                            loadLivenessStatus(),
                            loadSyncSummary()
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadLogs() {
        return __awaiter(this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, activityLog_1.getActivityLogs()];
                    case 1:
                        logs = _a.sent();
                        setActivityLogs(logs);
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadSecurityMetrics() {
        return __awaiter(this, void 0, void 0, function () {
            var score, time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, securityMetrics_1.getLastMatchScore()];
                    case 1:
                        score = _a.sent();
                        return [4 /*yield*/, securityMetrics_1.getLastLoginTime()];
                    case 2:
                        time = _a.sent();
                        setLastMatchScore(score);
                        setLastLoginTime(time);
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadAttendanceRecords() {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, attendanceService_1.getAttendanceRecords()];
                    case 1:
                        records = _a.sent();
                        setAttendanceRecords(records);
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadLastProof() {
        return __awaiter(this, void 0, void 0, function () {
            var proof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, proofService_1.getLastSecureProof()];
                    case 1:
                        proof = _a.sent();
                        setLastProof(proof);
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadLivenessStatus() {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, livenessService_1.getLastLivenessResult()];
                    case 1:
                        result = _a.sent();
                        setLivenessPassed(!!(result === null || result === void 0 ? void 0 : result.passed));
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadSyncSummary() {
        return __awaiter(this, void 0, void 0, function () {
            var summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, syncService_1.getSyncSummary()];
                    case 1:
                        summary = _a.sent();
                        setSyncSummary(summary);
                        return [2 /*return*/];
                }
            });
        });
    }
    function runManualSync() {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, syncService_1.runOfflineToOnlineSync()];
                    case 1:
                        result = _a.sent();
                        setSyncSummary(result);
                        return [4 /*yield*/, activityLog_1.addActivityLog("Sync Completed", "Pending: " + result.pending + ", Synced: " + result.synced + ", Failed: " + result.failed)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 3:
                        _a.sent();
                        react_native_1.Alert.alert("Sync Completed", "Total: " + result.total + "\nPending: " + result.pending + "\nSynced: " + result.synced + "\nFailed: " + result.failed);
                        return [2 /*return*/];
                }
            });
        });
    }
    function startProtectedSession() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setSessionActive(true);
                        return [4 /*yield*/, activityLog_1.addActivityLog("Protected Session Started", "Secure offline session is now active.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 2:
                        _a.sent();
                        react_native_1.Alert.alert("Session Started", "Your protected session is now active.");
                        return [2 /*return*/];
                }
            });
        });
    }
    function endProtectedSession() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setSessionActive(false);
                        return [4 /*yield*/, activityLog_1.addActivityLog("Protected Session Ended", "Secure offline session was ended.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 2:
                        _a.sent();
                        react_native_1.Alert.alert("Session Ended", "Your protected session has ended.");
                        return [2 /*return*/];
                }
            });
        });
    }
    function verifyLocalIdentity() {
        navigation.navigate("FaceCapture", {
            mode: "verify"
        });
    }
    function markSecureAttendance() {
        return __awaiter(this, void 0, void 0, function () {
            var record, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, attendanceService_1.markAttendance()];
                    case 1:
                        record = _a.sent();
                        return [4 /*yield*/, activityLog_1.addActivityLog("Attendance Marked", "Secure attendance marked at " + record.time + " with GPS location.")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loadAttendanceRecords()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 4:
                        _a.sent();
                        react_native_1.Alert.alert("Attendance Marked", "Offline attendance marked successfully.\n\nTime: " + record.time + "\nLatitude: " + record.latitude.toFixed(6) + "\nLongitude: " + record.longitude.toFixed(6) + "\nAccuracy: " + Math.round(record.accuracy) + " meters");
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        react_native_1.Alert.alert("Location Error", String(error_1));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function exportSecureProof() {
        return __awaiter(this, void 0, void 0, function () {
            var proof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, proofService_1.generateSecureProof()];
                    case 1:
                        proof = _a.sent();
                        return [4 /*yield*/, activityLog_1.addActivityLog("Secure Proof Generated", "Proof code generated: " + proof.proofCode)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, loadLastProof()];
                    case 4:
                        _a.sent();
                        react_native_1.Alert.alert("Secure Proof Generated", "Proof Code:\n" + proof.proofCode + "\n\nGenerated At:\n" + proof.generatedAt + "\n\nHash:\n" + proof.hash);
                        return [2 /*return*/];
                }
            });
        });
    }
    function exportJsonProofFile() {
        return __awaiter(this, void 0, void 0, function () {
            var exported, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, proofExportService_1.exportProofAsJsonFile()];
                    case 1:
                        exported = _a.sent();
                        return [4 /*yield*/, activityLog_1.addActivityLog("Proof JSON Exported", "Proof JSON exported: " + exported.fileName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 3:
                        _a.sent();
                        react_native_1.Alert.alert("JSON Proof Exported", "File saved locally:\n\n" + exported.filePath);
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        react_native_1.Alert.alert("Export Failed", String(error_2));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function exportCertificateFile() {
        return __awaiter(this, void 0, void 0, function () {
            var exported, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, proofExportService_1.exportProofAsCertificateFile()];
                    case 1:
                        exported = _a.sent();
                        return [4 /*yield*/, activityLog_1.addActivityLog("Proof Certificate Exported", "Proof certificate exported: " + exported.fileName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 3:
                        _a.sent();
                        react_native_1.Alert.alert("Certificate Exported", "File saved locally:\n\n" + exported.filePath);
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        react_native_1.Alert.alert("Export Failed", String(error_3));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function runPresenceCheckInfo() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, activityLog_1.addActivityLog("Presence Check", "Anti-spoof verification status viewed from dashboard.")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loadLogs()];
                    case 2:
                        _a.sent();
                        react_native_1.Alert.alert("Presence Check", livenessPassed
                            ? "Presence verification has passed for the latest login session."
                            : "Presence verification is pending. Login again through Presence Verification.");
                        return [2 /*return*/];
                }
            });
        });
    }
    function clearLogs() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, activityLog_1.clearActivityLogs()];
                    case 1:
                        _a.sent();
                        setActivityLogs([]);
                        react_native_1.Alert.alert("Logs Cleared", "Recent activity log has been cleared.");
                        return [2 /*return*/];
                }
            });
        });
    }
    function logout() {
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }]
        });
    }
    function resetRegistration() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                react_native_1.Alert.alert("Reset Face Registration", "This will remove the saved face embedding from this device. You will need to register again.", [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Reset",
                        style: "destructive",
                        onPress: function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, faceStorage_1.clearFaceEmbedding()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, securityMetrics_1.clearSecurityMetrics()];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, livenessService_1.clearLivenessResult()];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, activityLog_1.addActivityLog("Face Registration Reset", "Saved face embedding was removed from this device.")];
                                    case 4:
                                        _a.sent();
                                        react_native_1.Alert.alert("Reset Complete", "Registered face has been removed.", [
                                            {
                                                text: "OK",
                                                onPress: function () {
                                                    return navigation.reset({
                                                        index: 0,
                                                        routes: [{ name: "Login" }]
                                                    });
                                                }
                                            }
                                        ]);
                                        return [2 /*return*/];
                                }
                            });
                        }); }
                    }
                ]);
                return [2 /*return*/];
            });
        });
    }
    var securityScore = lastMatchScore !== null
        ? Math.min(100, Math.round(lastMatchScore * 100))
        : 0;
    return (react_1["default"].createElement(react_native_1.ScrollView, { style: styles.screen, contentContainerStyle: styles.container, horizontal: false, showsVerticalScrollIndicator: false },
        react_1["default"].createElement(react_native_1.View, { style: styles.headerCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.successIcon }, "\u2713"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "VeriFace"),
            react_1["default"].createElement(react_native_1.Text, { style: styles.subtitle }, "Authenticated secure offline dashboard")),
        react_1["default"].createElement(react_native_1.View, { style: styles.securityCard },
            react_1["default"].createElement(react_native_1.View, { style: styles.cardHeader },
                react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Security Overview"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.scoreText }, lastMatchScore !== null ? securityScore + "/100" : "N/A")),
            react_1["default"].createElement(react_native_1.View, { style: styles.scoreBarBackground },
                react_1["default"].createElement(react_native_1.View, { style: [
                        styles.scoreBarFill,
                        {
                            width: lastMatchScore !== null ? securityScore + "%" : "0%"
                        }
                    ] })),
            react_1["default"].createElement(react_native_1.View, { style: styles.statusGrid },
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValueSuccess }, "Verified"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Authentication")),
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValue }, lastMatchScore !== null
                        ? lastMatchScore.toFixed(3)
                        : "N/A"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Match Score")),
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValue }, "Offline"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Mode")),
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: livenessPassed
                            ? styles.statusValueSuccess
                            : styles.statusValueWarning }, livenessPassed ? "Passed" : "Pending"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Presence Check"))),
            react_1["default"].createElement(react_native_1.Text, { style: styles.securityNote }, lastLoginTime
                ? "Last successful login: " + lastLoginTime
                : "Face embedding is stored locally. No network is required for authentication.")),
        react_1["default"].createElement(react_native_1.View, { style: styles.sessionCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Secure Session"),
            react_1["default"].createElement(react_native_1.View, { style: [
                    styles.sessionBadge,
                    sessionActive ? styles.activeBadge : styles.inactiveBadge
                ] },
                react_1["default"].createElement(react_native_1.Text, { style: styles.sessionBadgeText }, sessionActive ? "SESSION ACTIVE" : "SESSION INACTIVE")),
            !sessionActive ? (react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.primaryButton, onPress: startProtectedSession },
                react_1["default"].createElement(react_native_1.Text, { style: styles.primaryButtonText }, "Start Protected Session"))) : (react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.warningButton, onPress: endProtectedSession },
                react_1["default"].createElement(react_native_1.Text, { style: styles.primaryButtonText }, "End Protected Session")))),
        react_1["default"].createElement(react_native_1.View, { style: styles.actionsCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Protected Actions"),
            react_1["default"].createElement(react_native_1.View, { style: styles.actionGrid },
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [
                        styles.actionTile,
                        !sessionActive && styles.disabledTile
                    ], disabled: !sessionActive, onPress: verifyLocalIdentity },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionIcon }, "\uD83D\uDEE1\uFE0F"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionTitle }, "Verify Identity"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionDesc }, "Confirm local identity")),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [
                        styles.actionTile,
                        !sessionActive && styles.disabledTile
                    ], disabled: !sessionActive, onPress: markSecureAttendance },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionIcon }, "\uD83D\uDCCD"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionTitle }, "Attendance"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionDesc }, "Mark secure presence with GPS")),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [
                        styles.actionTile,
                        !sessionActive && styles.disabledTile
                    ], disabled: !sessionActive, onPress: exportSecureProof },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionIcon }, "\uD83D\uDCC4"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionTitle }, "Proof"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionDesc }, "Generate QR + hash proof")),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.actionTile, onPress: function () { return navigation.navigate("ProofVerification"); } },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionIcon }, "\uD83D\uDD0E"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionTitle }, "Verify Proof"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionDesc }, "Check proof integrity")),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.actionTile, onPress: runPresenceCheckInfo },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionIcon }, "\uD83E\uDDEC"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionTitle }, "Presence Check"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.actionDesc }, "Anti-spoof verification"))),
            !sessionActive && (react_1["default"].createElement(react_native_1.Text, { style: styles.helperText }, "Start a protected session to enable protected actions."))),
        react_1["default"].createElement(react_native_1.View, { style: styles.dataCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Attendance Records"),
            attendanceRecords.length === 0 ? (react_1["default"].createElement(react_native_1.Text, { style: styles.emptyLogText }, "No attendance records yet.")) : (attendanceRecords.slice(0, 5).map(function (record) { return (react_1["default"].createElement(react_native_1.View, { key: record.id, style: styles.attendanceItem },
                react_1["default"].createElement(react_native_1.View, { style: styles.attendanceContent },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.recordTitle }, "Verified Attendance"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.recordTime }, record.time),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.locationText },
                        "Lat: ",
                        record.latitude.toFixed(6)),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.locationText },
                        "Lng: ",
                        record.longitude.toFixed(6)),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.locationText },
                        "Accuracy: ",
                        Math.round(record.accuracy),
                        "m"),
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return react_native_1.Linking.openURL(record.mapUrl); } },
                        react_1["default"].createElement(react_native_1.Text, { style: styles.mapLink }, "Open Location in Maps"))),
                react_1["default"].createElement(react_native_1.Text, { style: styles.recordBadge }, "GPS"))); }))),
        react_1["default"].createElement(react_native_1.View, { style: styles.dataCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Last Secure Proof"),
            !lastProof ? (react_1["default"].createElement(react_native_1.Text, { style: styles.emptyLogText }, "No secure proof generated yet.")) : (react_1["default"].createElement(react_native_1.View, { style: styles.proofBox },
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Proof Code"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofCode }, lastProof.proofCode),
                react_1["default"].createElement(react_native_1.View, { style: styles.qrBox },
                    react_1["default"].createElement(react_native_qrcode_svg_1["default"], { value: proofService_1.getProofQRPayload(lastProof), size: 170 })),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Generated At"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue }, lastProof.generatedAt),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Method"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue }, lastProof.method),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Status"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofStatus }, "VERIFIED"),
                lastProof.matchScore !== null && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Match Score"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue }, lastProof.matchScore.toFixed(3)))),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Presence Verification"),
                react_1["default"].createElement(react_native_1.Text, { style: lastProof.livenessPassed
                        ? styles.proofStatus
                        : styles.proofValue }, lastProof.livenessPassed ? "PASSED" : "NOT AVAILABLE"),
                lastProof.livenessChallenge && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Presence Instruction"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue }, lastProof.livenessChallenge))),
                lastProof.livenessCompletedAt && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "Presence Completed At"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue }, lastProof.livenessCompletedAt))),
                lastProof.latitude !== null && lastProof.longitude !== null && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "GPS Location"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue },
                        lastProof.latitude.toFixed(6),
                        ",",
                        " ",
                        lastProof.longitude.toFixed(6)),
                    lastProof.accuracy !== null && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "GPS Accuracy"),
                        react_1["default"].createElement(react_native_1.Text, { style: styles.proofValue },
                            Math.round(lastProof.accuracy),
                            "m"))),
                    lastProof.mapUrl && (react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return react_native_1.Linking.openURL(lastProof.mapUrl); } },
                        react_1["default"].createElement(react_native_1.Text, { style: styles.mapLink }, "Open Proof Location in Maps"))))),
                react_1["default"].createElement(react_native_1.Text, { style: styles.proofLabel }, "SHA-256 Hash"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.hashText }, lastProof.hash),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.exportButton, onPress: exportJsonProofFile },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.exportButtonText }, "Export JSON Proof")),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.exportSecondaryButton, onPress: exportCertificateFile },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.exportSecondaryButtonText }, "Export Certificate"))))),
        react_1["default"].createElement(react_native_1.View, { style: styles.syncCard },
            react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Offline Sync Status"),
            react_1["default"].createElement(react_native_1.View, { style: styles.statusGrid },
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValue }, syncSummary.pending),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Pending")),
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValueSuccess }, syncSummary.synced),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Synced")),
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValueWarning }, syncSummary.failed),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Failed")),
                react_1["default"].createElement(react_native_1.View, { style: styles.statusBox },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusValue }, syncSummary.total),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.statusLabel }, "Total"))),
            react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.exportButton, onPress: runManualSync },
                react_1["default"].createElement(react_native_1.Text, { style: styles.exportButtonText }, "Run Offline-to-Online Sync")),
            react_1["default"].createElement(react_native_1.Text, { style: styles.securityNote }, "Records are stored locally while offline and can be synced when connectivity is available. Synced records are eligible for automatic purge after the retention period.")),
        react_1["default"].createElement(react_native_1.View, { style: styles.logCard },
            react_1["default"].createElement(react_native_1.View, { style: styles.cardHeader },
                react_1["default"].createElement(react_native_1.Text, { style: styles.cardTitle }, "Recent Activity"),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: clearLogs },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.clearText }, "Clear"))),
            activityLogs.length === 0 ? (react_1["default"].createElement(react_native_1.Text, { style: styles.emptyLogText }, "No activity yet.")) : (activityLogs.map(function (item) { return (react_1["default"].createElement(react_native_1.View, { key: item.id, style: styles.logItem },
                react_1["default"].createElement(react_native_1.View, { style: styles.logDot }),
                react_1["default"].createElement(react_native_1.View, { style: styles.logContent },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.logTitle }, item.title),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.logMessage }, item.message),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.logTime }, item.time)))); }))),
        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.secondaryButton, onPress: logout },
            react_1["default"].createElement(react_native_1.Text, { style: styles.secondaryButtonText }, "Logout")),
        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.dangerButton, onPress: resetRegistration },
            react_1["default"].createElement(react_native_1.Text, { style: styles.dangerButtonText }, "Reset Registered Face"))));
}
exports["default"] = DashboardScreen;
var styles = react_native_1.StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f8fafc",
        width: "100%"
    },
    headerCard: {
        width: "100%",
        backgroundColor: "#0f172a",
        borderRadius: 26,
        padding: 28,
        alignItems: "center",
        marginBottom: 18,
        elevation: 5
    },
    successIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#16a34a",
        color: "#ffffff",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 42,
        fontWeight: "900",
        marginBottom: 18
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        color: "#ffffff",
        marginBottom: 8
    },
    subtitle: {
        fontSize: 15,
        color: "#cbd5e1",
        textAlign: "center"
    },
    securityCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 3
    },
    sessionCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 3
    },
    actionsCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 3
    },
    dataCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 3
    },
    syncCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 3
    },
    logCard: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        elevation: 3
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#0f172a"
    },
    scoreText: {
        fontSize: 20,
        fontWeight: "900",
        color: "#16a34a"
    },
    scoreBarBackground: {
        height: 10,
        backgroundColor: "#e2e8f0",
        borderRadius: 999,
        overflow: "hidden",
        marginBottom: 18
    },
    scoreBarFill: {
        height: "100%",
        backgroundColor: "#16a34a",
        borderRadius: 999
    },
    statusGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%"
    },
    statusBox: {
        width: "48%",
        backgroundColor: "#f8fafc",
        borderRadius: 16,
        padding: 14,
        marginBottom: 10
    },
    statusValue: {
        color: "#2563eb",
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 4
    },
    statusValueSuccess: {
        color: "#16a34a",
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 4
    },
    statusValueWarning: {
        color: "#f97316",
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 4
    },
    statusLabel: {
        color: "#64748b",
        fontSize: 12,
        fontWeight: "700"
    },
    securityNote: {
        color: "#475569",
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8
    },
    sessionBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        marginBottom: 16
    },
    activeBadge: {
        backgroundColor: "#dcfce7"
    },
    inactiveBadge: {
        backgroundColor: "#e2e8f0"
    },
    sessionBadgeText: {
        color: "#0f172a",
        fontWeight: "900",
        fontSize: 12
    },
    primaryButton: {
        backgroundColor: "#2563eb",
        padding: 16,
        borderRadius: 16
    },
    warningButton: {
        backgroundColor: "#f97316",
        padding: 16,
        borderRadius: 16
    },
    primaryButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 16
    },
    actionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%"
    },
    actionTile: {
        width: "48%",
        backgroundColor: "#eff6ff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        minHeight: 138
    },
    disabledTile: {
        backgroundColor: "#f1f5f9",
        opacity: 0.55
    },
    actionIcon: {
        fontSize: 26,
        marginBottom: 10
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: "#0f172a",
        marginBottom: 6
    },
    actionDesc: {
        fontSize: 12,
        color: "#64748b",
        lineHeight: 17
    },
    helperText: {
        color: "#64748b",
        textAlign: "center",
        marginTop: 4
    },
    attendanceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#f8fafc",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10
    },
    attendanceContent: {
        flex: 1,
        marginRight: 10
    },
    recordTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: "#0f172a",
        marginBottom: 4
    },
    recordTime: {
        fontSize: 12,
        color: "#64748b",
        marginBottom: 6
    },
    locationText: {
        color: "#475569",
        fontSize: 12,
        marginTop: 3
    },
    mapLink: {
        color: "#2563eb",
        fontSize: 13,
        fontWeight: "800",
        marginTop: 8
    },
    recordBadge: {
        backgroundColor: "#dcfce7",
        color: "#16a34a",
        fontSize: 12,
        fontWeight: "900",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999
    },
    proofBox: {
        backgroundColor: "#f8fafc",
        borderRadius: 16,
        padding: 16
    },
    proofLabel: {
        color: "#64748b",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 10,
        marginBottom: 4
    },
    proofCode: {
        color: "#2563eb",
        fontSize: 16,
        fontWeight: "900",
        flexWrap: "wrap"
    },
    proofValue: {
        color: "#0f172a",
        fontSize: 14,
        fontWeight: "700",
        flexWrap: "wrap"
    },
    proofStatus: {
        alignSelf: "flex-start",
        backgroundColor: "#dcfce7",
        color: "#16a34a",
        fontSize: 12,
        fontWeight: "900",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        marginTop: 4,
        marginBottom: 8
    },
    qrBox: {
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        marginVertical: 14
    },
    hashText: {
        color: "#0f172a",
        fontSize: 11,
        fontWeight: "700",
        lineHeight: 16,
        flexWrap: "wrap"
    },
    logItem: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0"
    },
    logDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#2563eb",
        marginTop: 5,
        marginRight: 12
    },
    logContent: {
        flex: 1
    },
    logTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: "#0f172a",
        marginBottom: 3
    },
    logMessage: {
        fontSize: 13,
        color: "#475569",
        lineHeight: 18,
        flexShrink: 1
    },
    logTime: {
        fontSize: 12,
        color: "#94a3b8",
        marginTop: 4
    },
    emptyLogText: {
        color: "#64748b",
        textAlign: "center",
        paddingVertical: 18
    },
    clearText: {
        color: "#dc2626",
        fontWeight: "800"
    },
    secondaryButton: {
        width: "100%",
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2563eb"
    },
    secondaryButtonText: {
        color: "#2563eb",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 16
    },
    dangerButton: {
        width: "100%",
        backgroundColor: "#fee2e2",
        padding: 16,
        borderRadius: 16,
        marginBottom: 24
    },
    dangerButtonText: {
        color: "#dc2626",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 16
    },
    exportButton: {
        backgroundColor: "#2563eb",
        padding: 14,
        borderRadius: 14,
        marginTop: 16
    },
    exportButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 15
    },
    exportSecondaryButton: {
        backgroundColor: "#ffffff",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#2563eb"
    },
    exportSecondaryButtonText: {
        color: "#2563eb",
        textAlign: "center",
        fontWeight: "900",
        fontSize: 15
    }
});
