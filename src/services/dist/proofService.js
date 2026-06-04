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
exports.verifyLocalProof = exports.getProofQRPayload = exports.clearSecureProof = exports.getLastSecureProof = exports.generateSecureProof = void 0;
var crypto_js_1 = require("crypto-js");
var secureStorage_1 = require("./secureStorage");
var securityMetrics_1 = require("./securityMetrics");
var attendanceService_1 = require("./attendanceService");
var livenessService_1 = require("./livenessService");
var PROOF_KEY = "FACELOCK_LAST_PROOF";
function generateProofCode() {
    return "FLA-" + Date.now() + "-" + Math.floor(Math.random() * 999999);
}
function generateSecureProof() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __awaiter(this, void 0, Promise, function () {
        var matchScore, attendanceRecords, liveness, latestAttendance, proofCode, generatedAt, rawProofData, hash, proof;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, securityMetrics_1.getLastMatchScore()];
                case 1:
                    matchScore = _o.sent();
                    return [4 /*yield*/, attendanceService_1.getAttendanceRecords()];
                case 2:
                    attendanceRecords = _o.sent();
                    return [4 /*yield*/, livenessService_1.getLastLivenessResult()];
                case 3:
                    liveness = _o.sent();
                    latestAttendance = attendanceRecords.length > 0 ? attendanceRecords[0] : null;
                    proofCode = generateProofCode();
                    generatedAt = new Date().toLocaleString();
                    rawProofData = JSON.stringify({
                        proofCode: proofCode,
                        generatedAt: generatedAt,
                        method: "offline-face-auth",
                        status: "verified",
                        matchScore: matchScore,
                        livenessPassed: !!(liveness === null || liveness === void 0 ? void 0 : liveness.passed),
                        livenessChallenge: (_a = liveness === null || liveness === void 0 ? void 0 : liveness.challenge) !== null && _a !== void 0 ? _a : null,
                        livenessCompletedAt: (_b = liveness === null || liveness === void 0 ? void 0 : liveness.completedAt) !== null && _b !== void 0 ? _b : null,
                        latitude: (_c = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.latitude) !== null && _c !== void 0 ? _c : null,
                        longitude: (_d = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.longitude) !== null && _d !== void 0 ? _d : null,
                        accuracy: (_e = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.accuracy) !== null && _e !== void 0 ? _e : null,
                        mapUrl: (_f = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.mapUrl) !== null && _f !== void 0 ? _f : null
                    });
                    hash = crypto_js_1["default"].SHA256(rawProofData).toString();
                    proof = {
                        id: Date.now().toString(),
                        proofCode: proofCode,
                        generatedAt: generatedAt,
                        method: "offline-face-auth",
                        status: "verified",
                        matchScore: matchScore,
                        livenessPassed: !!(liveness === null || liveness === void 0 ? void 0 : liveness.passed),
                        livenessChallenge: (_g = liveness === null || liveness === void 0 ? void 0 : liveness.challenge) !== null && _g !== void 0 ? _g : null,
                        livenessCompletedAt: (_h = liveness === null || liveness === void 0 ? void 0 : liveness.completedAt) !== null && _h !== void 0 ? _h : null,
                        latitude: (_j = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.latitude) !== null && _j !== void 0 ? _j : null,
                        longitude: (_k = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.longitude) !== null && _k !== void 0 ? _k : null,
                        accuracy: (_l = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.accuracy) !== null && _l !== void 0 ? _l : null,
                        mapUrl: (_m = latestAttendance === null || latestAttendance === void 0 ? void 0 : latestAttendance.mapUrl) !== null && _m !== void 0 ? _m : null,
                        hash: hash
                    };
                    return [4 /*yield*/, secureStorage_1.secureSetItem(PROOF_KEY, JSON.stringify(proof))];
                case 4:
                    _o.sent();
                    return [2 /*return*/, proof];
            }
        });
    });
}
exports.generateSecureProof = generateSecureProof;
function getLastSecureProof() {
    return __awaiter(this, void 0, Promise, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, secureStorage_1.secureGetItem(PROOF_KEY)];
                case 1:
                    data = _a.sent();
                    if (!data) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, JSON.parse(data)];
            }
        });
    });
}
exports.getLastSecureProof = getLastSecureProof;
function clearSecureProof() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, secureStorage_1.secureRemoveItem(PROOF_KEY)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clearSecureProof = clearSecureProof;
function getProofQRPayload(proof) {
    return JSON.stringify({
        app: "VeriFace",
        proofCode: proof.proofCode,
        generatedAt: proof.generatedAt,
        method: proof.method,
        status: proof.status,
        matchScore: proof.matchScore,
        livenessPassed: proof.livenessPassed,
        livenessChallenge: proof.livenessChallenge,
        livenessCompletedAt: proof.livenessCompletedAt,
        latitude: proof.latitude,
        longitude: proof.longitude,
        accuracy: proof.accuracy,
        mapUrl: proof.mapUrl,
        hash: proof.hash
    });
}
exports.getProofQRPayload = getProofQRPayload;
function verifyLocalProof(proofCode, hash) {
    return __awaiter(this, void 0, Promise, function () {
        var storedProof, codeMatches, hashMatches;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getLastSecureProof()];
                case 1:
                    storedProof = _a.sent();
                    if (!storedProof) {
                        return [2 /*return*/, {
                                valid: false,
                                message: "No local proof found on this device."
                            }];
                    }
                    codeMatches = storedProof.proofCode.trim() === proofCode.trim();
                    hashMatches = storedProof.hash.trim().toLowerCase() === hash.trim().toLowerCase();
                    if (codeMatches && hashMatches) {
                        return [2 /*return*/, {
                                valid: true,
                                message: "Proof verified successfully.",
                                proof: storedProof
                            }];
                    }
                    return [2 /*return*/, {
                            valid: false,
                            message: "Proof verification failed. The proof may be invalid or tampered."
                        }];
            }
        });
    });
}
exports.verifyLocalProof = verifyLocalProof;
