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
import { OrphanRecord } from "../types/admin";

export const OrphansScreen: React.FC = () => {
  const {
    orphans,
    avs,
    distriks,
    kampungs,
    isSyncing,
    triggerSync,
    addOrphan,
    updateOrphan,
    softDeleteOrphan,
    restoreOrphan,
    deleteOrphanPermanently,
    addKampung,
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerif, setFilterVerif] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewTrash, setViewTrash] = useState(false);

  const [selectedOrphan, setSelectedOrphan] = useState<OrphanRecord | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOrphan, setEditingOrphan] = useState<OrphanRecord | null>(null);

  // Form state
  const [namaLengkap, setNamaLengkap] = useState("");
  const [namaPanggilan, setNamaPanggilan] = useState("");
  const [gender, setGender] = useState<"L" | "P">("L");
  const [usia, setUsia] = useState("10");
  const [status, setStatus] = useState<"Yatim" | "Piatu" | "Yatim Piatu">(
    "Yatim"
  );
  const [asalDaerah, setAsalDaerah] = useState("Distrik Merauke");
  const [kabupaten, setKabupaten] = useState("Kab. Merauke");
  const [kampung, setKampung] = useState("Kampung Wasur");
  const [customKampung, setCustomKampung] = useState("");
  const [pjAvNama, setPjAvNama] = useState("Yohanes Gebze");
  const [tempatTinggal, setTempatTinggal] = useState("Asrama SFY Merauke");
  const [wali, setWali] = useState("");
  const [jenjangPendidikan, setJenjangPendidikan] = useState("SD Kelas 4");
  const [kebutuhanMendesak, setKebutuhanMendesak] = useState(
    "Seragam & Buku Pelajaran"
  );
  const [statusVerifikasi, setStatusVerifikasi] = useState<
    "Terverifikasi" | "Menunggu Survei" | "Perlu Pembaruan"
  >("Menunggu Survei");

  const activeOrphans = useMemo(
    () => orphans.filter((o) => !o.isDeleted),
    [orphans]
  );
  const deletedOrphans = useMemo(
    () => orphans.filter((o) => !!o.isDeleted),
    [orphans]
  );
  const activeDistriks = useMemo(
    () => distriks.filter((d) => !d.isDeleted),
    [distriks]
  );
  const activeKampungs = useMemo(
    () => kampungs.filter((k) => !k.isDeleted),
    [kampungs]
  );
  const activeAvs = useMemo(() => avs.filter((a) => !a.isDeleted), [avs]);

  const filteredList = useMemo(() => {
    const base = viewTrash ? deletedOrphans : activeOrphans;
    return base.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        o.namaLengkap.toLowerCase().includes(q) ||
        o.namaPanggilan.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        (o.kampung && o.kampung.toLowerCase().includes(q)) ||
        o.asalDaerah.toLowerCase().includes(q) ||
        (o.pjAvNama && o.pjAvNama.toLowerCase().includes(q));

      const matchVerif =
        filterVerif === "all" || o.statusVerifikasi === filterVerif;
      const matchStatus = filterStatus === "all" || o.status === filterStatus;

      return matchSearch && matchVerif && matchStatus;
    });
  }, [
    viewTrash,
    deletedOrphans,
    activeOrphans,
    searchQuery,
    filterVerif,
    filterStatus,
  ]);

  const openAddModal = () => {
    setEditingOrphan(null);
    setNamaLengkap("");
    setNamaPanggilan("");
    setGender("L");
    setUsia("10");
    setStatus("Yatim");
    setAsalDaerah(activeDistriks[0]?.nama || "Distrik Merauke");
    setKabupaten(activeDistriks[0]?.kabupaten || "Kab. Merauke");
    setKampung(activeKampungs[0]?.nama || "Kampung Wasur");
    setCustomKampung("");
    setPjAvNama(activeAvs[0]?.nama || "Yohanes Gebze");
    setTempatTinggal("Asrama SFY Merauke");
    setWali("");
    setJenjangPendidikan("SD Kelas 4");
    setKebutuhanMendesak("Seragam & Buku Pelajaran");
    setStatusVerifikasi("Menunggu Survei");
    setIsFormVisible(true);
  };

  const openEditModal = (item: OrphanRecord) => {
    setEditingOrphan(item);
    setNamaLengkap(item.namaLengkap);
    setNamaPanggilan(item.namaPanggilan);
    setGender(item.gender);
    setUsia(String(item.usia));
    setStatus(item.status);
    setAsalDaerah(item.asalDaerah);
    setKabupaten(item.kabupaten);
    setKampung(item.kampung || "Kampung Wasur");
    setCustomKampung("");
    setPjAvNama(item.pjAvNama || activeAvs[0]?.nama || "");
    setTempatTinggal(item.tempatTinggal);
    setWali(item.wali);
    setJenjangPendidikan(item.jenjangPendidikan);
    setKebutuhanMendesak(item.kebutuhanMendesak);
    setStatusVerifikasi(item.statusVerifikasi);
    setIsFormVisible(true);
  };

  const handleSaveForm = async () => {
    if (!namaLengkap.trim()) {
      Alert.alert("Perhatian", "Nama lengkap anak yatim wajib diisi.");
      return;
    }

    let finalKampung = kampung;
    if (customKampung.trim()) {
      finalKampung = customKampung.trim();
      await addKampung(finalKampung, asalDaerah, kabupaten);
    }

    const matchedAv = activeAvs.find(
      (a) => a.nama.toLowerCase() === pjAvNama.toLowerCase()
    );

    const payload = {
      namaLengkap: namaLengkap.trim(),
      namaPanggilan:
        namaPanggilan.trim() || namaLengkap.trim().split(" ")[0],
      gender,
      usia: parseInt(usia, 10) || 10,
      status,
      asalDaerah,
      kabupaten,
      kampung: finalKampung,
      pjAvId: matchedAv?.id,
      pjAvNama: pjAvNama.trim(),
      tempatTinggal: tempatTinggal.trim() || "Keluarga Asuh",
      wali: wali.trim() || "-",
      jenjangPendidikan: jenjangPendidikan.trim() || "SD",
      kebutuhanMendesak: kebutuhanMendesak.trim() || "Perlengkapan Sekolah",
      statusVerifikasi,
    };

    if (editingOrphan) {
      await updateOrphan(editingOrphan.id, payload);
    } else {
      await addOrphan(payload);
    }

    setIsFormVisible(false);
  };

  const handleCycleVerifikasi = (item: OrphanRecord) => {
    const next: OrphanRecord["statusVerifikasi"] =
      item.statusVerifikasi === "Terverifikasi"
        ? "Menunggu Survei"
        : item.statusVerifikasi === "Menunggu Survei"
        ? "Perlu Pembaruan"
        : "Terverifikasi";
    updateOrphan(item.id, { statusVerifikasi: next });
  };

  const kampungsForDistrik = useMemo(() => {
    const filtered = activeKampungs.filter(
      (k) => k.distrikNama.toLowerCase() === asalDaerah.toLowerCase()
    );
    return filtered.length > 0 ? filtered : activeKampungs;
  }, [activeKampungs, asalDaerah]);

  return (
    <View style={styles.container}>
      {/* Top Action & Search Bar */}
      <View style={styles.topControls}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Pendataan Anak Yatim</Text>
            <Text style={styles.screenSub}>
              {activeOrphans.length} Aktif • {deletedOrphans.length} Sampah
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
                {viewTrash
                  ? `Sampah (${deletedOrphans.length})`
                  : `Sampah (${deletedOrphans.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
              <Ionicons name="add" size={18} color="#ffffff" />
              <Text style={styles.addBtnText}>Input Anak</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#78716c" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari nama anak, ID, kampung, distrik, atau PJ AV..."
            placeholderTextColor="#a8a29e"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#a8a29e" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { key: "all", label: "Semua Verifikasi" },
            { key: "Terverifikasi", label: "Terverifikasi" },
            { key: "Menunggu Survei", label: "Menunggu Survei" },
            { key: "Perlu Pembaruan", label: "Perlu Pembaruan" },
          ].map((f) => {
            const active = filterVerif === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilterVerif(f.key)}
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { key: "all", label: "Semua Status" },
            { key: "Yatim", label: "Yatim" },
            { key: "Piatu", label: "Piatu" },
            { key: "Yatim Piatu", label: "Yatim Piatu" },
          ].map((s) => {
            const active = filterStatus === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.chipSmall, active && styles.chipSmallActive]}
                onPress={() => setFilterStatus(s.key)}
              >
                <Text
                  style={[
                    styles.chipSmallText,
                    active && styles.chipSmallTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orphans List */}
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
            <Ionicons name="school-outline" size={40} color="#a8a29e" />
            <Text style={styles.emptyTitle}>
              {viewTrash
                ? "Tempat sampah kosong"
                : "Tidak ada data anak yatim yang sesuai"}
            </Text>
          </View>
        ) : (
          filteredList.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.idRow}>
                  <Text style={styles.idBadge}>{item.id}</Text>
                  <View style={styles.statusTag}>
                    <Text style={styles.statusTagText}>{item.status}</Text>
                  </View>
                  <Text style={styles.ageText}>
                    {item.gender === "L" ? "Laki-laki" : "Perempuan"},{" "}
                    {item.usia} thn
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleCycleVerifikasi(item)}
                  style={[
                    styles.verifPill,
                    item.statusVerifikasi === "Terverifikasi"
                      ? styles.verifGreen
                      : item.statusVerifikasi === "Menunggu Survei"
                      ? styles.verifAmber
                      : styles.verifRose,
                  ]}
                >
                  <Text
                    style={[
                      styles.verifText,
                      item.statusVerifikasi === "Terverifikasi"
                        ? { color: "#047857" }
                        : item.statusVerifikasi === "Menunggu Survei"
                        ? { color: "#b45309" }
                        : { color: "#be123c" },
                    ]}
                  >
                    {item.statusVerifikasi}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.nameText}>{item.namaLengkap}</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color="#5E2276" />
                  <Text style={styles.infoText}>
                    {item.kampung || "-"} • {item.asalDaerah} ({item.kabupaten})
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={14} color="#059669" />
                  <Text style={styles.infoText}>
                    PJ AV: {item.pjAvNama || "Belum ditentukan"} • Wali:{" "}
                    {item.wali}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="book-outline" size={14} color="#2563eb" />
                  <Text style={styles.infoText}>{item.jenjangPendidikan}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="sparkles-outline" size={14} color="#d97706" />
                  <Text style={styles.needText}>
                    Kebutuhan: {item.kebutuhanMendesak}
                  </Text>
                </View>
              </View>

              {/* Card Footer Actions */}
              <View style={styles.cardFooter}>
                {!viewTrash ? (
                  <>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => setSelectedOrphan(item)}
                    >
                      <Ionicons name="eye-outline" size={15} color="#57534e" />
                      <Text style={styles.actionBtnText}>Detail</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditModal(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={15}
                        color="#5E2276"
                      />
                      <Text style={[styles.actionBtnText, { color: "#5E2276" }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => softDeleteOrphan(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
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
                      style={styles.actionBtn}
                      onPress={() => restoreOrphan(item.id)}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={15}
                        color="#059669"
                      />
                      <Text style={[styles.actionBtnText, { color: "#059669" }]}>
                        Pulihkan
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => deleteOrphanPermanently(item.id)}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={15}
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
        visible={!!selectedOrphan}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrphan(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            {selectedOrphan && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalId}>{selectedOrphan.id}</Text>
                    <Text style={styles.modalTitle}>
                      {selectedOrphan.namaLengkap}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOrphan(null)}>
                    <Ionicons name="close" size={24} color="#57534e" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ maxHeight: 420 }}>
                  <View style={styles.detailGrid}>
                    <DetailRow
                      label="Nama Panggilan"
                      value={selectedOrphan.namaPanggilan}
                    />
                    <DetailRow
                      label="Jenis Kelamin & Usia"
                      value={`${
                        selectedOrphan.gender === "L"
                          ? "Laki-laki"
                          : "Perempuan"
                      }, ${selectedOrphan.usia} Tahun`}
                    />
                    <DetailRow
                      label="Status"
                      value={selectedOrphan.status}
                    />
                    <DetailRow
                      label="Kampung & Distrik"
                      value={`${selectedOrphan.kampung || "-"} • ${
                        selectedOrphan.asalDaerah
                      } (${selectedOrphan.kabupaten})`}
                    />
                    <DetailRow
                      label="PJ Koordinator AV"
                      value={selectedOrphan.pjAvNama || "Belum ditentukan"}
                    />
                    <DetailRow
                      label="Tempat Tinggal"
                      value={selectedOrphan.tempatTinggal}
                    />
                    <DetailRow
                      label="Wali / Pengasuh"
                      value={selectedOrphan.wali}
                    />
                    <DetailRow
                      label="Jenjang Pendidikan"
                      value={selectedOrphan.jenjangPendidikan}
                    />
                    <DetailRow
                      label="Kebutuhan Mendesak"
                      value={selectedOrphan.kebutuhanMendesak}
                    />
                    <DetailRow
                      label="Status Verifikasi"
                      value={selectedOrphan.statusVerifikasi}
                    />
                    <DetailRow
                      label="Tanggal Pendataan"
                      value={selectedOrphan.tanggalMasuk}
                    />
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      const target = selectedOrphan;
                      setSelectedOrphan(null);
                      openEditModal(target);
                    }}
                  >
                    <Text style={styles.secondaryBtnText}>Edit Data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => setSelectedOrphan(null)}
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
              <Text style={styles.modalTitle}>
                {editingOrphan
                  ? `Edit Data ${editingOrphan.id}`
                  : "Input Pendataan Anak Yatim"}
              </Text>
              <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                <Ionicons name="close" size={24} color="#57534e" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ maxHeight: 460 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.formLabel}>Nama Lengkap Anak *</Text>
              <TextInput
                style={styles.formInput}
                value={namaLengkap}
                onChangeText={setNamaLengkap}
                placeholder="Contoh: Muhammad Fikri Gebze"
              />

              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Nama Panggilan</Text>
                  <TextInput
                    style={styles.formInput}
                    value={namaPanggilan}
                    onChangeText={setNamaPanggilan}
                    placeholder="Fikri"
                  />
                </View>
                <View style={{ width: 95 }}>
                  <Text style={styles.formLabel}>Usia (Thn)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={usia}
                    onChangeText={setUsia}
                    keyboardType="numeric"
                    placeholder="10"
                  />
                </View>
              </View>

              <Text style={styles.formLabel}>Jenis Kelamin</Text>
              <View style={styles.selectorRow}>
                {(["L", "P"] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.selectorBtn,
                      gender === g && styles.selectorBtnActive,
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        gender === g && styles.selectorTextActive,
                      ]}
                    >
                      {g === "L" ? "Laki-laki (L)" : "Perempuan (P)"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Status</Text>
              <View style={styles.selectorRow}>
                {(["Yatim", "Piatu", "Yatim Piatu"] as const).map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.selectorBtn,
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

              <Text style={styles.formLabel}>Pilih Distrik</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPills}
              >
                {activeDistriks.map((d) => {
                  const selected = asalDaerah === d.nama;
                  return (
                    <TouchableOpacity
                      key={d.id}
                      style={[
                        styles.selectPill,
                        selected && styles.selectPillActive,
                      ]}
                      onPress={() => {
                        setAsalDaerah(d.nama);
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
                placeholder="Atau ketik nama kampung baru jika belum ada..."
              />

              <Text style={styles.formLabel}>Penanggung Jawab AV</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPills}
              >
                {activeAvs.map((av) => {
                  const selected = pjAvNama === av.nama;
                  return (
                    <TouchableOpacity
                      key={av.id}
                      style={[
                        styles.selectPill,
                        selected && styles.selectPillActive,
                      ]}
                      onPress={() => setPjAvNama(av.nama)}
                    >
                      <Text
                        style={[
                          styles.selectPillText,
                          selected && styles.selectPillTextActive,
                        ]}
                      >
                        {av.nama} ({av.kampung})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.formLabel}>Tempat Tinggal</Text>
              <TextInput
                style={styles.formInput}
                value={tempatTinggal}
                onChangeText={setTempatTinggal}
                placeholder="Asrama SFY Merauke / Rumah Keluarga Asuh"
              />

              <Text style={styles.formLabel}>Nama Wali / Pengasuh</Text>
              <TextInput
                style={styles.formInput}
                value={wali}
                onChangeText={setWali}
                placeholder="Contoh: Fatima Mahuze (Bibi)"
              />

              <Text style={styles.formLabel}>Jenjang Pendidikan & Sekolah</Text>
              <TextInput
                style={styles.formInput}
                value={jenjangPendidikan}
                onChangeText={setJenjangPendidikan}
                placeholder="Contoh: SD Kelas 5 MI Al-Ma'arif Merauke"
              />

              <Text style={styles.formLabel}>Kebutuhan Mendesak</Text>
              <TextInput
                style={styles.formInput}
                value={kebutuhanMendesak}
                onChangeText={setKebutuhanMendesak}
                placeholder="Contoh: Sepatu Sekolah & Kitab Iqro"
              />

              <Text style={styles.formLabel}>Status Verifikasi Survei</Text>
              <View style={styles.selectorRow}>
                {(
                  [
                    "Terverifikasi",
                    "Menunggu Survei",
                    "Perlu Pembaruan",
                  ] as const
                ).map((sv) => (
                  <TouchableOpacity
                    key={sv}
                    style={[
                      styles.selectorBtn,
                      statusVerifikasi === sv && styles.selectorBtnActive,
                    ]}
                    onPress={() => setStatusVerifikasi(sv)}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        statusVerifikasi === sv && styles.selectorTextActive,
                      ]}
                    >
                      {sv}
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
                  {editingOrphan ? "Simpan Perubahan" : "Simpan Data Anak"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
  filterRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  chipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  chipSmallActive: {
    backgroundColor: "#f3e8ff",
    borderColor: "#d8b4fe",
  },
  chipSmallText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#78716c",
  },
  chipSmallTextActive: {
    color: "#5E2276",
    fontWeight: "700",
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
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  idBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#5E2276",
  },
  statusTag: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#5E2276",
  },
  ageText: {
    fontSize: 11,
    color: "#78716c",
  },
  verifPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  verifGreen: {
    backgroundColor: "#d1fae5",
  },
  verifAmber: {
    backgroundColor: "#fef3c7",
  },
  verifRose: {
    backgroundColor: "#ffe4e6",
  },
  verifText: {
    fontSize: 10,
    fontWeight: "700",
  },
  nameText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1c1917",
  },
  infoGrid: {
    gap: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#44403c",
    flex: 1,
  },
  needText: {
    fontSize: 12,
    color: "#b45309",
    fontWeight: "600",
    flex: 1,
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
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  detailGrid: {
    gap: 10,
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
  row2: {
    flexDirection: "row",
    gap: 10,
  },
  selectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectorBtn: {
    flex: 1,
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
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 8,
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

