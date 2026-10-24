"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  CheckSquare,
} from "lucide-react";
import { AVRecord, OrphanRecord } from "@/data/admin/adminData";
import {
  getStoredAVs,
  saveStoredAVs,
  getStoredOrphans,
  fetchAVsFromApi,
  fetchOrphansFromApi,
} from "@/lib/adminDataStore";
import {
  getStoredDistriks,
  getStoredKampungs,
  fetchWilayahFromApi,
  addKampung,
  DistrikRecord,
  KampungRecord,
} from "@/lib/wilayah";

export default function AVAdminPage() {
  const [avList, setAvList] = useState<AVRecord[]>([]);
  const [orphans, setOrphans] = useState<OrphanRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDistrik, setFilterDistrik] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Master Wilayah Data
  const [distriksList, setDistriksList] = useState<DistrikRecord[]>([]);
  const [kampungsList, setKampungsList] = useState<KampungRecord[]>([]);
  const [isCustomKampung, setIsCustomKampung] = useState(false);
  const [customKampungName, setCustomKampungName] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setDistriksList(getStoredDistriks());
      setKampungsList(getStoredKampungs());
      setAvList(getStoredAVs());
      setOrphans(getStoredOrphans());
    });
    fetchAVsFromApi().then(setAvList);
    fetchOrphansFromApi().then(setOrphans);
    fetchWilayahFromApi().then(({ distriks, kampungs }) => {
      setDistriksList(distriks);
      setKampungsList(kampungs);
    });
  }, []);

  // Detail Modal State
  const [selectedAV, setSelectedAV] = useState<AVRecord | null>(null);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    noHp: "",
    kampung: "Kampung Wasur",
    distrik: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    alamat: "",
    catatanWilayah: "",
    status: "Aktif" as "Aktif" | "Non-aktif" | "Menunggu Verifikasi",
  });

  // Edit Modal State
  const [editingAV, setEditingAV] = useState<AVRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    nama: "",
    noHp: "",
    kampung: "",
    distrik: "",
    kabupaten: "",
    alamat: "",
    catatanWilayah: "",
    status: "Aktif" as AVRecord["status"],
  });

  // Trash / Soft Delete State
  const [viewTrash, setViewTrash] = useState(false);
  const [softDeleteTarget, setSoftDeleteTarget] = useState<AVRecord | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<AVRecord | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkSoftDeleteModalOpen, setBulkSoftDeleteModalOpen] = useState(false);
  const [bulkPermanentDeleteModalOpen, setBulkPermanentDeleteModalOpen] = useState(false);

  // Filtered List
  const activeAVs = avList.filter((a) => !a.isDeleted);
  const deletedAVs = avList.filter((a) => !!a.isDeleted);
  const activeOrphans = orphans.filter((o) => !o.isDeleted);
  const activeDistriks = distriksList.filter((d) => !d.isDeleted);
  const activeKampungs = kampungsList.filter((k) => !k.isDeleted);
  const baseAVList = viewTrash ? deletedAVs : activeAVs;

  const filteredAVs = baseAVList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kampung.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noHp.includes(searchQuery) ||
      item.alamat.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrik =
      filterDistrik === "all" || item.distrik === filterDistrik;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesDistrik && matchesStatus;
  });

  // Unique villages count (excluding deleted villages)
  const deletedKampungNames = new Set(
    kampungsList.filter((k) => k.isDeleted).map((k) => k.nama.toLowerCase())
  );
  const uniqueKampungCount = new Set(
    activeAVs
      .map((av) => av.kampung.toLowerCase())
      .filter((k) => Boolean(k) && !deletedKampungNames.has(k))
  ).size;

  // Get non-deleted orphan records under an AV
  const getOrphansForAV = (avId: string, avNama?: string) => {
    return activeOrphans.filter(
      (o) =>
        o.pjAvId === avId ||
        (avNama &&
          o.pjAvNama &&
          o.pjAvNama.toLowerCase() === avNama.toLowerCase())
    );
  };

  // Total non-deleted orphans under active AV supervision
  const totalOrphansSupervised = activeOrphans.filter((o) =>
    activeAVs.some(
      (av) =>
        av.id === o.pjAvId ||
        (o.pjAvNama && o.pjAvNama.toLowerCase() === av.nama.toLowerCase())
    )
  ).length;

  const handleToggleStatus = (id: string) => {
    setAvList((prev) => {
      const nextList = prev.map((item) => {
        if (item.id === id) {
          const nextStatus: AVRecord["status"] =
            item.status === "Aktif"
              ? "Non-aktif"
              : item.status === "Non-aktif"
              ? "Menunggu Verifikasi"
              : "Aktif";
          return { ...item, status: nextStatus };
        }
        return item;
      });
      saveStoredAVs(nextList);
      return nextList;
    });

    if (selectedAV && selectedAV.id === id) {
      setSelectedAV((prev) =>
        prev
          ? {
              ...prev,
              status:
                prev.status === "Aktif"
                  ? "Non-aktif"
                  : prev.status === "Non-aktif"
                  ? "Menunggu Verifikasi"
                  : "Aktif",
            }
          : null
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalKampung = isCustomKampung ? customKampungName.trim() : formData.kampung;

    if (finalKampung && formData.distrik) {
      addKampung(finalKampung, formData.distrik, formData.kabupaten);
      setDistriksList(getStoredDistriks());
      setKampungsList(getStoredKampungs());
    }

    const newRecord: AVRecord = {
      id: `AV-00${avList.length + 1}`,
      nama: formData.nama,
      noHp: formData.noHp,
      kampung: finalKampung,
      distrik: formData.distrik,
      kabupaten: formData.kabupaten,
      alamat: formData.alamat,
      anakDampingan: [],
      status: formData.status,
      tanggalBergabung: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      catatanWilayah:
        formData.catatanWilayah || "Koordinator posko lapangan kampung baru.",
    };

    const updated = [newRecord, ...avList];
    setAvList(updated);
    saveStoredAVs(updated);
    setIsAddModalOpen(false);
    setIsCustomKampung(false);
    setCustomKampungName("");
    setFormData({
      nama: "",
      noHp: "",
      kampung: "Kampung Wasur",
      distrik: "Distrik Merauke",
      kabupaten: "Kab. Merauke",
      alamat: "",
      catatanWilayah: "",
      status: "Aktif",
    });
  };

  const handleOpenEdit = (av: AVRecord) => {
    setEditingAV(av);
    setEditFormData({
      nama: av.nama,
      noHp: av.noHp,
      kampung: av.kampung,
      distrik: av.distrik,
      kabupaten: av.kabupaten,
      alamat: av.alamat,
      catatanWilayah: av.catatanWilayah || "",
      status: av.status,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAV) return;

    const updated = avList.map((av) => {
      if (av.id === editingAV.id) {
        return {
          ...av,
          nama: editFormData.nama.trim(),
          noHp: editFormData.noHp.trim(),
          kampung: editFormData.kampung.trim(),
          distrik: editFormData.distrik.trim(),
          kabupaten: editFormData.kabupaten.trim(),
          alamat: editFormData.alamat.trim(),
          status: editFormData.status,
          catatanWilayah: editFormData.catatanWilayah.trim(),
        };
      }
      return av;
    });

    setAvList(updated);
    saveStoredAVs(updated);
    if (selectedAV && selectedAV.id === editingAV.id) {
      const updatedItem = updated.find((a) => a.id === editingAV.id);
      if (updatedItem) setSelectedAV(updatedItem);
    }
    setEditingAV(null);
  };

  const handleSoftDelete = (av: AVRecord) => {
    const updated = avList.map((a) => {
      if (a.id === av.id) {
        return {
          ...a,
          isDeleted: true,
          deletedAt: new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        };
      }
      return a;
    });
    setAvList(updated);
    saveStoredAVs(updated);
    if (selectedAV?.id === av.id) setSelectedAV(null);
    setSoftDeleteTarget(null);
  };

  const handleRestore = (id: string) => {
    const updated = avList.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          isDeleted: false,
          deletedAt: undefined,
        };
      }
      return a;
    });
    setAvList(updated);
    saveStoredAVs(updated);
  };

  const handlePermanentDelete = (id: string) => {
    const updated = avList.filter((a) => a.id !== id);
    setAvList(updated);
    saveStoredAVs(updated);
    if (selectedAV?.id === id) setSelectedAV(null);
    setPermanentDeleteTarget(null);
  };

  const isAllSelected =
    filteredAVs.length > 0 &&
    filteredAVs.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAVs.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkSoftDelete = () => {
    const now = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    const updated = avList.map((a) => {
      if (selectedIds.includes(a.id)) {
        return {
          ...a,
          isDeleted: true,
          deletedAt: now,
        };
      }
      return a;
    });

    setAvList(updated);
    saveStoredAVs(updated);
    setSelectedIds([]);
    setBulkSoftDeleteModalOpen(false);
  };

  const handleBulkRestore = () => {
    const updated = avList.map((a) => {
      if (selectedIds.includes(a.id)) {
        return {
          ...a,
          isDeleted: false,
          deletedAt: undefined,
        };
      }
      return a;
    });

    setAvList(updated);
    saveStoredAVs(updated);
    setSelectedIds([]);
  };

  const handleBulkPermanentDelete = () => {
    const updated = avList.filter((a) => !selectedIds.includes(a.id));
    setAvList(updated);
    saveStoredAVs(updated);
    setSelectedIds([]);
    setBulkPermanentDeleteModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Koordinator AV",
      "Nomor HP / WhatsApp",
      "Kampung",
      "Distrik",
      "Kabupaten",
      "Alamat Lengkap",
      "Jumlah Anak Dampingan",
      "Daftar Anak Yatim Dampingan",
      "Status",
      "Tanggal Bergabung",
    ];

    const rows = filteredAVs.map((av) => {
      const supervisedNames = getOrphansForAV(av.id, av.nama).map(
        (o) => o.namaLengkap
      );
      return [
        av.id,
        `"${av.nama}"`,
        `"${av.noHp}"`,
        `"${av.kampung}"`,
        `"${av.distrik}"`,
        `"${av.kabupaten}"`,
        `"${av.alamat}"`,
        supervisedNames.length,
        `"${supervisedNames.join(", ")}"`,
        av.status,
        `"${av.tanggalBergabung}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_av_koordinator_kampung_sfy.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Pendataan Koordinator Lapangan (AV)
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
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Koordinator AV</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Koordinator AV
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeAVs.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Personel</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Penanggung Jawab</span>
            <span className="font-semibold text-stone-700">Wilayah Dampingan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            AV Aktif Bertugas
          </p>
          <p className="text-2xl font-extrabold text-emerald-700 my-2">
            {activeAVs.filter((a) => a.status === "Aktif").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Orang</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Status Cuti / Nonaktif</span>
            <span className="font-semibold text-stone-700">
              {activeAVs.filter((a) => a.status !== "Aktif").length} Personel
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Kampung Terjangkau
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {uniqueKampungCount}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Kampung</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Cakupan Wilayah</span>
            <span className="font-semibold text-stone-700">Papua Selatan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Santri Dampingan AV
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {totalOrphansSupervised}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Anak Yatim</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Rata-rata Pendampingan</span>
            <span className="font-semibold text-stone-700">
              ~{activeAVs.length > 0 ? Math.round(totalOrphansSupervised / activeAVs.length) : 0} Santri/AV
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama koordinator AV, nomor HP, kampung, atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          <select
            value={filterDistrik}
            onChange={(e) => setFilterDistrik(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Distrik</option>
            {activeDistriks.map((d) => (
              <option key={d.id} value={d.nama}>
                {d.nama}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Non-aktif">Non-aktif</option>
          </select>
        </div>
      </div>

      {/* Tabs Aktif vs Kotak Sampah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => {
              setViewTrash(false);
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              !viewTrash
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Data Aktif ({activeAVs.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setViewTrash(true);
              setSelectedIds([]);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewTrash
                ? "bg-stone-900 text-white shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kotak Sampah ({deletedAVs.length})</span>
          </button>
        </div>
        {viewTrash && (
          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
            Menampilkan data koordinator AV yang dihapus sementara (Soft Delete). Anda dapat memulihkannya kapan saja.
          </span>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-red-900 font-semibold">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedIds.length} data koordinator AV terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl border border-red-200 text-stone-700 bg-white hover:bg-stone-50 font-semibold cursor-pointer"
            >
              Batal Pilih
            </button>
            {viewTrash ? (
              <>
                <button
                  type="button"
                  onClick={handleBulkRestore}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pulihkan ({selectedIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBulkPermanentDeleteModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Permanen ({selectedIds.length})</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setBulkSoftDeleteModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus {selectedIds.length} Data Terpilih</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-stone-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    title={isAllSelected ? "Batalkan semua" : "Pilih semua"}
                  />
                </th>
                <th className="py-3.5 px-4 w-[20%] min-w-[160px]">Nama Koordinator</th>
                <th className="py-3.5 px-3 w-[15%] min-w-[130px]">Kontak WA</th>
                <th className="py-3.5 px-3 w-[18%] min-w-[150px]">Kampung & Distrik</th>
                <th className="py-3.5 px-3 w-[20%] min-w-[160px]">Alamat Lengkap Posko</th>
                <th className="py-3.5 px-3 w-[11%] min-w-[100px]">Anak Asuh (PJ)</th>
                <th className="py-3.5 px-3 w-[11%] min-w-[105px]">Tgl Bergabung</th>
                <th className="py-3.5 px-3 w-[9%] min-w-[85px] text-center">Status</th>
                <th className="py-3.5 px-4 w-[11%] min-w-[125px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAVs.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan data Koordinator AV yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredAVs.map((av) => (
                  <tr
                    key={av.id}
                    className={`hover:bg-purple-50/20 transition-colors ${
                      selectedIds.includes(av.id) ? "bg-purple-50/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(av.id)}
                        onChange={() => toggleSelectRow(av.id)}
                        className="w-4 h-4 rounded border-stone-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">
                        {av.nama}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <a
                        href={`https://wa.me/${av.noHp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                        title="Buka Chat WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{av.noHp}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-800">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{av.kampung}, {av.distrik}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-600 max-w-[220px] truncate" title={av.alamat}>
                      {av.alamat}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          getOrphansForAV(av.id, av.nama).length > 0
                            ? "bg-purple-100 text-purple-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {getOrphansForAV(av.id, av.nama).length} Anak
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-500">
                      {av.tanggalBergabung}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(av.id)}
                        title="Klik untuk mengubah status keaktifan AV"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${
                          av.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : av.status === "Menunggu Verifikasi"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {av.status === "Aktif" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : av.status === "Menunggu Verifikasi" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span>{av.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {viewTrash ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRestore(av.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                            title="Pulihkan Data AV"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Pulihkan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPermanentDeleteTarget(av)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAV(av)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors cursor-pointer"
                            title="Lihat Detail & Santri Dampingan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(av)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Edit Data Koordinator AV"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSoftDeleteTarget(av)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Data (Soft Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* DETAIL MODAL */}
      {selectedAV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#823296] bg-purple-50 px-2 py-0.5 rounded">
                  {selectedAV.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  {selectedAV.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAV(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Quick Info Grid */}
              <div className="p-3.5 bg-stone-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Kampung Binaan:</span>
                  <span className="font-bold text-[#823296]">
                    {selectedAV.kampung} ({selectedAV.distrik})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Kabupaten:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedAV.kabupaten}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Keaktifan:</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      selectedAV.status === "Aktif"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedAV.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tanggal Bergabung:</span>
                  <span className="font-medium text-stone-800">
                    {selectedAV.tanggalBergabung}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <span className="text-stone-500 block mb-1">
                  Alamat Lengkap Posko / Domisili:
                </span>
                <p className="p-2.5 bg-white rounded-lg border border-stone-200 text-stone-800 font-medium">
                  {selectedAV.alamat}
                </p>
              </div>

              {/* Contact */}
              <div>
                <span className="text-stone-500 block mb-1">
                  Nomor HP / WhatsApp Resmi:
                </span>
                <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <span className="font-mono font-semibold text-emerald-900">
                    {selectedAV.noHp}
                  </span>
                  <a
                    href={`https://wa.me/${selectedAV.noHp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Supervised Orphans List */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#823296]" />
                    <span>Daftar Anak Yatim yang di-PJ-kan:</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#823296] bg-purple-50 px-2 py-0.5 rounded">
                    {getOrphansForAV(selectedAV.id, selectedAV.nama).length} Santri
                  </span>
                </div>

                {getOrphansForAV(selectedAV.id, selectedAV.nama).length === 0 ? (
                  <p className="text-stone-500 p-3 bg-stone-50 rounded-xl text-center">
                    Belum ada anak yatim yang ditugaskan ke PJ AV ini.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getOrphansForAV(selectedAV.id, selectedAV.nama).map((orphan) => (
                      <div
                        key={orphan.id}
                        className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-stone-900">
                            {orphan.namaLengkap} ({orphan.usia} th)
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {orphan.status} • {orphan.jenjangPendidikan}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-purple-200 text-[#823296]">
                          {orphan.id}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedAV.catatanWilayah && (
                <div>
                  <span className="text-stone-500 block mb-1">
                    Catatan Wilayah & Koordinasi:
                  </span>
                  <p className="p-2.5 bg-stone-50 rounded-lg text-stone-700 leading-relaxed border border-stone-100">
                    {selectedAV.catatanWilayah}
                  </p>
                </div>
              )}

              {/* Action footer */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedAV.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                >
                  Ubah Status: {selectedAV.status}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(selectedAV)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-[#823296] hover:bg-purple-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Data AV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSoftDeleteTarget(selectedAV);
                      setSelectedAV(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAV(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Tambah Koordinator Lapangan Kampung (AV) Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Lengkap Koordinator AV *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Yohanes Gebze"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nomor HP / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0812-xxxx-xxxx"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-700 font-medium">
                      Distrik Penugasan *
                    </label>
                    <Link
                      href="/admin/wilayah"
                      target="_blank"
                      className="text-[10px] text-[#823296] hover:underline flex items-center gap-0.5"
                    >
                      <span>Data Wilayah</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                  <select
                    value={formData.distrik}
                    onChange={(e) => {
                      const sel = activeDistriks.find((d) => d.nama === e.target.value);
                      setFormData({
                        ...formData,
                        distrik: e.target.value,
                        kabupaten: sel ? sel.kabupaten : formData.kabupaten,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    {activeDistriks.map((d) => (
                      <option key={d.id} value={d.nama}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Kampung *
                  </label>
                  {isCustomKampung ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        required
                        placeholder="Ketik kampung baru..."
                        value={customKampungName}
                        onChange={(e) => setCustomKampungName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#823296] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomKampung(false);
                          setCustomKampungName("");
                        }}
                        className="px-2 py-2 text-[10px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg shrink-0 cursor-pointer"
                      >
                        Pilih
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={formData.kampung}
                        onChange={(e) =>
                          setFormData({ ...formData, kampung: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-800"
                      >
                        {activeKampungs.map((k) => (
                          <option key={k.id} value={k.nama}>
                            {k.nama} ({k.distrikNama})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsCustomKampung(true)}
                        className="px-2 py-2 text-[10px] font-semibold text-[#823296] bg-purple-50 hover:bg-purple-100 rounded-lg shrink-0 cursor-pointer"
                        title="Ketik kampung baru jika belum ada di database"
                      >
                        + Baru
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kabupaten
                </label>
                <select
                  value={formData.kabupaten}
                  onChange={(e) =>
                    setFormData({ ...formData, kabupaten: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                >
                  <option value="Kab. Merauke">Kab. Merauke</option>
                  <option value="Kab. Boven Digoel">Kab. Boven Digoel</option>
                  <option value="Kab. Mappi">Kab. Mappi</option>
                  <option value="Kab. Asmat">Kab. Asmat</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Alamat Lengkap / Posko *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Jl. Poros Trans Irian, RT 02 / RW 01, Kampung Wasur"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Catatan Kondisi Wilayah / Koordinasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Posko koordinasi sembako & pendataan anak yatim"
                  value={formData.catatanWilayah}
                  onChange={(e) =>
                    setFormData({ ...formData, catatanWilayah: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Status Keaktifan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Aktif" | "Non-aktif" | "Menunggu Verifikasi",
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Non-aktif">Non-aktif</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Koordinator AV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingAV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#823296] bg-purple-50 px-2 py-0.5 rounded">
                  {editingAV.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  Edit Data Koordinator Lapangan (AV)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAV(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.nama}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, nama: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nomor HP / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.noHp}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, noHp: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Distrik Wilayah Binaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.distrik}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, distrik: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kabupaten *
                  </label>
                  <select
                    value={editFormData.kabupaten}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, kabupaten: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Kab. Merauke">Kab. Merauke</option>
                    <option value="Kab. Boven Digoel">Kab. Boven Digoel</option>
                    <option value="Kab. Mappi">Kab. Mappi</option>
                    <option value="Kab. Asmat">Kab. Asmat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kampung Binaan *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.kampung}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, kampung: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Alamat Lengkap / Posko *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editFormData.alamat}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, alamat: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Catatan Kondisi Wilayah / Koordinasi
                </label>
                <input
                  type="text"
                  value={editFormData.catatanWilayah}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      catatanWilayah: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Status Keaktifan
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value as AVRecord["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white font-medium"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Non-aktif">Non-aktif</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingAV(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Data AV (Soft Delete) */}
      {softDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Data Koordinator AV (Soft Delete)</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan data koordinator <strong>{softDeleteTarget.nama}</strong> ({softDeleteTarget.kampung}) ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Data tidak akan dihapus permanen dan dapat dipulihkan sewaktu-waktu melalui tab <strong>Kotak Sampah</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSoftDeleteTarget(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSoftDelete(softDeleteTarget)}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Pindahkan ke Sampah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Permanen */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Hapus Data Secara Permanen</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data koordinator <strong>{permanentDeleteTarget.nama}</strong> secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data koordinator ini akan dihapus sepenuhnya dari database lokal.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete(permanentDeleteTarget.id)}
                className="px-4 py-2 rounded-xl font-semibold bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Konfirmasi Hapus Sekaligus Banyak (Bulk Soft Delete) */}
      {bulkSoftDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus {selectedIds.length} Koordinator AV Sekaligus</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan <strong>{selectedIds.length} data koordinator AV</strong> yang dipilih ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Data tidak akan dihapus permanen dan dapat dipulihkan sewaktu-waktu melalui tab <strong>Kotak Sampah</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setBulkSoftDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkSoftDelete}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Pindahkan {selectedIds.length} Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Permanen Sekaligus (Bulk Permanent Delete) */}
      {bulkPermanentDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Hapus Permanen {selectedIds.length} Koordinator AV</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{selectedIds.length} data koordinator AV</strong> yang dipilih secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data koordinator ini akan dihapus sepenuhnya dari database.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setBulkPermanentDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkPermanentDelete}
                className="px-4 py-2 rounded-xl font-semibold bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Hapus Permanen ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

