import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
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
import { AVRecord } from "../types/admin";

export const AVScreen: React.FC = () => {
  const {
    orphans,
    avs,
    distriks,
    kampungs,
    isSyncing,
    triggerSync,
    addAV,
    updateAV,
    softDeleteAV,
    restoreAV,
    deleteAVPermanently,
    addKampung,
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewTrash, setViewTrash] = useState(false);

  const [selectedAV, setSelectedAV] = useState<AVRecord | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAV, setEditingAV] = useState<AVRecord | null>(null);

  // Form fields
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [distrik, setDistrik] = useState("Distrik Merauke");
  const [kabupaten, setKabupaten] = useState("Kab. Merauke");
  const [kampung, setKampung] = useState("Kampung Wasur");
  const [customKampung, setCustomKampung] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatanWilayah, setCatatanWilayah] = useState("");
  const [status, setStatus] = useState<
    "Aktif" | "Non-aktif" | "Menunggu Verifikasi"
  >("Aktif");

  const activeOrphans = useMemo(
    () => orphans.filter((o) => !o.isDeleted),
    [orphans]
  );
  const activeAvs = useMemo(() => avs.filter((a) => !a.isDeleted), [avs]);
  const deletedAvs = useMemo(() => avs.filter((a) => !!a.isDeleted), [avs]);
  const activeDistriks = useMemo(
    () => distriks.filter((d) => !d.isDeleted),
    [distriks]
  );
  const activeKampungs = useMemo(
    () => kampungs.filter((k) => !k.isDeleted),
    [kampungs]
  );

  const getSupervisedOrphans = (av: AVRecord) => {
    return activeOrphans
      .filter(
        (o) =>
          o.pjAvId === av.id ||
          (o.pjAvNama && o.pjAvNama.toLowerCase() === av.nama.toLowerCase())
      )
      .map((o) => o.namaLengkap);
  };

  const totalSupervisedCount = useMemo(() => {
    return activeOrphans.filter((o) =>
      activeAvs.some(
        (av) =>
          av.id === o.pjAvId ||
          (o.pjAvNama && o.pjAvNama.toLowerCase() === av.nama.toLowerCase())
      )
    ).length;
  }, [activeOrphans, activeAvs]);

  const filteredList = useMemo(() => {
    const base = viewTrash ? deletedAvs : activeAvs;
    return base.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        a.nama.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.kampung.toLowerCase().includes(q) ||
        a.distrik.toLowerCase().includes(q) ||
        a.noHp.includes(q);

      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [viewTrash, deletedAvs, activeAvs, searchQuery, filterStatus]);

  const openAddModal = () => {
    setEditingAV(null);
    setNama("");
    setNoHp("");
    setDistrik(activeDistriks[0]?.nama || "Distrik Merauke");
    setKabupaten(activeDistriks[0]?.kabupaten || "Kab. Merauke");
    setKampung(activeKampungs[0]?.nama || "Kampung Wasur");
    setCustomKampung("");
    setAlamat("");
    setCatatanWilayah("");
    setStatus("Aktif");
    setIsFormVisible(true);
  };

  const openEditModal = (item: AVRecord) => {
    setEditingAV(item);
    setNama(item.nama);
    setNoHp(item.noHp);
    setDistrik(item.distrik);
    setKabupaten(item.kabupaten);
    setKampung(item.kampung);
    setCustomKampung("");
    setAlamat(item.alamat);
    setCatatanWilayah(item.catatanWilayah || "");
    setStatus(item.status);
    setIsFormVisible(true);
  };

  const handleSaveForm = async () => {
    if (!nama.trim()) {
      Alert.alert("Perhatian", "Nama koordinator AV wajib diisi.");
      return;
    }

    let finalKampung = kampung;
    if (customKampung.trim()) {
      finalKampung = customKampung.trim();
      await addKampung(finalKampung, distrik, kabupaten);
    }

    const payload = {
      nama: nama.trim(),
      noHp: noHp.trim() || "-",
      kampung: finalKampung,
      distrik,
      kabupaten,
      alamat: alamat.trim() || "-",
      catatanWilayah: catatanWilayah.trim() || undefined,
      status,
    };

    if (editingAV) {
      await updateAV(editingAV.id, payload);
    } else {
      await addAV(payload);
    }

    setIsFormVisible(false);
  };

  const handleOpenWhatsApp = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, "");
    if (!digits) return;
    const formatted = digits.startsWith("0")
      ? `62${digits.slice(1)}`
      : digits;
    Linking.openURL(`https://wa.me/${formatted}`).catch(() => {});
  };

  const kampungsForDistrik = useMemo(() => {
    const filtered = activeKampungs.filter(
      (k) => k.distrikNama.toLowerCase() === distrik.toLowerCase()
    );
    return filtered.length > 0 ? filtered : activeKampungs;
  }, [activeKampungs, distrik]);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topControls}>
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text style={styles.screenTitle} numberOfLines={1}>
              Koordinator Kampung (AV)
            </Text>
            <Text style={styles.screenSub} numberOfLines={1}>
              {activeAvs.length} Koordinator •{" "}
              {activeAvs.filter((a) => a.status === "Aktif").length} Aktif
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
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text style={styles.addBtnText}>Input AV</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Widgets (Only Non-Deleted Data) */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{activeAvs.length}</Text>
            <Text style={styles.summaryLabel} numberOfLines={1}>
              Total AV
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={[styles.summaryValue, { color: "#047857" }]}>
              {activeAvs.filter((a) => a.status === "Aktif").length}
            </Text>
            <Text style={styles.summaryLabel} numberOfLines={1}>
              Posko Aktif
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={[styles.summaryValue, { color: "#5E2276" }]}>
              {totalSupervisedCount}
            </Text>
            <Text style={styles.summaryLabel} numberOfLines={1}>
              Santri Dampingan
            </Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#78716c" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari nama AV, ID, kampung, distrik, No HP..."
            placeholderTextColor="#a8a29e"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#a8a29e" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { key: "all", label: "Semua Status" },
            { key: "Aktif", label: "Aktif" },
            { key: "Menunggu Verifikasi", label: "Menunggu Verifikasi" },
            { key: "Non-aktif", label: "Non-aktif" },
          ].map((f) => {
            const active = filterStatus === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilterStatus(f.key)}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* AV List */}
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
        {filteredList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={40} color="#a8a29e" />
            <Text style={styles.emptyTitle}>
              {viewTrash
                ? "Tempat sampah kosong"
                : "Tidak ada koordinator AV yang sesuai"}
            </Text>
          </View>
        ) : (
          filteredList.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.idBadge}>{item.id}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const next: AVRecord["status"] =
                      item.status === "Aktif"
                        ? "Non-aktif"
                        : item.status === "Non-aktif"
                        ? "Menunggu Verifikasi"
                        : "Aktif";
                    updateAV(item.id, { status: next });
                  }}
                  style={[
                    styles.statusPill,
                    item.status === "Aktif"
                      ? styles.statusGreen
                      : item.status === "Menunggu Verifikasi"
                      ? styles.statusAmber
                      : styles.statusStone,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "Aktif"
                        ? { color: "#047857" }
                        : item.status === "Menunggu Verifikasi"
                        ? { color: "#b45309" }
                        : { color: "#57534e" },
                    ]}
                  >
                    {item.status}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.nameText}>{item.nama}</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color="#5E2276" />
                  <Text style={styles.infoText}>
                    {item.kampung} • {item.distrik} ({item.kabupaten})
                  </Text>
                </View>

                <View style={styles.infoRowCenter}>
                  <Ionicons name="call-outline" size={14} color="#059669" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {item.noHp}
                  </Text>
                  <TouchableOpacity
                    style={styles.waBtn}
                    onPress={() => handleOpenWhatsApp(item.noHp)}
                  >
                    <Ionicons name="logo-whatsapp" size={13} color="#047857" />
                    <Text style={styles.waBtnText}>Chat WA</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="school-outline" size={14} color="#2563eb" />
                  <Text style={styles.infoText}>
                    {getSupervisedOrphans(item).length > 0
                      ? `${
                          getSupervisedOrphans(item).length
                        } Anak Dampingan: ${getSupervisedOrphans(item).join(", ")}`
                      : "Belum ada anak dampingan terdaftar"}
                  </Text>
                </View>

                {item.catatanWilayah ? (
                  <Text style={styles.noteText}>{item.catatanWilayah}</Text>
                ) : null}
              </View>

              <View style={styles.cardFooter}>
                {!viewTrash ? (
                  <>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => setSelectedAV(item)}
                    >
                      <Ionicons name="eye-outline" size={14} color="#57534e" />
                      <Text style={styles.actionBtnText}>Detail</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnPurple]}
                      onPress={() => openEditModal(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={14}
                        color="#5E2276"
                      />
                      <Text style={[styles.actionBtnText, { color: "#5E2276" }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnRed]}
                      onPress={() => softDeleteAV(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color="#dc2626"
                      />
                      <Text style={[styles.actionBtnText, { color: "#dc2626" }]}>
                        Hapus
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnGreen]}
                      onPress={() => restoreAV(item.id)}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={14}
                        color="#059669"
                      />
                      <Text style={[styles.actionBtnText, { color: "#059669" }]}>
                        Pulihkan
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnRed]}
                      onPress={() => deleteAVPermanently(item.id)}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={14}
                        color="#dc2626"
                      />
                      <Text style={[styles.actionBtnText, { color: "#dc2626" }]}>
                        Hapus Permanen
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={!!selectedAV}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedAV(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            {selectedAV && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleCol}>
                    <Text style={styles.modalId}>{selectedAV.id}</Text>
                    <Text style={styles.modalTitle}>{selectedAV.nama}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedAV(null)}>
                    <Ionicons name="close" size={24} color="#57534e" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 380 }}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Kampung & Distrik</Text>
                    <Text style={styles.detailValue}>
                      {selectedAV.kampung} • {selectedAV.distrik} (
                      {selectedAV.kabupaten})
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Nomor HP / WhatsApp</Text>
                    <Text style={styles.detailValue}>{selectedAV.noHp}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Alamat Posko</Text>
                    <Text style={styles.detailValue}>{selectedAV.alamat}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Anak Yatim Dampingan ({getSupervisedOrphans(selectedAV).length})
                    </Text>
                    <Text style={styles.detailValue}>
                      {getSupervisedOrphans(selectedAV).length > 0
                        ? getSupervisedOrphans(selectedAV).join(", ")
                        : "Belum ada"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Catatan Wilayah</Text>
                    <Text style={styles.detailValue}>
                      {selectedAV.catatanWilayah || "-"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tanggal Bergabung</Text>
                    <Text style={styles.detailValue}>
                      {selectedAV.tanggalBergabung}
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      const target = selectedAV;
                      setSelectedAV(null);
                      openEditModal(target);
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>Edit AV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => setSelectedAV(null)}
                  >
                    <Text style={styles.primaryBtnText}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add / Edit Modal */}
      <Modal
        visible={isFormVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFormVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { flex: 1 }]}>
                {editingAV
                  ? `Edit Koordinator ${editingAV.id}`
                  : "Input Koordinator Kampung (AV)"}
              </Text>
              <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                <Ionicons name="close" size={24} color="#57534e" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: 430 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.formLabel}>Nama Lengkap Koordinator AV *</Text>
              <TextInput
                style={styles.formInput}
                value={nama}
                onChangeText={setNama}
                placeholder="Contoh: Yohanes Gebze"
              />

              <Text style={styles.formLabel}>Nomor HP / WhatsApp</Text>
              <TextInput
                style={styles.formInput}
                value={noHp}
                onChangeText={setNoHp}
                placeholder="0812-xxxx-xxxx"
                keyboardType="phone-pad"
              />

              <Text style={styles.formLabel}>Pilih Distrik</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPills}
              >
                {activeDistriks.map((d) => {
                  const selected = distrik === d.nama;
                  return (
                    <TouchableOpacity
                      key={d.id}
                      style={[
                        styles.selectPill,
                        selected && styles.selectPillActive,
                      ]}
                      onPress={() => {
                        setDistrik(d.nama);
                        setKabupaten(d.kabupaten);
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

              <Text style={styles.formLabel}>Pilih Kampung</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPills}
              >
                {kampungsForDistrik.map((k) => {
                  const selected = kampung === k.nama && !customKampung;
                  return (
                    <TouchableOpacity
                      key={k.id}
                      style={[
                        styles.selectPill,
                        selected && styles.selectPillActive,
                      ]}
                      onPress={() => {
                        setKampung(k.nama);
                        setCustomKampung("");
                      }}
                    >
                      <Text
                        style={[
                          styles.selectPillText,
                          selected && styles.selectPillTextActive,
                        ]}
                      >
                        {k.nama}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TextInput
                style={[styles.formInput, { marginTop: 6 }]}
                value={customKampung}
                onChangeText={setCustomKampung}
                placeholder="Atau ketik nama kampung baru..."
              />

              <Text style={styles.formLabel}>Alamat Posko / Domisili</Text>
              <TextInput
                style={styles.formInput}
                value={alamat}
                onChangeText={setAlamat}
                placeholder="Jl. Poros Trans Irian, RT 02 / RW 01"
              />

              <Text style={styles.formLabel}>Catatan Wilayah Tugas</Text>
              <TextInput
                style={styles.formInput}
                value={catatanWilayah}
                onChangeText={setCatatanWilayah}
                placeholder="Koordinator pendampingan santri..."
              />

              <Text style={styles.formLabel}>Status Keaktifan</Text>
              <View style={styles.selectorRowWrap}>
                {(
                  ["Aktif", "Menunggu Verifikasi", "Non-aktif"] as const
                ).map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.selectorBtnWrap,
                      status === st && styles.selectorBtnActive,
                    ]}
                    onPress={() => setStatus(st)}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        status === st && styles.selectorTextActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setIsFormVisible(false)}
              >
                <Text style={styles.secondaryBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSaveForm}
              >
                <Text style={styles.primaryBtnText}>
                  {editingAV ? "Simpan Perubahan" : "Simpan Data"}
                </Text>
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
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  screenTitle: {
    fontSize: 16,
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
    gap: 6,
    flexShrink: 0,
  },
  trashToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
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
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#1c1917",
  },
  filterRow: {
    gap: 6,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#f5f5f4",
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  chipActive: {
    backgroundColor: "#5E2276",
    borderColor: "#5E2276",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#57534e",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 14,
    paddingBottom: 28,
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
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  idBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#5E2276",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
  },
  statusGreen: {
    backgroundColor: "#d1fae5",
  },
  statusAmber: {
    backgroundColor: "#fef3c7",
  },
  statusStone: {
    backgroundColor: "#f5f5f4",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  nameText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1c1917",
  },
  infoGrid: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  infoRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#44403c",
    flex: 1,
    lineHeight: 16,
  },
  waBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    flexShrink: 0,
  },
  waBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#047857",
  },
  noteText: {
    fontSize: 11,
    color: "#78716c",
    fontStyle: "italic",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f4",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 9,
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  actionBtnPurple: {
    backgroundColor: "#faf5ff",
    borderColor: "#e9d5ff",
  },
  actionBtnRed: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  actionBtnGreen: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  actionBtnText: {
    fontSize: 11,
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
    padding: 18,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  modalTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  modalId: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5E2276",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1c1917",
  },
  detailRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
  },
  detailLabel: {
    fontSize: 11,
    color: "#78716c",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 13,
    color: "#1c1917",
    fontWeight: "700",
    marginTop: 2,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#44403c",
    marginTop: 10,
    marginBottom: 5,
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
    paddingVertical: 2,
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
  selectorRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectorBtnWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d6d3d1",
    alignItems: "center",
    backgroundColor: "#fafaf9",
  },
  selectorBtnActive: {
    backgroundColor: "#5E2276",
    borderColor: "#5E2276",
  },
  selectorText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#57534e",
  },
  selectorTextActive: {
    color: "#ffffff",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#f5f5f4",
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#57534e",
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#5E2276",
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#FAF8FB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e5e4",
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1c1917",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#78716c",
    marginTop: 1,
  },
});
