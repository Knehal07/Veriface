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
exports.exportProofAsCertificateFile = exports.exportProofAsJsonFile = void 0;
var react_native_fs_1 = require("react-native-fs");
var proofService_1 = require("./proofService");
function safeFileName(value) {
    return value.replace(/[^a-zA-Z0-9-_]/g, "_");
}
function buildProofExportPayload(proof) {
    return {
        app: "VeriFace",
        exportType: "LOCAL_SECURE_PROOF",
        exportedAt: new Date().toLocaleString(),
        proofCode: proof.proofCode,
        generatedAt: proof.generatedAt,
        method: proof.method,
        status: proof.status,
        matchScore: proof.matchScore,
        presenceVerification: {
            passed: proof.livenessPassed,
            challenge: proof.livenessChallenge,
            completedAt: proof.livenessCompletedAt
        },
        location: {
            latitude: proof.latitude,
            longitude: proof.longitude,
            accuracy: proof.accuracy,
            mapUrl: proof.mapUrl
        },
        integrity: {
            algorithm: "SHA-256",
            hash: proof.hash
        },
        qrPayload: proofService_1.getProofQRPayload(proof)
    };
}
function buildCertificateText(proof) {
    var _a, _b, _c;
    return ("\nVeriFace SECURE LOCAL PROOF\n================================\n\nProof Code:\n" + proof.proofCode + "\n\nStatus:\n" + proof.status.toUpperCase() + "\n\nMethod:\n" + proof.method + "\n\nGenerated At:\n" + proof.generatedAt + "\n\nFace Match Score:\n" + (proof.matchScore !== null ? proof.matchScore.toFixed(3) : "N/A") + "\n\nPresence Verification:\n" + (proof.livenessPassed ? "PASSED" : "NOT AVAILABLE") + "\n\nPresence Instruction:\n" + ((_a = proof.livenessChallenge) !== null && _a !== void 0 ? _a : "N/A") + "\n\nPresence Completed At:\n" + ((_b = proof.livenessCompletedAt) !== null && _b !== void 0 ? _b : "N/A") + "\n\nGPS Location:\n" + (proof.latitude !== null && proof.longitude !== null
        ? proof.latitude.toFixed(6) + ", " + proof.longitude.toFixed(6)
        : "N/A") + "\n\nGPS Accuracy:\n" + (proof.accuracy !== null ? Math.round(proof.accuracy) + " meters" : "N/A") + "\n\nMap URL:\n" + ((_c = proof.mapUrl) !== null && _c !== void 0 ? _c : "N/A") + "\n\nSHA-256 Hash:\n" + proof.hash + "\n\nVerification Note:\nThis proof was generated locally on the device using offline face authentication.\nThe SHA-256 hash can be used to detect tampering.\n").trim();
}
function exportProofAsJsonFile() {
    return __awaiter(this, void 0, void 0, function () {
        var proof, payload, fileName, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, proofService_1.getLastSecureProof()];
                case 1:
                    proof = _a.sent();
                    if (!proof) {
                        throw new Error("No secure proof found. Generate a proof first.");
                    }
                    payload = buildProofExportPayload(proof);
                    fileName = "VeriFace_Proof_" + safeFileName(proof.proofCode) + ".json";
                    filePath = react_native_fs_1["default"].DocumentDirectoryPath + "/" + fileName;
                    return [4 /*yield*/, react_native_fs_1["default"].writeFile(filePath, JSON.stringify(payload, null, 2), "utf8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            filePath: filePath,
                            fileName: fileName,
                            proof: proof
                        }];
            }
        });
    });
}
exports.exportProofAsJsonFile = exportProofAsJsonFile;
function exportProofAsCertificateFile() {
    return __awaiter(this, void 0, void 0, function () {
        var proof, certificateText, fileName, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, proofService_1.getLastSecureProof()];
                case 1:
                    proof = _a.sent();
                    if (!proof) {
                        throw new Error("No secure proof found. Generate a proof first.");
                    }
                    certificateText = buildCertificateText(proof);
                    fileName = "VeriFace_Certificate_" + safeFileName(proof.proofCode) + ".txt";
                    filePath = react_native_fs_1["default"].DocumentDirectoryPath + "/" + fileName;
                    return [4 /*yield*/, react_native_fs_1["default"].writeFile(filePath, certificateText, "utf8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            filePath: filePath,
                            fileName: fileName,
                            proof: proof
                        }];
            }
        });
    });
}
exports.exportProofAsCertificateFile = exportProofAsCertificateFile;
