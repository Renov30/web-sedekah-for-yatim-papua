import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";

interface DashboardScreenProps {
  onNavigateTab: (tab: "dashboard" | "anak-yatim" | "av" | "wilayah") => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateTab,
}) => {
  const {
    orphans,
    avs,
    distriks,
    kampungs,
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncTime,
    triggerSync,
    updateOrphan,
  } = useData();

  const activeOrphans = useMemo(
    () => orphans.filter((o) => !o.isDeleted),
    [orphans]
  );
  const activeAvs = useMemo(() => avs.filter((a) => !a.isDeleted), [avs]);
  const activeDistriks = useMemo(
    () => distriks.filter((d) => !d.isDeleted),
    [distriks]
  );
  const activeKampungs = useMemo(
    () => kampungs.filter((k) => !k.isDeleted),
    [kampungs]
  );

  const verifiedCount = useMemo(
    () =>
      activeOrphans.filter((o) => o.statusVerifikasi === "Terverifikasi")
        .length,
    [activeOrphans]
  );

  const actionableOrphans = useMemo(
    () =>
      activeOrphans.filter(
        (o) =>
          o.statusVerifikasi === "Menunggu Survei" ||
          o.statusVerifikasi === "Perlu Pembaruan"
      ),
    [activeOrphans]
  );

  const regionalDistribution = useMemo(() => {
    const map: Record<
      string,
      {
        distrik: string;
        kabupaten: string;
        count: number;
        kampungs: Set<string>;
        avs: Set<string>;
      }
    > = {};

    activeOrphans.forEach((o) => {
      const key = o.asalDaerah || "Distrik Merauke";
      if (!map[key]) {
        map[key] = {
          distrik: key,
          kabupaten: o.kabupaten || "Kab. Merauke",
          count: 0,
          kampungs: new Set(),
          avs: new Set(),
        };
      }
      map[key].count += 1;
      if (o.kampung) map[key].kampungs.add(o.kampung);
      if (o.pjAvNama) map[key].avs.add(o.pjAvNama);
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [activeOrphans]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isSyncing}
          onRefresh={() => triggerSync(false)}
          colors={["#5E2276"]}
          tintColor="#5E2276"
        />
      }
    >
      {/* Sync & Offline Status Card */}
      <View
        style={[
          styles.syncCard,
          isOnline ? styles.syncCardOnline : styles.syncCardOffline,
        ]}
      >
        <View style={styles.syncTopRow}>
          <View style={styles.syncStatusRow}>
            <Ionicons
              name={isOnline ? "cloud-done" : "cloud-offline"}
              size={22}
              color={isOnline ? "#059669" : "#d97706"}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.syncTitle}>
                {isOnline
                  ? "Terhubung ke Database Pusat"
                  : "Mode Offline (Penyimpanan Lokal)"}
              </Text>
              <Text style={styles.syncSub}>
                {isOnline
                  ? `Sinkron otomatis aktif • Terakhir: ${
                      lastSyncTime || "Baru saja"
                    }`
                  : "Tanpa internet/sinyal lemah — data disimpan di perangkat & otomatis diunggah saat online"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.syncBottomRow}>
          <View style={styles.queueBadge}>
            <Ionicons
              name={pendingCount > 0 ? "time-outline" : "checkmark-circle"}
              size={15}
              color={pendingCount > 0 ? "#b45309" : "#047857"}
            />
            <Text
              style={[
                styles.queueBadgeText,
                { color: pendingCount > 0 ? "#b45309" : "#047857" },
              ]}
            >
              {pendingCount > 0
                ? `${pendingCount} data lokal menunggu upload`
                : "Semua data lokal telah tersinkron"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.syncBtn}
            onPress={() => triggerSync(false)}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="sync" size={14} color="#ffffff" />
                <Text style={styles.syncBtnText}>Sinkronkan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* KPI Grid (2x2) */}
      <View style={styles.kpiGrid}>
        <TouchableOpacity
          style={styles.kpiCard}
          onPress={() => onNavigateTab("anak-yatim")}
        >
          <View style={[styles.kpiIconBox, { backgroundColor: "#f3e8ff" }]}>
            <Ionicons name="school" size={20} color="#5E2276" />
          </View>
          <Text style={styles.kpiValue}>{activeOrphans.length}</Text>
          <Text style={styles.kpiLabel}>Anak Yatim Binaan</Text>
          <Text style={styles.kpiMeta}>
            {verifiedCount} Terverifikasi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.kpiCard}
          onPress={() => onNavigateTab("av")}
        >
          <View style={[styles.kpiIconBox, { backgroundColor: "#ecfdf5" }]}>
            <Ionicons name="people" size={20} color="#059669" />
          </View>
          <Text style={styles.kpiValue}>{activeAvs.length}</Text>
          <Text style={styles.kpiLabel}>Koordinator AV</Text>
          <Text style={styles.kpiMeta}>
            {activeAvs.filter((a) => a.status === "Aktif").length} Posko Aktif
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.kpiCard}
          onPress={() => onNavigateTab("wilayah")}
        >
          <View style={[styles.kpiIconBox, { backgroundColor: "#eff6ff" }]}>
            <Ionicons name="map" size={20} color="#2563eb" />
          </View>
          <Text style={styles.kpiValue}>{activeKampungs.length}</Text>
          <Text style={styles.kpiLabel}>Kampung Binaan</Text>
          <Text style={styles.kpiMeta}>
            Tersebar di {activeDistriks.length} Distrik
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.kpiCard}
          onPress={() => onNavigateTab("anak-yatim")}
        >
          <View style={[styles.kpiIconBox, { backgroundColor: "#fffbeb" }]}>
            <Ionicons name="clipboard" size={20} color="#d97706" />
          </View>
          <Text style={styles.kpiValue}>{actionableOrphans.length}</Text>
          <Text style={styles.kpiLabel}>Antrean Survei</Text>
          <Text style={styles.kpiMeta}>Perlu Verifikasi Lapangan</Text>
        </TouchableOpacity>
      </View>

      {/* Actionable Field Survey Queue */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Antrean Survei & Validasi Lapangan
            </Text>
            <Text style={styles.sectionSub}>
              Santri yang membutuhkan kunjungan/verifikasi petugas
            </Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateTab("anak-yatim")}>
            <Text style={styles.linkText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {actionableOrphans.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle" size={32} color="#10b981" />
            <Text style={styles.emptyText}>
              Seluruh data anak yatim sudah terverifikasi!
            </Text>
          </View>
        ) : (
          actionableOrphans.map((item) => (
            <View key={item.id} style={styles.surveyItem}>
              <View style={{ flex: 1 }}>
                <View style={styles.surveyTopRow}>
                  <Text style={styles.surveyId}>{item.id}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      item.statusVerifikasi === "Menunggu Survei"
                        ? styles.pillAmber
                        : styles.pillRose,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        item.statusVerifikasi === "Menunggu Survei"
                          ? { color: "#b45309" }
                          : { color: "#be123c" },
                      ]}
                    >
                      {item.statusVerifikasi}
                    </Text>
                  </View>
                </View>
                <Text style={styles.surveyName}>{item.namaLengkap}</Text>
                <Text style={styles.surveyMeta}>
                  {item.kampung || "-"} • {item.asalDaerah} (PJ:{" "}
                  {item.pjAvNama || "Belum ada"})
                </Text>
                <Text style={styles.surveyNeed}>
                  Kebutuhan: {item.kebutuhanMendesak}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.verifyBtn}
                onPress={() =>
                  updateOrphan(item.id, { statusVerifikasi: "Terverifikasi" })
                }
              >
                <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
                <Text style={styles.verifyBtnText}>Verifikasi</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Regional Distribution */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Sebaran Santri per Distrik
            </Text>
            <Text style={styles.sectionSub}>
              Rekapitulasi pendataan lapangan Papua Selatan
            </Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateTab("wilayah")}>
            <Text style={styles.linkText}>Data Wilayah</Text>
          </TouchableOpacity>
        </View>

        {regionalDistribution.map((reg) => {
          const pct =
            activeOrphans.length > 0
              ? Math.round((reg.count / activeOrphans.length) * 100)
              : 0;
          return (
            <View key={reg.distrik} style={styles.regionRow}>
              <View style={styles.regionTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.regionName}>{reg.distrik}</Text>
                  <Text style={styles.regionMeta}>
                    {reg.kabupaten} • {reg.kampungs.size} Kampung •{" "}
                    {reg.avs.size} AV
                  </Text>
                </View>
                <View style={styles.regionCountBadge}>
                  <Text style={styles.regionCountText}>
                    {reg.count} Anak ({pct}%)
                  </Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(pct, 6)}%` },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FB",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  syncCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  syncCardOnline: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  syncCardOffline: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  syncTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  syncStatusRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  syncTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1c1917",
  },
  syncSub: {
    fontSize: 11,
    color: "#57534e",
    marginTop: 2,
    lineHeight: 15,
  },
  syncBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  queueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  queueBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#5E2276",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  syncBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpiCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1c1917",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#44403c",
    marginTop: 2,
  },
  kpiMeta: {
    fontSize: 11,
    color: "#78716c",
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1c1917",
  },
  sectionSub: {
    fontSize: 11,
    color: "#78716c",
    marginTop: 2,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5E2276",
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 6,
  },
  emptyText: {
    fontSize: 12,
    color: "#57534e",
    fontWeight: "600",
  },
  surveyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    gap: 10,
  },
  surveyTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  surveyId: {
    fontSize: 10,
    fontWeight: "700",
    color: "#78716c",
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pillAmber: {
    backgroundColor: "#fef3c7",
  },
  pillRose: {
    backgroundColor: "#ffe4e6",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  surveyName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1c1917",
  },
  surveyMeta: {
    fontSize: 11,
    color: "#57534e",
    marginTop: 2,
  },
  surveyNeed: {
    fontSize: 11,
    color: "#5E2276",
    fontWeight: "600",
    marginTop: 3,
  },
  verifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#059669",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  verifyBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  regionRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
    gap: 6,
  },
  regionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  regionName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1c1917",
  },
  regionMeta: {
    fontSize: 11,
    color: "#78716c",
    marginTop: 1,
  },
  regionCountBadge: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  regionCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5E2276",
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#f5f5f4",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#5E2276",
  },
});

