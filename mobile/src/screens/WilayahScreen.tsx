import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import { DistrikRecord, KampungRecord } from "../types/admin";

export const WilayahScreen: React.FC = () => {
  const {
    distriks,
    kampungs,
    orphans,
    avs,
    isSyncing,
    triggerSync,
    addDistrik,
    updateDistrik,
    softDeleteDistrik,
    restoreDistrik,
    deleteDistrikPermanently,
    addKampung,
    updateKampung,
    softDeleteKampung,
    restoreKampung,
    deleteKampungPermanently,
  } = useData();

  const [activeTab, setActiveTab] = useState<"kampung" | "distrik">("kampung");
  const [viewTrash, setViewTrash] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Kampung Form Modal
  const [isKampungModalOpen, setIsKampungModalOpen] = useState(false);
  const [editingKampung, setEditingKampung] = useState<KampungRecord | null>(
    null
  );
  const [kNama, setKNama] = useState("");
  const [kDistrik, setKDistrik] = useState("Distrik Merauke");
  const [kKabupaten, setKKabupaten] = useState("Kab. Merauke");
  const [kCatatan, setKCatatan] = useState("");

  // Distrik Form Modal
  const [isDistrikModalOpen, setIsDistrikModalOpen] = useState(false);
  const [editingDistrik, setEditingDistrik] = useState<DistrikRecord | null>(
    null
  );
  const [dNama, setDNama] = useState("");
  const [dKabupaten, setDKabupaten] = useState("Kab. Merauke");

  const activeDistriks = useMemo(
    () => distriks.filter((d) => !d.isDeleted),
    [distriks]
  );
  const deletedDistriks = useMemo(
    () => distriks.filter((d) => !!d.isDeleted),
    [distriks]
  );
  const activeKampungs = useMemo(
    () => kampungs.filter((k) => !k.isDeleted),
    [kampungs]
  );
  const deletedKampungs = useMemo(
    () => kampungs.filter((k) => !!k.isDeleted),
    [kampungs]
  );

  const activeOrphans = useMemo(
    () => orphans.filter((o) => !o.isDeleted),
    [orphans]
  );
  const activeAvs = useMemo(() => avs.filter((a) => !a.isDeleted), [avs]);

  const filteredKampungs = useMemo(() => {
    const base = viewTrash ? deletedKampungs : activeKampungs;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (k) =>
        !q ||
        k.nama.toLowerCase().includes(q) ||
        k.distrikNama.toLowerCase().includes(q) ||
        k.kabupaten.toLowerCase().includes(q) ||
        (k.catatan && k.catatan.toLowerCase().includes(q))
    );
  }, [viewTrash, deletedKampungs, activeKampungs, searchQuery]);

  const filteredDistriks = useMemo(() => {
    const base = viewTrash ? deletedDistriks : activeDistriks;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (d) =>
        !q ||
        d.nama.toLowerCase().includes(q) ||
        d.kabupaten.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
    );
  }, [viewTrash, deletedDistriks, activeDistriks, searchQuery]);

  const openAddKampungModal = () => {
    setEditingKampung(null);
    setKNama("");
    setKDistrik(activeDistriks[0]?.nama || "Distrik Merauke");
    setKKabupaten(activeDistriks[0]?.kabupaten || "Kab. Merauke");
    setKCatatan("");
    setIsKampungModalOpen(true);
  };

  const openEditKampungModal = (k: KampungRecord) => {
    setEditingKampung(k);
    setKNama(k.nama);
    setKDistrik(k.distrikNama);
    setKKabupaten(k.kabupaten);
    setKCatatan(k.catatan || "");
    setIsKampungModalOpen(true);
  };

  const handleSaveKampung = async () => {
    if (!kNama.trim()) {
      Alert.alert("Perhatian", "Nama kampung wajib diisi.");
      return;
    }

    if (editingKampung) {
      await updateKampung(editingKampung.id, {
        nama: kNama.trim(),
        distrikNama: kDistrik,
        kabupaten: kKabupaten,
        catatan: kCatatan.trim() || undefined,
      });
    } else {
      const res = await addKampung(
        kNama,
        kDistrik,
        kKabupaten,
        kCatatan || undefined
      );
      if (!res.success) {
        Alert.alert("Gagal", res.message || "Gagal menambahkan kampung.");
        return;
      }
    }

    setIsKampungModalOpen(false);
  };

  const openAddDistrikModal = () => {
    setEditingDistrik(null);
    setDNama("");
    setDKabupaten("Kab. Merauke");
    setIsDistrikModalOpen(true);
  };

  const openEditDistrikModal = (d: DistrikRecord) => {
    setEditingDistrik(d);
    setDNama(d.nama);
    setDKabupaten(d.kabupaten);
    setIsDistrikModalOpen(true);
  };

  const handleSaveDistrik = async () => {
    if (!dNama.trim()) {
      Alert.alert("Perhatian", "Nama distrik wajib diisi.");
      return;
    }

    if (editingDistrik) {
      const res = await updateDistrik(editingDistrik.id, {
        nama: dNama.trim(),
        kabupaten: dKabupaten.trim() || "Kab. Merauke",
      });
      if (!res.success) {
        Alert.alert("Gagal", res.message || "Gagal memperbarui distrik.");
        return;
      }
    } else {
      const res = await addDistrik(dNama, dKabupaten);
      if (!res.success) {
        Alert.alert("Gagal", res.message || "Gagal menambahkan distrik.");
        return;
      }
    }

    setIsDistrikModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topControls}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Master Data Wilayah</Text>
            <Text style={styles.screenSub}>
              {activeKampungs.length} Kampung • {activeDistriks.length} Distrik
            </Text>
          </View>

          <View style={styles.headerBtns}>
            <TouchableOpacity
              style={[
                styles.trashToggleBtn,
                viewTrash && styles.trashToggleActive,
              ]}
              onPress={() => setViewTrash(!viewTrash)}
            >
              <Ionicons
                name="trash-outline"
                size={15}
                color={viewTrash ? "#be123c" : "#57534e"}
              />
              <Text
                style={[
                  styles.trashToggleText,
                  viewTrash && { color: "#be123c" },
                ]}
              >
                Sampah (
                {activeTab === "kampung"
                  ? deletedKampungs.length
                  : deletedDistriks.length}
                )
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={
                activeTab === "kampung"
                  ? openAddKampungModal
                  : openAddDistrikModal
              }
            >
              <Ionicons name="add" size={18} color="#ffffff" />
              <Text style={styles.addBtnText}>
                {activeTab === "kampung" ? "+ Kampung" : "+ Distrik"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Segmented Tab */}
        <View style={styles.segmentBox}>
          <TouchableOpacity
            style={[
              styles.segmentTab,
              activeTab === "kampung" && styles.segmentTabActive,
            ]}
            onPress={() => setActiveTab("kampung")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "kampung" && styles.segmentTextActive,
              ]}
            >
              Kampung Binaan ({activeKampungs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentTab,
              activeTab === "distrik" && styles.segmentTabActive,
            ]}
            onPress={() => setActiveTab("distrik")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "distrik" && styles.segmentTextActive,
              ]}
            >
              Master Distrik ({activeDistriks.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#78716c" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              activeTab === "kampung"
                ? "Cari nama kampung, distrik, atau catatan..."
                : "Cari nama distrik atau kabupaten..."
            }
            placeholderTextColor="#a8a29e"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#a8a29e" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={() => triggerSync(false)}
            colors={["#5E2276"]}
          />
        }
      >
        {activeTab === "kampung" ? (
          filteredKampungs.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="map-outline" size={40} color="#a8a29e" />
              <Text style={styles.emptyTitle}>
                Tidak ada data kampung ditemukan
              </Text>
            </View>
          ) : (
            filteredKampungs.map((k) => {
              const orphanCount = activeOrphans.filter(
                (o) =>
                  o.kampung && o.kampung.toLowerCase() === k.nama.toLowerCase()
              ).length;
              const avCount = activeAvs.filter(
                (a) => a.kampung.toLowerCase() === k.nama.toLowerCase()
              ).length;

              return (
                <View key={k.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.idBadge}>{k.id}</Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.statChipPurple}>
                        <Text style={styles.statChipPurpleText}>
                          {orphanCount} Anak
                        </Text>
                      </View>
                      <View style={styles.statChipGreen}>
                        <Text style={styles.statChipGreenText}>
                          {avCount} AV
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.nameText}>{k.nama}</Text>
                  <Text style={styles.subText}>
                    {k.distrikNama} • {k.kabupaten}
                  </Text>
                  {k.catatan ? (
                    <Text style={styles.noteText}>{k.catatan}</Text>
                  ) : null}

                  <View style={styles.cardFooter}>
                    {!viewTrash ? (
                      <>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => openEditKampungModal(k)}
                        >
                          <Ionicons
                            name="create-outline"
                            size={15}
                            color="#5E2276"
                          />
                          <Text
                            style={[styles.actionBtnText, { color: "#5E2276" }]}
                          >
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => softDeleteKampung(k.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={15}
                            color="#dc2626"
                          />
                          <Text
                            style={[styles.actionBtnText, { color: "#dc2626" }]}
                          >
                            Hapus
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => restoreKampung(k.id)}
                        >
                          <Ionicons
                            name="refresh-outline"
                            size={15}
                            color="#059669"
                          />
                          <Text
                            style={[styles.actionBtnText, { color: "#059669" }]}
                          >
                            Pulihkan
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => deleteKampungPermanently(k.id)}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={15}
                            color="#dc2626"
                          />
                          <Text
                            style={[styles.actionBtnText, { color: "#dc2626" }]}
                          >
                            Hapus Permanen
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            })
          )
        ) : filteredDistriks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="business-outline" size={40} color="#a8a29e" />
            <Text style={styles.emptyTitle}>
              Tidak ada data distrik ditemukan
            </Text>
          </View>
        ) : (
          filteredDistriks.map((d) => {
            const kCount = activeKampungs.filter(
              (k) =>
                k.distrikId === d.id ||
                k.distrikNama.toLowerCase() === d.nama.toLowerCase()
            ).length;
            const oCount = activeOrphans.filter(
              (o) => o.asalDaerah.toLowerCase() === d.nama.toLowerCase()
            ).length;

            return (
              <View key={d.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.idBadge}>{d.id}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.statChipGreen}>
                      <Text style={styles.statChipGreenText}>
                        {kCount} Kampung
                      </Text>
                    </View>
                    <View style={styles.statChipPurple}>
                      <Text style={styles.statChipPurpleText}>
                        {oCount} Santri
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.nameText}>{d.nama}</Text>
                <Text style={styles.subText}>{d.kabupaten}</Text>

                <View style={styles.cardFooter}>
                  {!viewTrash ? (
                    <>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => openEditDistrikModal(d)}
                      >
                        <Ionicons
                          name="create-outline"
                          size={15}
                          color="#5E2276"
                        />
                        <Text
                          style={[styles.actionBtnText, { color: "#5E2276" }]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={async () => {
                          const res = await softDeleteDistrik(d.id);
                          if (!res.success && res.message) {
                            Alert.alert("Tidak Dapat Dihapus", res.message);
                          }
                        }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={15}
                          color="#dc2626"
                        />
                        <Text
                          style={[styles.actionBtnText, { color: "#dc2626" }]}
                        >
                          Hapus
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => restoreDistrik(d.id)}
                      >
                        <Ionicons
                          name="refresh-outline"
                          size={15}
                          color="#059669"
                        />
                        <Text
                          style={[styles.actionBtnText, { color: "#059669" }]}
                        >
                          Pulihkan
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={async () => {
                          const res = await deleteDistrikPermanently(d.id);
                          if (!res.success && res.message) {
                            Alert.alert("Tidak Dapat Dihapus", res.message);
                          }
                        }}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={15}
                          color="#dc2626"
                        />
                        <Text
                          style={[styles.actionBtnText, { color: "#dc2626" }]}
                        >
                          Hapus Permanen
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Kampung Add/Edit Modal */}
      <Modal
        visible={isKampungModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsKampungModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingKampung ? "Edit Data Kampung" : "Tambah Kampung Binaan"}
              </Text>
              <TouchableOpacity onPress={() => setIsKampungModalOpen(false)}>
                <Ionicons name="close" size={24} color="#57534e" />
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Nama Kampung / Kelurahan *</Text>
            <TextInput
              style={styles.formInput}
              value={kNama}
              onChangeText={setKNama}
              placeholder="Contoh: Kampung Wasur"
            />

            <Text style={styles.formLabel}>Pilih Distrik Induk</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalPills}
            >
              {activeDistriks.map((d) => {
                const selected = kDistrik === d.nama;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.selectPill,
                      selected && styles.selectPillActive,
                    ]}
                    onPress={() => {
                      setKDistrik(d.nama);
                      setKKabupaten(d.kabupaten);
                    }}
                  >
                    <Text
                      style={[
                        styles.selectPillText,
                        selected && styles.selectPillTextActive,
                      ]}
                    >
                      {d.nama}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.formLabel}>Kabupaten</Text>
            <TextInput
              style={styles.formInput}
              value={kKabupaten}
              onChangeText={setKKabupaten}
              placeholder="Kab. Merauke"
            />

            <Text style={styles.formLabel}>Catatan / Karakteristik Wilayah</Text>
            <TextInput
              style={styles.formInput}
              value={kCatatan}
              onChangeText={setKCatatan}
              placeholder="Posko binaan anak yatim..."
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setIsKampungModalOpen(false)}
              >
                <Text style={styles.secondaryBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSaveKampung}
              >
                <Text style={styles.primaryBtnText}>Simpan Kampung</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Distrik Add/Edit Modal */}
      <Modal
        visible={isDistrikModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDistrikModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingDistrik ? "Edit Master Distrik" : "Tambah Distrik Baru"}
              </Text>
              <TouchableOpacity onPress={() => setIsDistrikModalOpen(false)}>
                <Ionicons name="close" size={24} color="#57534e" />
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Nama Distrik *</Text>
            <TextInput
              style={styles.formInput}
              value={dNama}
              onChangeText={setDNama}
              placeholder="Contoh: Distrik Merauke"
            />

            <Text style={styles.formLabel}>Kabupaten (Papua Selatan)</Text>
            <View style={styles.selectorRow}>
              {[
                "Kab. Merauke",
                "Kab. Boven Digoel",
                "Kab. Mappi",
                "Kab. Asmat",
              ].map((kab) => (
                <TouchableOpacity
                  key={kab}
                  style={[
                    styles.selectPill,
                    dKabupaten === kab && styles.selectPillActive,
                  ]}
                  onPress={() => setDKabupaten(kab)}
                >
                  <Text
                    style={[
                      styles.selectPillText,
                      dKabupaten === kab && styles.selectPillTextActive,
                    ]}
                  >
                    {kab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setIsDistrikModalOpen(false)}
              >
                <Text style={styles.secondaryBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSaveDistrik}
              >
                <Text style={styles.primaryBtnText}>Simpan Distrik</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8FB",
  },
  topControls: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1c1917",
  },
  screenSub: {
    fontSize: 11,
    color: "#78716c",
    marginTop: 1,
  },
  headerBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trashToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#f5f5f4",
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  trashToggleActive: {
    backgroundColor: "#ffe4e6",
    borderColor: "#fecdd3",
  },
  trashToggleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#57534e",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#5E2276",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  segmentBox: {
    flexDirection: "row",
    backgroundColor: "#f5f5f4",
    borderRadius: 12,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentTabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#78716c",
  },
  segmentTextActive: {
    color: "#5E2276",
    fontWeight: "800",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1c1917",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 13,
    color: "#78716c",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    gap: 6,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#5E2276",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
  },
  statChipPurple: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statChipPurpleText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#5E2276",
  },
  statChipGreen: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statChipGreenText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#047857",
  },
  nameText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1c1917",
  },
  subText: {
    fontSize: 12,
    color: "#57534e",
    fontWeight: "600",
  },
  noteText: {
    fontSize: 11,
    color: "#78716c",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f4",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#57534e",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(28, 25, 23, 0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 10,
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
  formLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#44403c",
    marginTop: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    color: "#1c1917",
    backgroundColor: "#fafaf9",
  },
  horizontalPills: {
    gap: 6,
    paddingVertical: 4,
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingVertical: 4,
  },
  selectPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d6d3d1",
    backgroundColor: "#fafaf9",
  },
  selectPillActive: {
    backgroundColor: "#f3e8ff",
    borderColor: "#5E2276",
  },
  selectPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#57534e",
  },
  selectPillTextActive: {
    color: "#5E2276",
    fontWeight: "700",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 12,
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f4",
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#57534e",
  },
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#5E2276",
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
});

