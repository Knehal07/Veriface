import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking
} from "react-native";

import {
  useFocusEffect,
  useNavigation
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import QRCode from "react-native-qrcode-svg";

import { RootStackParamList } from "../types/navigation";
import { clearFaceEmbedding } from "../services/faceStorage";

import {
  getLastLivenessResult,
  clearLivenessResult
} from "../services/livenessService";

import {
  exportProofAsJsonFile,
  exportProofAsCertificateFile
} from "../services/proofExportService";

import {
  getSyncSummary,
  runOfflineToOnlineSync
} from "../services/syncService";

import {
  ActivityLogItem,
  addActivityLog,
  clearActivityLogs,
  getActivityLogs
} from "../services/activityLog";

import {
  getLastLoginTime,
  getLastMatchScore,
  clearSecurityMetrics
} from "../services/securityMetrics";

import {
  markAttendance,
  getAttendanceRecords,
  AttendanceRecord
} from "../services/attendanceService";

import {
  generateSecureProof,
  getLastSecureProof,
  getProofQRPayload,
  SecureProof
} from "../services/proofService";

type DashboardNavigationProp =
  NativeStackNavigationProp<RootStackParamList, "Dashboard">;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();

  const [livenessPassed, setLivenessPassed] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [lastMatchScore, setLastMatchScore] = useState<number | null>(null);
  const [lastLoginTime, setLastLoginTime] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [lastProof, setLastProof] = useState<SecureProof | null>(null);

  const [syncSummary, setSyncSummary] = useState({
    total: 0,
    pending: 0,
    synced: 0,
    failed: 0
  });

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  async function loadDashboardData() {
    await Promise.all([
      loadLogs(),
      loadSecurityMetrics(),
      loadAttendanceRecords(),
      loadLastProof(),
      loadLivenessStatus(),
      loadSyncSummary()
    ]);
  }

  async function loadLogs() {
    const logs = await getActivityLogs();
    setActivityLogs(logs);
  }

  async function loadSecurityMetrics() {
    const score = await getLastMatchScore();
    const time = await getLastLoginTime();

    setLastMatchScore(score);
    setLastLoginTime(time);
  }

  async function loadAttendanceRecords() {
    const records = await getAttendanceRecords();
    setAttendanceRecords(records);
  }

  async function loadLastProof() {
    const proof = await getLastSecureProof();
    setLastProof(proof);
  }

  async function loadLivenessStatus() {
    const result = await getLastLivenessResult();
    setLivenessPassed(!!result?.passed);
  }

  async function loadSyncSummary() {
    const summary = await getSyncSummary();
    setSyncSummary(summary);
  }

  async function runManualSync() {
    const result = await runOfflineToOnlineSync();

    setSyncSummary(result);

    await addActivityLog(
      "Sync Completed",
      `Pending: ${result.pending}, Synced: ${result.synced}, Failed: ${result.failed}`
    );

    await loadLogs();

    Alert.alert(
      "Sync Completed",
      `Total: ${result.total}\nPending: ${result.pending}\nSynced: ${result.synced}\nFailed: ${result.failed}`
    );
  }

  async function startProtectedSession() {
    setSessionActive(true);

    await addActivityLog(
      "Protected Session Started",
      "Secure offline session is now active."
    );

    await loadLogs();

    Alert.alert(
      "Session Started",
      "Your protected session is now active."
    );
  }

  async function endProtectedSession() {
    setSessionActive(false);

    await addActivityLog(
      "Protected Session Ended",
      "Secure offline session was ended."
    );

    await loadLogs();

    Alert.alert(
      "Session Ended",
      "Your protected session has ended."
    );
  }

  function verifyLocalIdentity() {
    navigation.navigate("FaceCapture", {
      mode: "verify"
    });
  }

  async function markSecureAttendance() {
    try {
      const record = await markAttendance();

      await addActivityLog(
        "Attendance Marked",
        `Secure attendance marked at ${record.time} with GPS location.`
      );

      await loadAttendanceRecords();
      await loadLogs();

      Alert.alert(
        "Attendance Marked",
        `Offline attendance marked successfully.\n\nTime: ${record.time}\nLatitude: ${record.latitude.toFixed(
          6
        )}\nLongitude: ${record.longitude.toFixed(
          6
        )}\nAccuracy: ${Math.round(record.accuracy)} meters`
      );
    } catch (error) {
      Alert.alert("Location Error", String(error));
    }
  }

  async function exportSecureProof() {
    const proof = await generateSecureProof();

    await addActivityLog(
      "Secure Proof Generated",
      `Proof code generated: ${proof.proofCode}`
    );

    await loadLogs();
    await loadLastProof();

    Alert.alert(
      "Secure Proof Generated",
      `Proof Code:\n${proof.proofCode}\n\nGenerated At:\n${proof.generatedAt}\n\nHash:\n${proof.hash}`
    );
  }

  async function exportJsonProofFile() {
    try {
      const exported = await exportProofAsJsonFile();

      await addActivityLog(
        "Proof JSON Exported",
        `Proof JSON exported: ${exported.fileName}`
      );

      await loadLogs();

      Alert.alert(
        "JSON Proof Exported",
        `File saved locally:\n\n${exported.filePath}`
      );
    } catch (error) {
      Alert.alert("Export Failed", String(error));
    }
  }

  async function exportCertificateFile() {
    try {
      const exported = await exportProofAsCertificateFile();

      await addActivityLog(
        "Proof Certificate Exported",
        `Proof certificate exported: ${exported.fileName}`
      );

      await loadLogs();

      Alert.alert(
        "Certificate Exported",
        `File saved locally:\n\n${exported.filePath}`
      );
    } catch (error) {
      Alert.alert("Export Failed", String(error));
    }
  }

  async function runPresenceCheckInfo() {
    await addActivityLog(
      "Presence Check",
      "Anti-spoof verification status viewed from dashboard."
    );

    await loadLogs();

    Alert.alert(
      "Presence Check",
      livenessPassed
        ? "Presence verification has passed for the latest login session."
        : "Presence verification is pending. Login again through Presence Verification."
    );
  }

  async function clearLogs() {
    await clearActivityLogs();
    setActivityLogs([]);

    Alert.alert("Logs Cleared", "Recent activity log has been cleared.");
  }

  function logout() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });
  }

  async function resetRegistration() {
    Alert.alert(
      "Reset Face Registration",
      "This will remove the saved face embedding from this device. You will need to register again.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await clearFaceEmbedding();
            await clearSecurityMetrics();
            await clearLivenessResult();

            await addActivityLog(
              "Face Registration Reset",
              "Saved face embedding was removed from this device."
            );

            Alert.alert(
              "Reset Complete",
              "Registered face has been removed.",
              [
                {
                  text: "OK",
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }]
                    })
                }
              ]
            );
          }
        }
      ]
    );
  }

  const securityScore =
    lastMatchScore !== null
      ? Math.min(100, Math.round(lastMatchScore * 100))
      : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      horizontal={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.successIcon}>✓</Text>

        <Text style={styles.title}>VeriFace</Text>

        <Text style={styles.subtitle}>
          Authenticated secure offline dashboard
        </Text>
      </View>

      <View style={styles.securityCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Security Overview</Text>

          <Text style={styles.scoreText}>
            {lastMatchScore !== null ? `${securityScore}/100` : "N/A"}
          </Text>
        </View>

        <View style={styles.scoreBarBackground}>
          <View
            style={[
              styles.scoreBarFill,
              {
                width: lastMatchScore !== null ? `${securityScore}%` : "0%"
              }
            ]}
          />
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusValueSuccess}>Verified</Text>
            <Text style={styles.statusLabel}>Authentication</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>
              {lastMatchScore !== null
                ? lastMatchScore.toFixed(3)
                : "N/A"}
            </Text>
            <Text style={styles.statusLabel}>Match Score</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>Offline</Text>
            <Text style={styles.statusLabel}>Mode</Text>
          </View>

          <View style={styles.statusBox}>
            <Text
              style={
                livenessPassed
                  ? styles.statusValueSuccess
                  : styles.statusValueWarning
              }
            >
              {livenessPassed ? "Passed" : "Pending"}
            </Text>

            <Text style={styles.statusLabel}>Presence Check</Text>
          </View>
        </View>

        <Text style={styles.securityNote}>
          {lastLoginTime
            ? `Last successful login: ${lastLoginTime}`
            : "Face embedding is stored locally. No network is required for authentication."}
        </Text>
      </View>

      <View style={styles.sessionCard}>
        <Text style={styles.cardTitle}>Secure Session</Text>

        <View
          style={[
            styles.sessionBadge,
            sessionActive ? styles.activeBadge : styles.inactiveBadge
          ]}
        >
          <Text style={styles.sessionBadgeText}>
            {sessionActive ? "SESSION ACTIVE" : "SESSION INACTIVE"}
          </Text>
        </View>

        {!sessionActive ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={startProtectedSession}
          >
            <Text style={styles.primaryButtonText}>
              Start Protected Session
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.warningButton}
            onPress={endProtectedSession}
          >
            <Text style={styles.primaryButtonText}>
              End Protected Session
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Protected Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[
              styles.actionTile,
              !sessionActive && styles.disabledTile
            ]}
            disabled={!sessionActive}
            onPress={verifyLocalIdentity}
          >
            <Text style={styles.actionIcon}>🛡️</Text>
            <Text style={styles.actionTitle}>Verify Identity</Text>
            <Text style={styles.actionDesc}>Confirm local identity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionTile,
              !sessionActive && styles.disabledTile
            ]}
            disabled={!sessionActive}
            onPress={markSecureAttendance}
          >
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionTitle}>Attendance</Text>
            <Text style={styles.actionDesc}>Mark secure presence with GPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionTile,
              !sessionActive && styles.disabledTile
            ]}
            disabled={!sessionActive}
            onPress={exportSecureProof}
          >
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionTitle}>Proof</Text>
            <Text style={styles.actionDesc}>Generate QR + hash proof</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => navigation.navigate("ProofVerification")}
          >
            <Text style={styles.actionIcon}>🔎</Text>
            <Text style={styles.actionTitle}>Verify Proof</Text>
            <Text style={styles.actionDesc}>Check proof integrity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionTile}
            onPress={runPresenceCheckInfo}
          >
            <Text style={styles.actionIcon}>🧬</Text>
            <Text style={styles.actionTitle}>Presence Check</Text>
            <Text style={styles.actionDesc}>Anti-spoof verification</Text>
          </TouchableOpacity>
        </View>

        {!sessionActive && (
          <Text style={styles.helperText}>
            Start a protected session to enable protected actions.
          </Text>
        )}
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.cardTitle}>Attendance Records</Text>

        {attendanceRecords.length === 0 ? (
          <Text style={styles.emptyLogText}>
            No attendance records yet.
          </Text>
        ) : (
          attendanceRecords.slice(0, 5).map(record => (
            <View key={record.id} style={styles.attendanceItem}>
              <View style={styles.attendanceContent}>
                <Text style={styles.recordTitle}>Verified Attendance</Text>

                <Text style={styles.recordTime}>
                  {record.time}
                </Text>

                <Text style={styles.locationText}>
                  Lat: {record.latitude.toFixed(6)}
                </Text>

                <Text style={styles.locationText}>
                  Lng: {record.longitude.toFixed(6)}
                </Text>

                <Text style={styles.locationText}>
                  Accuracy: {Math.round(record.accuracy)}m
                </Text>

                <TouchableOpacity
                  onPress={() => Linking.openURL(record.mapUrl)}
                >
                  <Text style={styles.mapLink}>
                    Open Location in Maps
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.recordBadge}>GPS</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.dataCard}>
        <Text style={styles.cardTitle}>Last Secure Proof</Text>

        {!lastProof ? (
          <Text style={styles.emptyLogText}>
            No secure proof generated yet.
          </Text>
        ) : (
          <View style={styles.proofBox}>
            <Text style={styles.proofLabel}>Proof Code</Text>
            <Text style={styles.proofCode}>{lastProof.proofCode}</Text>

            <View style={styles.qrBox}>
              <QRCode
                value={getProofQRPayload(lastProof)}
                size={170}
              />
            </View>

            <Text style={styles.proofLabel}>Generated At</Text>
            <Text style={styles.proofValue}>{lastProof.generatedAt}</Text>

            <Text style={styles.proofLabel}>Method</Text>
            <Text style={styles.proofValue}>{lastProof.method}</Text>

            <Text style={styles.proofLabel}>Status</Text>
            <Text style={styles.proofStatus}>VERIFIED</Text>

            {lastProof.matchScore !== null && (
              <>
                <Text style={styles.proofLabel}>Match Score</Text>
                <Text style={styles.proofValue}>
                  {lastProof.matchScore.toFixed(3)}
                </Text>
              </>
            )}

            <Text style={styles.proofLabel}>Presence Verification</Text>
            <Text
              style={
                lastProof.livenessPassed
                  ? styles.proofStatus
                  : styles.proofValue
              }
            >
              {lastProof.livenessPassed ? "PASSED" : "NOT AVAILABLE"}
            </Text>

            {lastProof.livenessChallenge && (
              <>
                <Text style={styles.proofLabel}>Presence Instruction</Text>
                <Text style={styles.proofValue}>
                  {lastProof.livenessChallenge}
                </Text>
              </>
            )}

            {lastProof.livenessCompletedAt && (
              <>
                <Text style={styles.proofLabel}>Presence Completed At</Text>
                <Text style={styles.proofValue}>
                  {lastProof.livenessCompletedAt}
                </Text>
              </>
            )}

            {lastProof.latitude !== null && lastProof.longitude !== null && (
              <>
                <Text style={styles.proofLabel}>GPS Location</Text>
                <Text style={styles.proofValue}>
                  {lastProof.latitude.toFixed(6)},{" "}
                  {lastProof.longitude.toFixed(6)}
                </Text>

                {lastProof.accuracy !== null && (
                  <>
                    <Text style={styles.proofLabel}>GPS Accuracy</Text>
                    <Text style={styles.proofValue}>
                      {Math.round(lastProof.accuracy)}m
                    </Text>
                  </>
                )}

                {lastProof.mapUrl && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(lastProof.mapUrl!)}
                  >
                    <Text style={styles.mapLink}>
                      Open Proof Location in Maps
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <Text style={styles.proofLabel}>SHA-256 Hash</Text>
            <Text style={styles.hashText}>{lastProof.hash}</Text>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={exportJsonProofFile}
            >
              <Text style={styles.exportButtonText}>
                Export JSON Proof
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportSecondaryButton}
              onPress={exportCertificateFile}
            >
              <Text style={styles.exportSecondaryButtonText}>
                Export Certificate
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.syncCard}>
        <Text style={styles.cardTitle}>Offline Sync Status</Text>

        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>{syncSummary.pending}</Text>
            <Text style={styles.statusLabel}>Pending</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusValueSuccess}>{syncSummary.synced}</Text>
            <Text style={styles.statusLabel}>Synced</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusValueWarning}>{syncSummary.failed}</Text>
            <Text style={styles.statusLabel}>Failed</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>{syncSummary.total}</Text>
            <Text style={styles.statusLabel}>Total</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={runManualSync}
        >
          <Text style={styles.exportButtonText}>
            Run Offline-to-Online Sync
          </Text>
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          Records are stored locally while offline and can be synced when
          connectivity is available. Synced records are eligible for automatic
          purge after the retention period.
        </Text>
      </View>

      <View style={styles.logCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Activity</Text>

          <TouchableOpacity onPress={clearLogs}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {activityLogs.length === 0 ? (
          <Text style={styles.emptyLogText}>No activity yet.</Text>
        ) : (
          activityLogs.map(item => (
            <View key={item.id} style={styles.logItem}>
              <View style={styles.logDot} />

              <View style={styles.logContent}>
                <Text style={styles.logTitle}>{item.title}</Text>
                <Text style={styles.logMessage}>{item.message}</Text>
                <Text style={styles.logTime}>{item.time}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={logout}>
        <Text style={styles.secondaryButtonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={resetRegistration}>
        <Text style={styles.dangerButtonText}>Reset Registered Face</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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