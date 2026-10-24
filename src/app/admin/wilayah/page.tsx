"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Search,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  RotateCcw,
  Building2,
} from "lucide-react";
import {
  DistrikRecord,
  KampungRecord,
  getStoredDistriks,
  getStoredKampungs,
  addDistrik,
  updateDistrik,
  deleteDistrik,
  softDeleteDistrik,
  restoreDistrik,
  addKampung,
  updateKampung,
  deleteKampung,
  softDeleteKampung,
  restoreKampung,
} from "@/lib/wilayah";

export default function MasterWilayahAdminPage() {
  const [activeTab, setActiveTab] = useState<"kampung" | "distrik">("kampung");
  const [viewTrash, setViewTrash] = useState(false);

  const [distriks, setDistriks] = useState<DistrikRecord[]>([]);
  const [kampungs, setKampungs] = useState<KampungRecord[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDistrik, setFilterDistrik] = useState("all");
  const [filterKabupaten, setFilterKabupaten] = useState("all");

  // Notifications
  const [alertFeedback, setAlertFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modals for Kampung
  const [isAddKampungOpen, setIsAddKampungOpen] = useState(false);
  const [editingKampung, setEditingKampung] = useState<KampungRecord | null>(null);
  const [deletingKampung, setDeletingKampung] = useState<KampungRecord | null>(null);
  const [permanentDeleteTargetKampung, setPermanentDeleteTargetKampung] =
    useState<KampungRecord | null>(null);
  const [kampungForm, setKampungForm] = useState({
    nama: "",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "",
  });

  // Modals for Distrik
  const [isAddDistrikOpen, setIsAddDistrikOpen] = useState(false);
  const [editingDistrik, setEditingDistrik] = useState<DistrikRecord | null>(null);
  const [deletingDistrik, setDeletingDistrik] = useState<DistrikRecord | null>(null);
  const [permanentDeleteTargetDistrik, setPermanentDeleteTargetDistrik] =
    useState<DistrikRecord | null>(null);
  const [distrikForm, setDistrikForm] = useState({
    nama: "",
    kabupaten: "Kab. Merauke",
  });

  useEffect(() => {
    queueMicrotask(() => {
      setDistriks(getStoredDistriks());
      setKampungs(getStoredKampungs());
    });
  }, []);

  const refreshData = () => {
    setDistriks(getStoredDistriks());
    setKampungs(getStoredKampungs());
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setAlertFeedback({ type, message });
    setTimeout(() => {
      setAlertFeedback(null);
    }, 4000);
  };

  const activeKampungs = useMemo(
    () => kampungs.filter((k) => !k.isDeleted),
    [kampungs]
  );
  const deletedKampungs = useMemo(
    () => kampungs.filter((k) => k.isDeleted),
    [kampungs]
  );
  const activeDistriks = useMemo(
    () => distriks.filter((d) => !d.isDeleted),
    [distriks]
  );
  const deletedDistriks = useMemo(
    () => distriks.filter((d) => d.isDeleted),
    [distriks]
  );

  // Filtered Kampungs
  const filteredKampungs = useMemo(() => {
    const list = viewTrash ? deletedKampungs : activeKampungs;
    return list.filter((k) => {
      const matchSearch =
        k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.distrikNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.kabupaten.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.catatan && k.catatan.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDistrik =
        filterDistrik === "all" || k.distrikNama === filterDistrik;
      const matchKab =
        filterKabupaten === "all" || k.kabupaten === filterKabupaten;

      return matchSearch && matchDistrik && matchKab;
    });
  }, [viewTrash, activeKampungs, deletedKampungs, searchQuery, filterDistrik, filterKabupaten]);

  // Filtered Distriks
  const filteredDistriks = useMemo(() => {
    const list = viewTrash ? deletedDistriks : activeDistriks;
    return list.filter((d) => {
      const matchSearch =
        d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.kabupaten.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKab =
        filterKabupaten === "all" || d.kabupaten === filterKabupaten;

      return matchSearch && matchKab;
    });
  }, [viewTrash, activeDistriks, deletedDistriks, searchQuery, filterKabupaten]);

  // Count kampungs per distrik (active kampungs)
  const getKampungCountForDistrik = (distrikNama: string) => {
    return activeKampungs.filter(
      (k) => k.distrikNama.toLowerCase() === distrikNama.toLowerCase()
    ).length;
  };

  // Distinct kabupaten list
  const uniqueKabupatens = useMemo(() => {
    const fromDistriks = activeDistriks.map((d) => d.kabupaten);
    const fromKampungs = activeKampungs.map((k) => k.kabupaten);
    return Array.from(new Set([...fromDistriks, ...fromKampungs])).sort();
  }, [activeDistriks, activeKampungs]);

  // --- Handlers: Kampung ---
  const handleAddKampungSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addKampung(
      kampungForm.nama,
      kampungForm.distrikNama,
      kampungForm.kabupaten,
      kampungForm.catatan
    );

    if (!res.success) {
      showNotification("error", res.message || "Gagal menambahkan kampung.");
      return;
    }

    refreshData();
    setIsAddKampungOpen(false);
    setKampungForm({
      nama: "",
      distrikNama: activeDistriks[0]?.nama || "Distrik Merauke",
      kabupaten: "Kab. Merauke",
      catatan: "",
    });
    showNotification("success", `Kampung "${kampungForm.nama}" berhasil ditambahkan ke database.`);
  };

  const handleEditKampungSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKampung) return;

    const res = updateKampung(editingKampung.id, {
      nama: kampungForm.nama.trim(),
      distrikNama: kampungForm.distrikNama.trim(),
      kabupaten: kampungForm.kabupaten.trim(),
      catatan: kampungForm.catatan.trim(),
    });

    if (!res.success) {
      showNotification("error", res.message || "Gagal memperbarui kampung.");
      return;
    }

    refreshData();
    setEditingKampung(null);
    showNotification("success", `Data kampung "${kampungForm.nama}" berhasil diperbarui.`);
  };

  const handleSoftDeleteKampung = () => {
    if (!deletingKampung) return;
    const res = softDeleteKampung(deletingKampung.id);

    if (!res.success) {
      showNotification("error", res.message || "Gagal menghapus kampung.");
      setDeletingKampung(null);
      return;
    }

    refreshData();
    setDeletingKampung(null);
    showNotification("success", `Kampung "${deletingKampung.nama}" dipindahkan ke Kotak Sampah.`);
  };

  const handleRestoreKampung = (id: string) => {
    const res = restoreKampung(id);
    if (!res.success) {
      showNotification("error", res.message || "Gagal memulihkan kampung.");
      return;
    }

    refreshData();
    showNotification("success", "Kampung berhasil dipulihkan.");
  };

  const handlePermanentDeleteKampung = () => {
    if (!permanentDeleteTargetKampung) return;
    const res = deleteKampung(permanentDeleteTargetKampung.id);

    if (!res.success) {
      showNotification("error", res.message || "Gagal menghapus kampung secara permanen.");
      setPermanentDeleteTargetKampung(null);
      return;
    }

    refreshData();
    setPermanentDeleteTargetKampung(null);
    showNotification("success", `Kampung "${permanentDeleteTargetKampung.nama}" dihapus secara permanen.`);
  };

  // --- Handlers: Distrik ---
  const handleAddDistrikSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addDistrik(distrikForm.nama, distrikForm.kabupaten);

    if (!res.success) {
      showNotification("error", res.message || "Gagal menambahkan distrik.");
      return;
    }

    refreshData();
    setIsAddDistrikOpen(false);
    setDistrikForm({ nama: "", kabupaten: "Kab. Merauke" });
    showNotification("success", `Distrik "${distrikForm.nama}" berhasil ditambahkan.`);
  };

  const handleEditDistrikSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDistrik) return;

    const res = updateDistrik(editingDistrik.id, {
      nama: distrikForm.nama.trim(),
      kabupaten: distrikForm.kabupaten.trim(),
    });

    if (!res.success) {
      showNotification("error", res.message || "Gagal memperbarui distrik.");
      return;
    }

    refreshData();
    setEditingDistrik(null);
    showNotification("success", `Data distrik "${distrikForm.nama}" berhasil diperbarui.`);
  };

  const handleSoftDeleteDistrik = () => {
    if (!deletingDistrik) return;
    const res = softDeleteDistrik(deletingDistrik.id);

    if (!res.success) {
      showNotification("error", res.message || "Gagal menghapus distrik.");
      setDeletingDistrik(null);
      return;
    }

    refreshData();
    setDeletingDistrik(null);
    showNotification("success", `Distrik "${deletingDistrik.nama}" dipindahkan ke Kotak Sampah.`);
  };

  const handleRestoreDistrik = (id: string) => {
    const res = restoreDistrik(id);
    if (!res.success) {
      showNotification("error", res.message || "Gagal memulihkan distrik.");
      return;
    }

    refreshData();
    showNotification("success", "Distrik berhasil dipulihkan.");
  };

  const handlePermanentDeleteDistrik = () => {
    if (!permanentDeleteTargetDistrik) return;
    const res = deleteDistrik(permanentDeleteTargetDistrik.id);

    if (!res.success) {
      showNotification("error", res.message || "Gagal menghapus distrik secara permanen.");
      setPermanentDeleteTargetDistrik(null);
      return;
    }

    refreshData();
    setPermanentDeleteTargetDistrik(null);
    showNotification("success", `Distrik "${permanentDeleteTargetDistrik.nama}" dihapus secara permanen.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === "kampung") {
      const headers = ["ID", "Nama Kampung", "Distrik", "Kabupaten", "Catatan Wilayah"];
      const rows = filteredKampungs.map((k) => [
        k.id,
        `"${k.nama}"`,
        `"${k.distrikNama}"`,
        `"${k.kabupaten}"`,
        `"${k.catatan || ""}"`,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "master_kampung_sfy.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ["ID", "Nama Distrik", "Kabupaten", "Jumlah Kampung Terdaftar"];
      const rows = filteredDistriks.map((d) => [
        d.id,
        `"${d.nama}"`,
        `"${d.kabupaten}"`,
        getKampungCountForDistrik(d.nama),
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "master_distrik_sfy.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {alertFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            alertFeedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {alertFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{alertFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertFeedback(null)}
            className="p-1 text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Data Wilayah
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          {activeTab === "kampung" ? (
            <button
              type="button"
              onClick={() => {
                setKampungForm({
                  nama: "",
                  distrikNama: distriks[0]?.nama || "Distrik Merauke",
                  kabupaten: distriks[0]?.kabupaten || "Kab. Merauke",
                  catatan: "",
                });
                setIsAddKampungOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kampung Baru</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDistrikForm({ nama: "", kabupaten: "Kab. Merauke" });
                setIsAddDistrikOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Distrik Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Bar (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Kampung
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeKampungs.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Kampung</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Terdaftar di Sistem</span>
            <span className="font-semibold text-stone-700">Aktif</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Distrik
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeDistriks.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Distrik</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Cakupan Wilayah</span>
            <span className="font-semibold text-stone-700">Papua Selatan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Basis Kabupaten
          </p>
          <p className="text-2xl font-extrabold text-emerald-700 my-2">
            {uniqueKabupatens.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Kabupaten</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Fokus Utama</span>
            <span className="font-semibold text-stone-700">Kab. Merauke</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Rata-rata Kampung
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeDistriks.length > 0 ? (activeKampungs.length / activeDistriks.length).toFixed(1) : 0}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">per Distrik</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Distribusi Wilayah</span>
            <span className="font-semibold text-stone-700">Terpetakan</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab("kampung");
            setSearchQuery("");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "kampung"
              ? "border-[#823296] text-[#823296]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Data Kampung ({activeKampungs.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("distrik");
            setSearchQuery("");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "distrik"
              ? "border-[#823296] text-[#823296]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Data Distrik ({activeDistriks.length})</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={
                activeTab === "kampung"
                  ? "Cari nama kampung, distrik, kabupaten, atau catatan..."
                  : "Cari nama distrik, ID, atau kabupaten..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          {activeTab === "kampung" && (
            <select
              value={filterDistrik}
              onChange={(e) => setFilterDistrik(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
            >
              <option value="all">Semua Distrik</option>
              {distriks.map((d) => (
                <option key={d.id} value={d.nama}>
                  {d.nama}
                </option>
              ))}
            </select>
          )}

          <select
            value={filterKabupaten}
            onChange={(e) => setFilterKabupaten(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Kabupaten</option>
            {uniqueKabupatens.map((kab) => (
              <option key={kab} value={kab}>
                {kab}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Aktif vs Kotak Sampah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setViewTrash(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              !viewTrash
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Data Aktif ({activeTab === "kampung" ? activeKampungs.length : activeDistriks.length})
          </button>
          <button
            type="button"
            onClick={() => setViewTrash(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewTrash
                ? "bg-stone-900 text-white shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              Kotak Sampah ({activeTab === "kampung" ? deletedKampungs.length : deletedDistriks.length})
            </span>
          </button>
        </div>
        {viewTrash && (
          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
            Menampilkan data {activeTab === "kampung" ? "kampung" : "distrik"} yang dihapus sementara (Soft Delete). Anda dapat memulihkannya kapan saja.
          </span>
        )}
      </div>

      {/* Active Tab Content */}
      {activeTab === "kampung" ? (
        // Table: Kampungs
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-[28%] min-w-[180px]">Nama Kampung / Desa</th>
                  <th className="py-3.5 px-3 w-[20%] min-w-[150px]">Distrik Induk</th>
                  <th className="py-3.5 px-3 w-[18%] min-w-[130px]">Kabupaten</th>
                  <th className="py-3.5 px-3 w-[26%] min-w-[180px]">
                    {viewTrash ? "Tgl Dihapus" : "Catatan / Posko Lapangan"}
                  </th>
                  <th className="py-3.5 px-4 w-[8%] min-w-[80px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredKampungs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-stone-500 text-sm"
                    >
                      {viewTrash
                        ? "Kotak sampah kosong. Tidak ada data kampung yang terhapus."
                        : "Tidak ada kampung yang sesuai pencarian."}
                    </td>
                  </tr>
                ) : (
                  filteredKampungs.map((k) => (
                    <tr
                      key={k.id}
                      className="hover:bg-purple-50/20 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#823296] flex items-center justify-center shrink-0">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <p className="font-semibold text-stone-900">{k.nama}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {k.distrikNama}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-stone-600">
                        {k.kabupaten}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-stone-500 max-w-xs truncate">
                        {viewTrash ? k.deletedAt || "-" : k.catatan || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {viewTrash ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRestoreKampung(k.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Pulihkan Kampung"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Pulihkan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPermanentDeleteTargetKampung(k)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus Permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingKampung(k);
                                setKampungForm({
                                  nama: k.nama,
                                  distrikNama: k.distrikNama,
                                  kabupaten: k.kabupaten,
                                  catatan: k.catatan || "",
                                });
                              }}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                              title="Edit Kampung"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingKampung(k)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus ke Kotak Sampah"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Table: Distriks
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-[35%] min-w-[200px]">Nama Distrik</th>
                  <th className="py-3.5 px-3 w-[28%] min-w-[170px]">Kabupaten</th>
                  <th className="py-3.5 px-3 w-[27%] min-w-[160px]">
                    {viewTrash ? "Tgl Dihapus" : "Kampung Terdaftar"}
                  </th>
                  <th className="py-3.5 px-4 w-[10%] min-w-[80px] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDistriks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-stone-500 text-sm"
                    >
                      {viewTrash
                        ? "Kotak sampah kosong. Tidak ada data distrik yang terhapus."
                        : "Tidak ada distrik yang sesuai pencarian."}
                    </td>
                  </tr>
                ) : (
                  filteredDistriks.map((d) => {
                    const count = getKampungCountForDistrik(d.nama);
                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-purple-50/20 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <p className="font-semibold text-stone-900">
                              {d.nama}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-stone-700">
                          {d.kabupaten}
                        </td>
                        <td className="py-3.5 px-3">
                          {viewTrash ? (
                            <span className="text-xs text-stone-500">
                              {d.deletedAt || "-"}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#823296] bg-purple-50 px-2.5 py-0.5 rounded-full">
                              {count} Kampung
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {viewTrash ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRestoreDistrik(d.id)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                title="Pulihkan Distrik"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Pulihkan</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPermanentDeleteTargetDistrik(d)}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Hapus Permanen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setKampungForm({
                                    nama: "",
                                    distrikNama: d.nama,
                                    kabupaten: d.kabupaten,
                                    catatan: "",
                                  });
                                  setIsAddKampungOpen(true);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-[#823296] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
                                title="Tambah Kampung di Distrik ini"
                              >
                                + Kampung
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDistrik(d);
                                  setDistrikForm({
                                    nama: d.nama,
                                    kabupaten: d.kabupaten,
                                  });
                                }}
                                className="p-1.5 rounded-lg text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                                title="Edit Distrik"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingDistrik(d)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Hapus ke Kotak Sampah"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL: Tambah Kampung --- */}
      {isAddKampungOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Tambah Kampung / Kelurahan Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddKampungOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKampungSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Kampung / Kelurahan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kampung Wasur / Kelurahan Maro"
                  value={kampungForm.nama}
                  onChange={(e) =>
                    setKampungForm({ ...kampungForm, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Pilih Distrik Induk *
                </label>
                <select
                  value={kampungForm.distrikNama}
                  onChange={(e) => {
                    const selDistrik = distriks.find((d) => d.nama === e.target.value);
                    setKampungForm({
                      ...kampungForm,
                      distrikNama: e.target.value,
                      kabupaten: selDistrik ? selDistrik.kabupaten : kampungForm.kabupaten,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
                >
                  {distriks.map((d) => (
                    <option key={d.id} value={d.nama}>
                      {d.nama} ({d.kabupaten})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kabupaten
                </label>
                <input
                  type="text"
                  value={kampungForm.kabupaten}
                  onChange={(e) =>
                    setKampungForm({ ...kampungForm, kabupaten: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Catatan Wilayah / Posko Binaan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Keterangan akses, kondisi anak yatim di kampung ini, atau posko relawan..."
                  value={kampungForm.catatan}
                  onChange={(e) =>
                    setKampungForm({ ...kampungForm, catatan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddKampungOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Kampung
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Edit Kampung --- */}
      {editingKampung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Edit Data Kampung
              </h3>
              <button
                type="button"
                onClick={() => setEditingKampung(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditKampungSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Kampung *
                </label>
                <input
                  type="text"
                  required
                  value={kampungForm.nama}
                  onChange={(e) =>
                    setKampungForm({ ...kampungForm, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Distrik Induk
                </label>
                <select
                  value={kampungForm.distrikNama}
                  onChange={(e) => {
                    const selDistrik = distriks.find((d) => d.nama === e.target.value);
                    setKampungForm({
                      ...kampungForm,
                      distrikNama: e.target.value,
                      kabupaten: selDistrik ? selDistrik.kabupaten : kampungForm.kabupaten,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
                >
                  {distriks.map((d) => (
                    <option key={d.id} value={d.nama}>
                      {d.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kabupaten
                </label>
                <input
                  type="text"
                  value={kampungForm.kabupaten}
                  onChange={(e) =>
                    setKampungForm({ ...kampungForm, kabupaten: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Catatan Wilayah
                </label>
                <textarea
                  rows={3}
                  value={kampungForm.catatan}
                  onChange={(e) =>
                    setKampungForm({ ...kampungForm, catatan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingKampung(null)}
                  className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Hapus Kampung (Soft Delete) --- */}
      {deletingKampung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Data Kampung (Soft Delete)</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan data kampung <strong>{deletingKampung.nama}</strong> ({deletingKampung.distrikNama}) ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Data tidak akan dihapus permanen dan dapat dipulihkan sewaktu-waktu melalui tab <strong>Kotak Sampah</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeletingKampung(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSoftDeleteKampung}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Pindahkan ke Sampah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Hapus Kampung Permanen --- */}
      {permanentDeleteTargetKampung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Hapus Kampung Secara Permanen</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data kampung <strong>{permanentDeleteTargetKampung.nama}</strong> ({permanentDeleteTargetKampung.distrikNama}) secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data kampung ini akan dihapus sepenuhnya dari database lokal.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPermanentDeleteTargetKampung(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handlePermanentDeleteKampung}
                className="px-4 py-2 rounded-xl font-semibold bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Tambah Distrik --- */}
      {isAddDistrikOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Tambah Distrik Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDistrikOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDistrikSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Distrik *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Distrik Ilwayab / Distrik Kimaam"
                  value={distrikForm.nama}
                  onChange={(e) =>
                    setDistrikForm({ ...distrikForm, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kabupaten *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kab. Merauke"
                  value={distrikForm.kabupaten}
                  onChange={(e) =>
                    setDistrikForm({ ...distrikForm, kabupaten: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddDistrikOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Distrik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Edit Distrik --- */}
      {editingDistrik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Edit Data Distrik
              </h3>
              <button
                type="button"
                onClick={() => setEditingDistrik(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDistrikSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Distrik *
                </label>
                <input
                  type="text"
                  required
                  value={distrikForm.nama}
                  onChange={(e) =>
                    setDistrikForm({ ...distrikForm, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kabupaten *
                </label>
                <input
                  type="text"
                  required
                  value={distrikForm.kabupaten}
                  onChange={(e) =>
                    setDistrikForm({ ...distrikForm, kabupaten: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDistrik(null)}
                  className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Hapus Distrik (Soft Delete) --- */}
      {deletingDistrik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Data Distrik (Soft Delete)</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan data distrik <strong>{deletingDistrik.nama}</strong> ({deletingDistrik.kabupaten}) ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Data tidak akan dihapus permanen dan dapat dipulihkan sewaktu-waktu melalui tab <strong>Kotak Sampah</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeletingDistrik(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSoftDeleteDistrik}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Pindahkan ke Sampah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Hapus Distrik Permanen --- */}
      {permanentDeleteTargetDistrik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Hapus Distrik Secara Permanen</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data distrik <strong>{permanentDeleteTargetDistrik.nama}</strong> ({permanentDeleteTargetDistrik.kabupaten}) secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data distrik ini akan dihapus sepenuhnya dari database lokal.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPermanentDeleteTargetDistrik(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handlePermanentDeleteDistrik}
                className="px-4 py-2 rounded-xl font-semibold bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
