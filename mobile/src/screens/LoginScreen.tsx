import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import {
  detectDefaultServerUrl,
  PRODUCTION_SERVER_URL,
} from "../services/syncEngine";

export const LoginScreen: React.FC = () => {
  const { login, serverUrl, updateServerUrl, isOnline } = useData();
  const [email, setEmail] = useState("admin@sfypapua.org");
  const [password, setPassword] = useState("AdminSFY2025!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showServerModal, setShowServerModal] = useState(false);
  const [tempUrl, setTempUrl] = useState(serverUrl);

  const handleLogin = async () => {
    setErrorMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || "Gagal masuk ke sistem.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveServerUrl = async () => {
    await updateServerUrl(tempUrl);
    setShowServerModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Connection & Server Config Pill */}
        <View style={styles.topBar}>
          <View
            style={[
              styles.connBadge,
              isOnline ? styles.connOnline : styles.connOffline,
            ]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: isOnline ? "#10b981" : "#f59e0b" },
              ]}
            />
            <Text
              style={[
                styles.connText,
                { color: isOnline ? "#065f46" : "#92400e" },
              ]}
            >
              {isOnline ? "Server Terhubung" : "Mode Offline Siap"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.serverBtn}
            onPress={() => {
              setTempUrl(serverUrl);
              setShowServerModal(true);
            }}
          >
            <Ionicons name="server-outline" size={14} color="#5E2276" />
            <Text style={styles.serverBtnText}>Server API</Text>
          </TouchableOpacity>
        </View>

        {/* Main Login Card */}
        <View style={styles.card}>
          <View style={styles.logoBox}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerBlock}>
            <View style={styles.badgeRow}>
              <Text style={styles.brandTitle}>SFY Papua</Text>
              <View style={styles.adminPill}>
                <Text style={styles.adminPillText}>MOBILE ADMIN</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              Aplikasi Pendataan Lapangan — Anak Yatim, AV & Wilayah Papua
              Selatan
            </Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#dc2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Alamat Email Petugas / Admin</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#78716c"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="admin@sfypapua.org"
                placeholderTextColor="#a8a29e"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#78716c"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#a8a29e"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#78716c"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  Masuk ke Portal Lapangan
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.autofillBox}
            onPress={() => {
              setEmail("admin@sfypapua.org");
              setPassword("AdminSFY2025!");
              setErrorMsg(null);
            }}
          >
            <Ionicons name="key-outline" size={15} color="#5E2276" />
            <Text style={styles.autofillText}>
              Gunakan Kredensial Master Admin (admin@sfypapua.org)
            </Text>
          </TouchableOpacity>

          <View style={styles.offlineInfoBox}>
            <Ionicons
              name="cloud-offline-outline"
              size={18}
              color="#5E2276"
            />
            <Text style={styles.offlineInfoText}>
              <Text style={{ fontWeight: "700" }}>Fitur Offline-First Aktif: </Text>
              Jika berada di kampung pedalaman tanpa sinyal internet, Anda tetap
              dapat login dan menginput data. Data otomatis tersimpan di HP dan
              disinkronkan ke database saat internet kembali terhubung.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Server URL Configuration Modal */}
      <Modal
        visible={showServerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServerModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Konfigurasi Server Database</Text>
              <TouchableOpacity onPress={() => setShowServerModal(false)}>
                <Ionicons name="close" size={22} color="#57534e" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Masukkan alamat URL server Next.js SFY Papua yang terhubung ke
              database PostgreSQL.
            </Text>

            <TextInput
              style={styles.modalInput}
              value={tempUrl}
              onChangeText={setTempUrl}
              placeholder="http://192.168.1.15:3000"
              autoCapitalize="none"
            />

            <View style={styles.presetRow}>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => setTempUrl(PRODUCTION_SERVER_URL)}
              >
                <Text style={styles.presetChipText}>
                  Production (sfypapua.org)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => setTempUrl(detectDefaultServerUrl())}
              >
                <Text style={styles.presetChipText}>
                  Otomatis ({detectDefaultServerUrl().replace(/^https?:\/\//, "")})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => setTempUrl("http://10.0.2.2:3000")}
              >
                <Text style={styles.presetChipText}>Emulator (10.0.2.2)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowServerModal(false)}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveServerUrl}
              >
                <Text style={styles.saveBtnText}>Simpan & Hubungkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FB",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  connBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  connOnline: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  connOffline: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  connText: {
    fontSize: 11,
    fontWeight: "600",
  },
  serverBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5,
  },
  serverBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5E2276",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    shadowColor: "#1c1917",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e9d5ff",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1c1917",
  },
  adminPill: {
    backgroundColor: "#facc15",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  adminPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1c0b27",
  },
  subtitle: {
    fontSize: 12,
    color: "#78716c",
    textAlign: "center",
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#991b1b",
    fontWeight: "500",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#44403c",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 12,
    backgroundColor: "#fafaf9",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#1c1917",
  },
  eyeBtn: {
    padding: 6,
  },
  loginButton: {
    backgroundColor: "#5E2276",
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  autofillBox: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  autofillText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "600",
    color: "#5E2276",
    textAlign: "center",
  },
  offlineInfoBox: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f5f5f4",
  },
  offlineInfoText: {
    flex: 1,
    fontSize: 11,
    color: "#57534e",
    lineHeight: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(28, 25, 23, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1c1917",
  },
  modalDesc: {
    fontSize: 12,
    color: "#78716c",
    marginBottom: 12,
    lineHeight: 18,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: "#1c1917",
    backgroundColor: "#fafaf9",
    marginBottom: 12,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: "#f5f5f4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  presetChipText: {
    fontSize: 11,
    color: "#44403c",
    fontWeight: "600",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f4",
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#57534e",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#5E2276",
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
});

