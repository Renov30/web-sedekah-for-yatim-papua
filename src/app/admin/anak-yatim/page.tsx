"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  MapPin,
  MapPinHouse,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { initialOrphans, initialAVs, OrphanRecord } from "@/data/admin/adminData";
import {
  getStoredOrphans,
  saveStoredOrphans,
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

export default function AnakYatimAdminPage() {
  const [orphans, setOrphans] = useState<OrphanRecord[]>(initialOrphans);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDistrik, setFilterDistrik] = useState("all");
  const [filterKampung, setFilterKampung] = useState("all");
  const [filterUsia, setFilterUsia] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVerif, setFilterVerif] = useState("all");

  // Detail Modal State
  const [selectedOrphan, setSelectedOrphan] = useState<OrphanRecord | null>(
    null
  );

  // Trash / Soft Delete State
  const [viewTrash, setViewTrash] = useState(false);
  const [softDeleteTarget, setSoftDeleteTarget] = useState<OrphanRecord | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<OrphanRecord | null>(null);

  // Add Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrphan, setEditingOrphan] = useState<OrphanRecord | null>(null);
  const [formData, setFormData] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    gender: "L" as "L" | "P",
    usia: 10,
    status: "Yatim" as "Yatim" | "Piatu" | "Yatim Piatu",
    asalDaerah: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Wasur",
    pjAvNama: "Yohanes Gebze",
    tempatTinggal: "Asrama SFY Merauke",
    wali: "",
    jenjangPendidikan: "SD Kelas 4",
    kebutuhanMendesak: "Seragam & Buku Pelajaran",
    statusVerifikasi: "Menunggu Survei" as
      | "Terverifikasi"
      | "Menunggu Survei"
      | "Perlu Pembaruan",
  });
  const [editFormData, setEditFormData] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    gender: "L" as "L" | "P",
    usia: 10,
    status: "Yatim" as "Yatim" | "Piatu" | "Yatim Piatu",
    asalDaerah: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    kampung: "Kampung Wasur",
    pjAvNama: "Yohanes Gebze",
    tempatTinggal: "Asrama SFY Merauke",
    wali: "",
    jenjangPendidikan: "SD Kelas 4",
    kebutuhanMendesak: "Seragam & Buku Pelajaran",
    statusVerifikasi: "Menunggu Survei" as
      | "Terverifikasi"
      | "Menunggu Survei"
      | "Perlu Pembaruan",
  });

  // Master Wilayah Data
  const [distriksList, setDistriksList] = useState<DistrikRecord[]>([]);
  const [kampungsList, setKampungsList] = useState<KampungRecord[]>([]);
  const [isCustomDistrik, setIsCustomDistrik] = useState(false);
  const [isCustomKampung, setIsCustomKampung] = useState(false);
  const [customDistrikName, setCustomDistrikName] = useState("");
  const [customKampungName, setCustomKampungName] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setDistriksList(getStoredDistriks());
      setKampungsList(getStoredKampungs());
      setOrphans(getStoredOrphans());
    });
    fetchOrphansFromApi().then(setOrphans);
    fetchWilayahFromApi().then(({ distriks, kampungs }) => {
      setDistriksList(distriks);
      setKampungsList(kampungs);
    });
  }, []);

  // Dynamic filter lists from data + master database
  const uniqueDistriks = useMemo(() => {
    const fromMaster = distriksList.map((d) => d.nama);
    const fromOrphans = orphans.map((o) => o.asalDaerah).filter(Boolean);
    return Array.from(new Set([...fromMaster, ...fromOrphans])).sort();
  }, [distriksList, orphans]);

  const uniqueKampungs = useMemo(() => {
    const fromMaster = kampungsList.map((k) => k.nama);
    const fromOrphans = orphans
      .map((o) => o.kampung)
      .filter((k): k is string => Boolean(k));
    return Array.from(new Set([...fromMaster, ...fromOrphans])).sort();
  }, [kampungsList, orphans]);

  const isFilterActive =
    searchQuery !== "" ||
    filterDistrik !== "all" ||
    filterKampung !== "all" ||
    filterUsia !== "all" ||
    filterGender !== "all" ||
    filterStatus !== "all" ||
    filterVerif !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDistrik("all");
    setFilterKampung("all");
    setFilterUsia("all");
    setFilterGender("all");
    setFilterStatus("all");
    setFilterVerif("all");
  };

  const activeOrphans = orphans.filter((o) => !o.isDeleted);
  const deletedOrphans = orphans.filter((o) => !!o.isDeleted);

  // Filtered List
  const baseList = viewTrash ? deletedOrphans : activeOrphans;
  const filteredOrphans = baseList.filter((item) => {
    const matchesSearch =
      item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.asalDaerah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kampung &&
        item.kampung.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.pjAvNama &&
        item.pjAvNama.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrik =
      filterDistrik === "all" || item.asalDaerah === filterDistrik;

    const matchesKampung =
      filterKampung === "all" || item.kampung === filterKampung;

    const matchesGender =
      filterGender === "all" || item.gender === filterGender;

    let matchesUsia = true;
    if (filterUsia === "santunan_aktif") {
      matchesUsia = item.usia < 15;
    } else if (filterUsia === "batas_usia") {
      matchesUsia = item.usia >= 15;
    } else if (filterUsia === "balita") {
      matchesUsia = item.usia < 7;
    } else if (filterUsia === "sd") {
      matchesUsia = item.usia >= 7 && item.usia <= 12;
    } else if (filterUsia === "smp") {
      matchesUsia = item.usia >= 13 && item.usia <= 14;
    } else if (filterUsia === "sma") {
      matchesUsia = item.usia >= 15 && item.usia <= 18;
    } else if (filterUsia === "dewasa") {
      matchesUsia = item.usia > 18;
    }

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    const matchesVerif =
      filterVerif === "all" || item.statusVerifikasi === filterVerif;

    return (
      matchesSearch &&
      matchesDistrik &&
      matchesKampung &&
      matchesGender &&
      matchesUsia &&
      matchesStatus &&
      matchesVerif
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDistrik = isCustomDistrik ? customDistrikName.trim() : formData.asalDaerah;
    const finalKampung = isCustomKampung ? customKampungName.trim() : formData.kampung;

    if (finalKampung && finalDistrik) {
      addKampung(finalKampung, finalDistrik, formData.kabupaten);
      setDistriksList(getStoredDistriks());
      setKampungsList(getStoredKampungs());
    }

    const matchedAV = initialAVs.find((av) => av.nama === formData.pjAvNama);

    const newRecord: OrphanRecord = {
      id: `YTM-00${orphans.length + 1}`,
      namaLengkap: formData.namaLengkap,
      namaPanggilan: formData.namaPanggilan || formData.namaLengkap.split(" ")[0],
      gender: formData.gender,
      usia: Number(formData.usia),
      status: formData.status,
      asalDaerah: finalDistrik,
      kabupaten: formData.kabupaten,
      kampung: finalKampung,
      pjAvId: matchedAV ? matchedAV.id : undefined,
      pjAvNama: formData.pjAvNama || "Belum ditentukan",
      tempatTinggal: formData.tempatTinggal,
      wali: formData.wali || "Keluarga Asuh",
      jenjangPendidikan: formData.jenjangPendidikan,
      kebutuhanMendesak: formData.kebutuhanMendesak,
      statusVerifikasi: formData.statusVerifikasi,
      tanggalMasuk: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    };

    const updated = [newRecord, ...orphans];
    setOrphans(updated);
    saveStoredOrphans(updated);
    setIsAddModalOpen(false);
    setIsCustomDistrik(false);
    setIsCustomKampung(false);
    setCustomDistrikName("");
    setCustomKampungName("");
    // Reset Form
    setFormData({
      namaLengkap: "",
      namaPanggilan: "",
      gender: "L",
      usia: 10,
      status: "Yatim",
      asalDaerah: "Distrik Merauke",
      kabupaten: "Kab. Merauke",
      kampung: "Kampung Wasur",
      pjAvNama: "Yohanes Gebze",
      tempatTinggal: "Asrama SFY Merauke",
      wali: "",
      jenjangPendidikan: "SD Kelas 4",
      kebutuhanMendesak: "Seragam & Buku Pelajaran",
      statusVerifikasi: "Menunggu Survei",
    });
  };

  const handleToggleVerif = (id: string) => {
    setOrphans((prev) => {
      const nextList: OrphanRecord[] = prev.map((item) => {
        if (item.id === id) {
          const nextStatus: OrphanRecord["statusVerifikasi"] =
            item.statusVerifikasi === "Terverifikasi"
              ? "Perlu Pembaruan"
              : item.statusVerifikasi === "Perlu Pembaruan"
              ? "Menunggu Survei"
              : "Terverifikasi";
          return { ...item, statusVerifikasi: nextStatus };
        }
        return item;
      });
      saveStoredOrphans(nextList);
      return nextList;
    });

    if (selectedOrphan && selectedOrphan.id === id) {
      setSelectedOrphan((prev) =>
        prev
          ? {
              ...prev,
              statusVerifikasi:
                prev.statusVerifikasi === "Terverifikasi"
                  ? "Perlu Pembaruan"
                  : prev.statusVerifikasi === "Perlu Pembaruan"
                  ? "Menunggu Survei"
                  : "Terverifikasi",
            }
          : null
      );
    }
  };

  const handleOpenEdit = (orphan: OrphanRecord) => {
    setEditingOrphan(orphan);
    setEditFormData({
      namaLengkap: orphan.namaLengkap,
      namaPanggilan: orphan.namaPanggilan,
      gender: orphan.gender,
      usia: orphan.usia,
      status: orphan.status,
      asalDaerah: orphan.asalDaerah,
      kabupaten: orphan.kabupaten,
      kampung: orphan.kampung || "",
      pjAvNama: orphan.pjAvNama || "",
      tempatTinggal: orphan.tempatTinggal,
      wali: orphan.wali,
      jenjangPendidikan: orphan.jenjangPendidikan,
      kebutuhanMendesak: orphan.kebutuhanMendesak,
      statusVerifikasi: orphan.statusVerifikasi,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrphan) return;

    const matchedAV = initialAVs.find((av) => av.nama === editFormData.pjAvNama);

    const updatedList = orphans.map((o) => {
      if (o.id === editingOrphan.id) {
        return {
          ...o,
          namaLengkap: editFormData.namaLengkap.trim(),
          namaPanggilan:
            editFormData.namaPanggilan.trim() ||
            editFormData.namaLengkap.trim().split(" ")[0],
          gender: editFormData.gender,
          usia: editFormData.usia,
          status: editFormData.status,
          asalDaerah: editFormData.asalDaerah,
          kabupaten: editFormData.kabupaten,
          kampung: editFormData.kampung,
          pjAvId: matchedAV ? matchedAV.id : o.pjAvId,
          pjAvNama: matchedAV ? matchedAV.nama : editFormData.pjAvNama,
          tempatTinggal: editFormData.tempatTinggal.trim(),
          wali: editFormData.wali.trim(),
          jenjangPendidikan: editFormData.jenjangPendidikan.trim(),
          kebutuhanMendesak: editFormData.kebutuhanMendesak.trim(),
          statusVerifikasi: editFormData.statusVerifikasi,
        };
      }
      return o;
    });

    setOrphans(updatedList);
    saveStoredOrphans(updatedList);
    if (selectedOrphan && selectedOrphan.id === editingOrphan.id) {
      const updatedItem = updatedList.find((o) => o.id === editingOrphan.id);
      if (updatedItem) setSelectedOrphan(updatedItem);
    }
    setEditingOrphan(null);
  };

  const handleSoftDelete = (orphan: OrphanRecord) => {
    const updated = orphans.map((o) => {
      if (o.id === orphan.id) {
        return {
          ...o,
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
      return o;
    });
    setOrphans(updated);
    saveStoredOrphans(updated);
    if (selectedOrphan?.id === orphan.id) setSelectedOrphan(null);
    setSoftDeleteTarget(null);
  };

  const handleRestore = (id: string) => {
    const updated = orphans.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          isDeleted: false,
          deletedAt: undefined,
        };
      }
      return o;
    });
    setOrphans(updated);
    saveStoredOrphans(updated);
  };

  const handlePermanentDelete = (id: string) => {
    const updated = orphans.filter((o) => o.id !== id);
    setOrphans(updated);
    saveStoredOrphans(updated);
    if (selectedOrphan?.id === id) setSelectedOrphan(null);
    setPermanentDeleteTarget(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Lengkap",
      "Gender",
      "Usia",
      "Status Santunan",
      "Status",
      "Distrik",
      "Kabupaten",
      "Tempat Tinggal",
      "Wali",
      "Pendidikan",
      "Kebutuhan Mendesak",
      "Status Verifikasi",
    ];

    const rows = filteredOrphans.map((o) => [
      o.id,
      `"${o.namaLengkap}"`,
      o.gender,
      o.usia,
      o.usia >= 15 ? '"Non-Santunan (Batas Usia ≥15 th)"' : '"Penerima Santunan (<15 th)"',
      o.status,
      `"${o.asalDaerah}"`,
      `"${o.kabupaten}"`,
      `"${o.tempatTinggal}"`,
      `"${o.wali}"`,
      `"${o.jenjangPendidikan}"`,
      `"${o.kebutuhanMendesak}"`,
      o.statusVerifikasi,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_anak_yatim_sfy_papua.csv");
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
            Pendataan Anak Yatim Papua
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
            <span>Tambah Data Anak Yatim</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Santri Yatim
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeOrphans.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Anak</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Terverifikasi</span>
            <span className="font-semibold text-stone-700">
              {activeOrphans.filter((o) => o.statusVerifikasi === "Terverifikasi").length} Santri
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Status Yatim Piatu
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeOrphans.filter((o) => o.status === "Yatim Piatu").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Anak</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Yatim / Piatu</span>
            <span className="font-semibold text-stone-700">
              {activeOrphans.filter((o) => o.status !== "Yatim Piatu").length} Anak
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Kelayakan Santunan (&lt;15 Th)
          </p>
          <p className="text-2xl font-extrabold text-emerald-700 my-2">
            {activeOrphans.filter((o) => o.usia < 15).length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Santunan Aktif</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Batas Usia (≥15 th)</span>
            <span className="font-semibold text-rose-600">
              {activeOrphans.filter((o) => o.usia >= 15).length} Non-Santunan
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Menunggu Survei
          </p>
          <p className="text-2xl font-extrabold text-amber-600 my-2">
            {
              activeOrphans.filter((o) => o.statusVerifikasi === "Menunggu Survei")
                .length
            }{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Anak</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Perlu Pembaruan</span>
            <span className="font-semibold text-rose-600">
              {activeOrphans.filter((o) => o.statusVerifikasi === "Perlu Pembaruan").length} Anak
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        {/* Row 1: Search & Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama santri, ID, kampung, distrik, atau PJ AV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 transition-colors shrink-0 cursor-pointer"
              title="Reset semua filter ke default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Row 2: Grid of filters (Distrik, Kampung, Usia, Gender, Status Yatim, Verifikasi) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-stone-100 text-xs">
          {/* Filter Distrik */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Distrik
            </label>
            <select
              value={filterDistrik}
              onChange={(e) => setFilterDistrik(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Distrik</option>
              {uniqueDistriks.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kampung */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Kampung
            </label>
            <select
              value={filterKampung}
              onChange={(e) => setFilterKampung(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Kampung</option>
              {uniqueKampungs.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Usia */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Rentang Usia & Santunan
            </label>
            <select
              value={filterUsia}
              onChange={(e) => setFilterUsia(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Usia</option>
              <option value="santunan_aktif">&lt; 15 th (Penerima Santunan)</option>
              <option value="batas_usia">≥ 15 th (Batas Usia / Non-Santunan)</option>
              <option value="balita">&lt; 7 th (Balita/PAUD)</option>
              <option value="sd">7 - 12 th (Usia SD)</option>
              <option value="smp">13 - 14 th (Usia SMP)</option>
              <option value="sma">15 - 18 th (Usia SMA)</option>
              <option value="dewasa">&gt; 18 th</option>
            </select>
          </div>

          {/* Filter Gender */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Jenis Kelamin
            </label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Gender</option>
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          {/* Filter Status Yatim */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Status Yatim
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Status</option>
              <option value="Yatim">Yatim</option>
              <option value="Piatu">Piatu</option>
              <option value="Yatim Piatu">Yatim Piatu</option>
            </select>
          </div>

          {/* Filter Status Verifikasi */}
          <div>
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              Verifikasi
            </label>
            <select
              value={filterVerif}
              onChange={(e) => setFilterVerif(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Status</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Menunggu Survei">Menunggu Survei</option>
              <option value="Perlu Pembaruan">Perlu Pembaruan</option>
            </select>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <span>
            Menampilkan <strong>{filteredOrphans.length}</strong> dari <strong>{orphans.length}</strong> santri yatim
          </span>
          {isFilterActive && (
            <span className="text-[11px] text-[#823296] font-medium">
              Filter aktif diterapkan
            </span>
          )}
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
            Data Aktif ({activeOrphans.length})
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
            <span>Kotak Sampah ({deletedOrphans.length})</span>
          </button>
        </div>
        {viewTrash && (
          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
            Menampilkan data santri yang dihapus sementara (Soft Delete). Anda dapat memulihkannya kapan saja.
          </span>
        )}
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-[16%] min-w-[150px]">Nama Santri</th>
                <th className="py-3.5 px-3 w-[14%] min-w-[130px]">Usia & Santunan</th>
                <th className="py-3.5 px-3 w-[10%] min-w-[95px]">Status</th>
                <th className="py-3.5 px-3 w-[15%] min-w-[140px]">Domisili Papua</th>
                <th className="py-3.5 px-3 w-[14%] min-w-[135px]">Tempat Tinggal</th>
                <th className="py-3.5 px-3 w-[12%] min-w-[110px]">Pendidikan</th>
                <th className="py-3.5 px-3 w-[15%] min-w-[130px]">Kebutuhan Prioritas</th>
                <th className="py-3.5 px-3 w-[10%] min-w-[100px] text-center">Verifikasi</th>
                <th className="py-3.5 px-4 w-[11%] min-w-[125px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrphans.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan data anak yatim yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrphans.map((orphan) => (
                  <tr
                    key={orphan.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">
                        {orphan.namaLengkap}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-stone-800 text-xs font-semibold">
                          {orphan.usia} th ({orphan.gender === "L" ? "L" : "P"})
                        </span>
                        {orphan.usia >= 15 ? (
                          <span
                            title="Usia 15 tahun ke atas: Melewati batas usia santunan SFY"
                            className="inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                          >
                            ≥15 th • Non-Santunan
                          </span>
                        ) : (
                          <span
                            title="Memenuhi syarat batas usia santunan SFY (< 15 tahun)"
                            className="inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700"
                          >
                            Santunan Aktif
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          orphan.status === "Yatim Piatu"
                            ? "bg-purple-100 text-purple-800"
                            : orphan.status === "Yatim"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {orphan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-800">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{orphan.kampung ? `${orphan.kampung}, ${orphan.asalDaerah}` : orphan.asalDaerah}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-xs text-stone-800">
                        {orphan.tempatTinggal}
                      </p>
                      {orphan.pjAvNama && orphan.pjAvNama !== "Belum ditentukan" && (
                        <p className="text-[11px] text-[#5E2276] font-medium mt-0.5">
                          PJ: {orphan.pjAvNama}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-700">
                      {orphan.jenjangPendidikan}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block text-xs bg-amber-50 text-amber-800 border border-amber-200/70 px-2 py-0.5 rounded max-w-[180px] truncate">
                        {orphan.kebutuhanMendesak}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleVerif(orphan.id)}
                        title="Klik untuk mengubah status verifikasi"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${
                          orphan.statusVerifikasi === "Terverifikasi"
                            ? "bg-emerald-100 text-emerald-800"
                            : orphan.statusVerifikasi === "Menunggu Survei"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {orphan.statusVerifikasi === "Terverifikasi" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : orphan.statusVerifikasi === "Menunggu Survei" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>{orphan.statusVerifikasi}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {viewTrash ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRestore(orphan.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                            title="Pulihkan Data Santri"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Pulihkan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPermanentDeleteTarget(orphan)}
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
                            onClick={() => setSelectedOrphan(orphan)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors cursor-pointer"
                            title="Lihat Detail Santri"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(orphan)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Edit Data Santri"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSoftDeleteTarget(orphan)}
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
      {selectedOrphan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#823296] bg-purple-50 px-2 py-0.5 rounded">
                  {selectedOrphan.id}
                </span>
                <h3 className="text-lg font-bold text-stone-900">
                  {selectedOrphan.namaLengkap}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrphan(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl">
                <div>
                  <span className="text-stone-500">Status Yatim:</span>
                  <p className="font-semibold text-stone-900 text-sm mt-0.5">
                    {selectedOrphan.status}
                  </p>
                </div>
                <div>
                  <span className="text-stone-500">Usia & Kelamin:</span>
                  <p className="font-semibold text-stone-900 text-sm mt-0.5">
                    {selectedOrphan.usia} Tahun (
                    {selectedOrphan.gender === "L" ? "Laki-laki" : "Perempuan"})
                  </p>
                </div>
                <div>
                  <span className="text-stone-500">Pendidikan:</span>
                  <p className="font-semibold text-stone-900 mt-0.5">
                    {selectedOrphan.jenjangPendidikan}
                  </p>
                </div>
                <div>
                  <span className="text-stone-500">Tanggal Terdaftar:</span>
                  <p className="font-semibold text-stone-900 mt-0.5">
                    {selectedOrphan.tanggalMasuk}
                  </p>
                </div>
              </div>

              {/* Status Kelayakan Santunan Berdasarkan Batas Usia 15 Tahun */}
              <div
                className={`p-3 rounded-xl border ${
                  selectedOrphan.usia >= 15
                    ? "bg-rose-50/70 border-rose-200 text-rose-900"
                    : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide">
                    {selectedOrphan.usia >= 15
                      ? "Melewati Batas Usia Santunan (≥ 15 Tahun)"
                      : "Penerima Santunan Aktif (< 15 Tahun)"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedOrphan.usia >= 15
                        ? "bg-rose-200 text-rose-900"
                        : "bg-emerald-200 text-emerald-900"
                    }`}
                  >
                    {selectedOrphan.usia >= 15 ? "Non-Santunan" : "Layak Santunan"}
                  </span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                  {selectedOrphan.usia >= 15
                    ? `Santri berusia ${selectedOrphan.usia} tahun telah melewati batas maksimal usia santunan yayasan (15 tahun). Sesuai ketentuan, alokasi santunan rutin dihentikan dan dialihkan ke program kemandirian santri.`
                    : `Santri berusia ${selectedOrphan.usia} tahun memenuhi kualifikasi batas usia santunan SFY (maksimal 14 tahun). Santri berhak menerima alokasi santunan dan perlengkapan rutin yayasan.`}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-stone-500">Domisili & Asal:</span>
                <p className="font-medium text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#823296]" />
                  <span>
                    {selectedOrphan.kampung ? `${selectedOrphan.kampung}, ` : ""}
                    {selectedOrphan.asalDaerah}, {selectedOrphan.kabupaten}
                  </span>
                </p>
              </div>

              {/* Penanggung Jawab AV Box */}
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-950 flex items-center gap-1.5 text-xs">
                    <MapPinHouse className="w-4 h-4 text-[#823296]" />
                    <span>Koordinator Lapangan (PJ AV):</span>
                  </span>
                  <Link
                    href="/admin/av"
                    className="text-[11px] font-semibold text-[#823296] hover:underline"
                  >
                    Buka Data AV →
                  </Link>
                </div>
                <p className="text-stone-900 font-bold mt-1 text-sm">
                  {selectedOrphan.pjAvNama || "Belum ditentukan"}
                </p>
                {selectedOrphan.kampung && (
                  <p className="text-stone-600 text-xs mt-0.5">
                    Kampung Posko: {selectedOrphan.kampung}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-stone-500">Tempat Tinggal & Pengasuh:</span>
                <p className="font-medium text-stone-900">
                  {selectedOrphan.tempatTinggal} — Wali: {selectedOrphan.wali}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-semibold text-amber-900 block">
                  Kebutuhan Mendesak Santri:
                </span>
                <p className="text-amber-800 mt-1 font-medium">
                  {selectedOrphan.kebutuhanMendesak}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <span className="text-stone-600">Status Validasi Berkas:</span>
                <button
                  type="button"
                  onClick={() => handleToggleVerif(selectedOrphan.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                    selectedOrphan.statusVerifikasi === "Terverifikasi"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedOrphan.statusVerifikasi} (Klik untuk ubah)
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(selectedOrphan);
                    setSelectedOrphan(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Data Santri</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSoftDeleteTarget(selectedOrphan);
                    setSelectedOrphan(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrphan(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                Tambah Data Santri Anak Yatim
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama santri..."
                    value={formData.namaLengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, namaLengkap: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    placeholder="Panggilan..."
                    value={formData.namaPanggilan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        namaPanggilan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "L" | "P",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Usia (Tahun)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.usia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usia: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Status Yatim
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "Yatim"
                          | "Piatu"
                          | "Yatim Piatu",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Yatim">Yatim</option>
                    <option value="Piatu">Piatu</option>
                    <option value="Yatim Piatu">Yatim Piatu</option>
                  </select>
                </div>
              </div>

              {/* Santunan Status Indicator Banner */}
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  formData.usia >= 15
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                <div>
                  <p className="font-bold text-[11px]">
                    {formData.usia >= 15
                      ? `⚠️ Usia ${formData.usia} Tahun: Melewati Batas Usia Santunan (≥15 th)`
                      : `✓ Usia ${formData.usia} Tahun: Memenuhi Batas Usia Santunan (<15 th)`}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {formData.usia >= 15
                      ? "Santri 15 tahun ke atas tidak lagi dialokasikan santunan rutin yayasan."
                      : "Santri berhak mendapatkan alokasi paket santunan rutin SFY."}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    formData.usia >= 15
                      ? "bg-rose-100 text-rose-900 border border-rose-300"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  }`}
                >
                  {formData.usia >= 15 ? "Non-Santunan" : "Aktif Santunan"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-700 font-medium">
                      Distrik Asal *
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
                  {isCustomDistrik ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        required
                        placeholder="Ketik nama distrik baru..."
                        value={customDistrikName}
                        onChange={(e) => setCustomDistrikName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#823296] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomDistrik(false);
                          setCustomDistrikName("");
                        }}
                        className="px-2 py-2 text-[10px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg shrink-0 cursor-pointer"
                      >
                        Pilih
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={formData.asalDaerah}
                        onChange={(e) => {
                          const val = e.target.value;
                          const sel = distriksList.find((d) => d.nama === val);
                          setFormData({
                            ...formData,
                            asalDaerah: val,
                            kabupaten: sel ? sel.kabupaten : formData.kabupaten,
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-800"
                      >
                        {uniqueDistriks.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsCustomDistrik(true)}
                        className="px-2 py-2 text-[10px] font-semibold text-[#823296] bg-purple-50 hover:bg-purple-100 rounded-lg shrink-0 cursor-pointer"
                        title="Ketik distrik baru jika belum ada di database"
                      >
                        + Baru
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kabupaten (Papua Selatan)
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-700 font-medium">
                      Kampung Domisili *
                    </label>
                  </div>
                  {isCustomKampung ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        required
                        placeholder="Ketik nama kampung baru..."
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
                        {uniqueKampungs.map((k) => (
                          <option key={k} value={k}>
                            {k}
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

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Penanggung Jawab AV (Koordinator)
                  </label>
                  <select
                    value={formData.pjAvNama}
                    onChange={(e) =>
                      setFormData({ ...formData, pjAvNama: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="">-- Pilih Koordinator AV --</option>
                    {initialAVs.map((av) => (
                      <option key={av.id} value={av.nama}>
                        {av.nama} ({av.kampung})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Tempat Tinggal Saat Ini
                  </label>
                  <input
                    type="text"
                    placeholder="Asrama SFY / Keluarga Asuh..."
                    value={formData.tempatTinggal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tempatTinggal: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Wali / Pengasuh
                  </label>
                  <input
                    type="text"
                    placeholder="Nama wali..."
                    value={formData.wali}
                    onChange={(e) =>
                      setFormData({ ...formData, wali: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Jenjang & Sekolah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SD Kelas 4 MI Nurul Huda"
                  value={formData.jenjangPendidikan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jenjangPendidikan: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kebutuhan Mendesak
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Seragam, Sepatu, dan Kitab Iqro"
                  value={formData.kebutuhanMendesak}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kebutuhanMendesak: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
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
                  Simpan Santri Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Santri */}
      {editingOrphan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">
                Edit Data Anak Yatim / Santri
              </h2>
              <button
                type="button"
                onClick={() => setEditingOrphan(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
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
                    value={editFormData.namaLengkap}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        namaLengkap: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={editFormData.namaPanggilan}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        namaPanggilan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Gender *
                  </label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        gender: e.target.value as "L" | "P",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Usia (Tahun) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    required
                    value={editFormData.usia}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        usia: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Status Santri *
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value as OrphanRecord["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Yatim">Yatim</option>
                    <option value="Piatu">Piatu</option>
                    <option value="Yatim Piatu">Yatim Piatu</option>
                  </select>
                </div>
              </div>

              {/* Santunan Status Indicator Banner */}
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  editFormData.usia >= 15
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                <div>
                  <p className="font-bold text-[11px]">
                    {editFormData.usia >= 15
                      ? `⚠️ Usia ${editFormData.usia} Tahun: Melewati Batas Usia Santunan (≥15 th)`
                      : `✓ Usia ${editFormData.usia} Tahun: Memenuhi Batas Usia Santunan (<15 th)`}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {editFormData.usia >= 15
                      ? "Santri 15 tahun ke atas tidak lagi dialokasikan santunan rutin yayasan."
                      : "Santri berhak mendapatkan alokasi paket santunan rutin SFY."}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    editFormData.usia >= 15
                      ? "bg-rose-100 text-rose-900 border border-rose-300"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  }`}
                >
                  {editFormData.usia >= 15 ? "Non-Santunan" : "Aktif Santunan"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Distrik Asal *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.asalDaerah}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        asalDaerah: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kabupaten
                  </label>
                  <select
                    value={editFormData.kabupaten}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        kabupaten: e.target.value,
                      })
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kampung Domisili *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.kampung}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        kampung: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Penanggung Jawab AV
                  </label>
                  <select
                    value={editFormData.pjAvNama}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        pjAvNama: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="">-- Pilih Koordinator AV --</option>
                    {initialAVs.map((av) => (
                      <option key={av.id} value={av.nama}>
                        {av.nama} ({av.kampung})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Tempat Tinggal Saat Ini
                  </label>
                  <input
                    type="text"
                    value={editFormData.tempatTinggal}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        tempatTinggal: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nama Wali / Pengasuh
                  </label>
                  <input
                    type="text"
                    value={editFormData.wali}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        wali: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Jenjang & Sekolah
                  </label>
                  <input
                    type="text"
                    value={editFormData.jenjangPendidikan}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        jenjangPendidikan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Status Verifikasi
                  </label>
                  <select
                    value={editFormData.statusVerifikasi}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        statusVerifikasi: e.target.value as OrphanRecord["statusVerifikasi"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white font-medium"
                  >
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Menunggu Survei">Menunggu Survei</option>
                    <option value="Perlu Pembaruan">Perlu Pembaruan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kebutuhan Mendesak
                </label>
                <input
                  type="text"
                  value={editFormData.kebutuhanMendesak}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      kebutuhanMendesak: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingOrphan(null)}
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

      {/* Modal Konfirmasi Hapus Data (Soft Delete) */}
      {softDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Data Santri (Soft Delete)</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan data <strong>{softDeleteTarget.namaLengkap}</strong> ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Data tidak akan dihapus permanen dan dapat dipulihkan kapan saja melalui tab <strong>Kotak Sampah</strong>.
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
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Hapus Data Secara Permanen</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data <strong>{permanentDeleteTarget.namaLengkap}</strong> secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data santri ini akan dihapus sepenuhnya dari database lokal.
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
    </div>
  );
}

