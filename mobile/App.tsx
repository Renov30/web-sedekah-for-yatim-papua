import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { DataProvider, useData } from "./src/context/DataContext";
import { detectDefaultServerUrl } from "./src/services/syncEngine";
import { LoginScreen } from "./src/screens/LoginScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { OrphansScreen } from "./src/screens/OrphansScreen";
import { AVScreen } from "./src/screens/AVScreen";
import { WilayahScreen } from "./src/screens/WilayahScreen";

type TabType = "dashboard" | "anak-yatim" | "av" | "wilayah";

const MainShell: React.FC = () => {
  const {
    isBootstrapping,
    session,
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncFeedback,
    serverUrl,
    updateServerUrl,
    triggerSync,
    logout,
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempUrl, setTempUrl] = useState(serverUrl);

  if (isBootstrapping) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#5E2276" />
        <Text style={styles.loadingText}>
          Memuat basis data lapangan SFY Papua...
        </Text>
      </View>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Branded Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMark}>
            <Ionicons name="heart" size={18} color="#facc15" />
          </View>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandName}>SFY Papua</Text>
              <View style={styles.roleTag}>
                <Text style={styles.roleTagText}>LAPANGAN</Text>
              </View>
            </View>
            <Text style={styles.userSub} numberOfLines={1}>
              {session.user.nama}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Sync & Connection Status Pill */}
          <TouchableOpacity
            style={[
              styles.syncPill,
              isOnline ? styles.syncPillOnline : styles.syncPillOffline,
            ]}
            onPress={() => triggerSync(false)}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOnline ? "#4ade80" : "#facc15" },
                  ]}
                />
                <Text style={styles.syncPillText}>
                  {isOnline
                    ? pendingCount > 0
                      ? `Sync (${pendingCount})`
                      : "Online"
                    : pendingCount > 0
                    ? `Offline (${pendingCount})`
                    : "Offline"}
                </Text>
                <Ionicons name="sync" size={13} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => {
              setTempUrl(serverUrl);
              setShowProfileModal(true);
            }}
          >
            <Ionicons name="settings-outline" size={19} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Persistent Offline / Pending Queue Banner */}
      {(!isOnline || pendingCount > 0) && (
        <View
          style={[
            styles.offlineBanner,
            !isOnline ? styles.bannerAmber : styles.bannerPurple,
          ]}
        >
          <Ionicons
            name={!isOnline ? "cloud-offline-outline" : "cloud-upload-outline"}
            size={15}
            color={!isOnline ? "#92400e" : "#5E2276"}
          />
          <Text
            style={[
              styles.offlineBannerText,
              { color: !isOnline ? "#92400e" : "#5E2276" },
            ]}
            numberOfLines={2}
          >
            {!isOnline
              ? `Mode Offline Aktif — Data dibaca & disimpan di perangkat (${pendingCount} antrean lokal). Otomatis disinkronkan saat internet kembali.`
              : `${pendingCount} perubahan lokal siap diunggah ke server database.`}
          </Text>
          <TouchableOpacity
            style={styles.bannerSyncBtn}
            onPress={() => triggerSync(false)}
          >
            <Text style={styles.bannerSyncBtnText}>Sinkron</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toast Feedback Banner */}
      {lastSyncFeedback && (
        <View style={styles.toastBanner}>
          <Ionicons name="information-circle" size={16} color="#ffffff" />
          <Text style={styles.toastText}>{lastSyncFeedback}</Text>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.mainBody}>
        {activeTab === "dashboard" && (
          <DashboardScreen onNavigateTab={setActiveTab} />
        )}
        {activeTab === "anak-yatim" && <OrphansScreen />}
        {activeTab === "av" && <AVScreen />}
        {activeTab === "wilayah" && <WilayahScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <NavButton
          active={activeTab === "dashboard"}
          icon="grid"
          label="Dashboard"
          onPress={() => setActiveTab("dashboard")}
        />
        <NavButton
          active={activeTab === "anak-yatim"}
          icon="school"
          label="Anak Yatim"
          onPress={() => setActiveTab("anak-yatim")}
        />
        <NavButton
          active={activeTab === "av"}
          icon="people"
          label="Koord. AV"
          onPress={() => setActiveTab("av")}
        />
        <NavButton
          active={activeTab === "wilayah"}
          icon="map"
          label="Wilayah"
          onPress={() => setActiveTab("wilayah")}
        />
      </View>

      {/* Settings & Account Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pengaturan & Sesi Petugas</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Ionicons name="close" size={22} color="#57534e" />
              </TouchableOpacity>
            </View>

            <View style={styles.userBox}>
              <Text style={styles.userName}>{session.user.nama}</Text>
              <Text style={styles.userEmail}>{session.user.email}</Text>
              <Text style={styles.userRole}>
                {session.roleName} • {session.user.wilayahTugas}
              </Text>
            </View>

            <Text style={styles.label}>URL Server API Database (Next.js):</Text>
            <TextInput
              style={styles.input}
              value={tempUrl}
              onChangeText={setTempUrl}
              autoCapitalize="none"
              placeholder="http://192.168.1.15:3000"
            />

            <View style={styles.presetRow}>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setTempUrl(detectDefaultServerUrl())}
              >
                <Text style={styles.presetText}>
                  Otomatis ({detectDefaultServerUrl().replace("http://", "")})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => setTempUrl("http://10.0.2.2:3000")}
              >
                <Text style={styles.presetText}>Emulator (10.0.2.2)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveUrlBtn}
              onPress={async () => {
                await updateServerUrl(tempUrl);
                setShowProfileModal(false);
              }}
            >
              <Ionicons name="save-outline" size={16} color="#ffffff" />
              <Text style={styles.saveUrlBtnText}>
                Simpan Server & Sinkronkan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                setShowProfileModal(false);
                await logout();
              }}
            >
              <Ionicons name="log-out-outline" size={16} color="#dc2626" />
              <Text style={styles.logoutBtnText}>Keluar dari Akun Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const NavButton: React.FC<{
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}> = ({ active, icon, label, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
      <Ionicons
        name={active ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap)}
        size={20}
        color={active ? "#5E2276" : "#78716c"}
      />
    </View>
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <StatusBar style="light" />
        <MainShell />
      </DataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#5E2276",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#FAF8FB",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: "#57534e",
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#5E2276",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  roleTag: {
    backgroundColor: "#facc15",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1c0b27",
  },
  userSub: {
    fontSize: 11,
    color: "#e9d5ff",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  syncPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  syncPillOnline: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  syncPillOffline: {
    backgroundColor: "rgba(250, 204, 21, 0.25)",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  syncPillText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  profileBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  bannerAmber: {
    backgroundColor: "#fef3c7",
    borderBottomColor: "#fde68a",
  },
  bannerPurple: {
    backgroundColor: "#f3e8ff",
    borderBottomColor: "#e9d5ff",
  },
  offlineBannerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 15,
  },
  bannerSyncBtn: {
    backgroundColor: "#5E2276",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bannerSyncBtnText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  toastBanner: {
    backgroundColor: "#065f46",
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toastText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  mainBody: {
    flex: 1,
    backgroundColor: "#FAF8FB",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  navIconWrap: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
  },
  navIconWrapActive: {
    backgroundColor: "#f3e8ff",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#78716c",
  },
  navLabelActive: {
    color: "#5E2276",
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(28, 25, 23, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1c1917",
  },
  userBox: {
    backgroundColor: "#faf5ff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1c1917",
  },
  userEmail: {
    fontSize: 12,
    color: "#5E2276",
    fontWeight: "600",
    marginTop: 1,
  },
  userRole: {
    fontSize: 11,
    color: "#78716c",
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#44403c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: "#1c1917",
    backgroundColor: "#fafaf9",
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
  },
  presetBtn: {
    backgroundColor: "#f5f5f4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  presetText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#57534e",
  },
  saveUrlBtn: {
    backgroundColor: "#5E2276",
    borderRadius: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveUrlBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  logoutBtnText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "700",
  },
});
