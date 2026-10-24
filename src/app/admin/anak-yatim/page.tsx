"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  MapPin,
  MapPinHouse,
  RotateCcw,
} from "lucide-react";
import { initialOrphans, initialAVs, OrphanRecord } from "@/data/admin/adminData";

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

  // Add Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  // Dynamic filter lists from data
  const uniqueDistriks = useMemo(() => {
    const list = orphans.map((o) => o.asalDaerah).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [orphans]);

  const uniqueKampungs = useMemo(() => {
    const list = orphans
      .map((o) => o.kampung)
      .filter((k): k is string => Boolean(k));
    return Array.from(new Set(list)).sort();
  }, [orphans]);

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

  // Filtered List
  const filteredOrphans = orphans.filter((item) => {
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
    if (filterUsia === "balita") {
      matchesUsia = item.usia < 7;
    } else if (filterUsia === "sd") {
      matchesUsia = item.usia >= 7 && item.usia <= 12;
    } else if (filterUsia === "smp") {
      matchesUsia = item.usia >= 13 && item.usia <= 15;
    } else if (filterUsia === "sma") {
      matchesUsia = item.usia >= 16 && item.usia <= 18;
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
    const matchedAV = initialAVs.find((av) => av.nama === formData.pjAvNama);

    const newRecord: OrphanRecord = {
      id: `YTM-00${orphans.length + 1}`,
      namaLengkap: formData.namaLengkap,
      namaPanggilan: formData.namaPanggilan || formData.namaLengkap.split(" ")[0],
      gender: formData.gender,
      usia: Number(formData.usia),
      status: formData.status,
      asalDaerah: formData.asalDaerah,
      kabupaten: formData.kabupaten,
      kampung: formData.kampung,
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

    setOrphans([newRecord, ...orphans]);
    setIsAddModalOpen(false);
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
    setOrphans((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.statusVerifikasi === "Terverifikasi"
              ? "Perlu Pembaruan"
              : item.statusVerifikasi === "Perlu Pembaruan"
              ? "Menunggu Survei"
              : "Terverifikasi";
          return { ...item, statusVerifikasi: nextStatus };
        }
        return item;
      })
    );

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

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Lengkap",
      "Gender",
      "Usia",
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
    link.setAttribute("download", `data_anak_yatim_sfy_papua_${Date.now()}.csv`);
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
          <p className="text-sm text-stone-500 mt-0.5">
            Database santri binaan, yatim/piatu dhuafa, dan asrama SFY di berbagai distrik Papua.
          </p>
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

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Total Santri Yatim</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {orphans.length} Anak
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Status Yatim Piatu</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {orphans.filter((o) => o.status === "Yatim Piatu").length} Anak
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Asrama Binaan SFY</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {orphans.filter((o) => o.tempatTinggal.includes("Asrama")).length} Anak
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Menunggu Survei</p>
          <p className="text-xl font-bold text-amber-600 mt-0.5">
            {
              orphans.filter((o) => o.statusVerifikasi === "Menunggu Survei")
                .length
            }{" "}
            Anak
          </p>
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
              Rentang Usia
            </label>
            <select
              value={filterUsia}
              onChange={(e) => setFilterUsia(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700 truncate"
            >
              <option value="all">Semua Usia</option>
              <option value="balita">&lt; 7 th (Balita/PAUD)</option>
              <option value="sd">7 - 12 th (Usia SD)</option>
              <option value="smp">13 - 15 th (Usia SMP)</option>
              <option value="sma">16 - 18 th (Usia SMA)</option>
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

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ID & Nama Lengkap</th>
                <th className="py-3.5 px-3">Usia/JK</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Domisili Papua</th>
                <th className="py-3.5 px-3">Tempat Tinggal</th>
                <th className="py-3.5 px-3">Pendidikan</th>
                <th className="py-3.5 px-3">Kebutuhan Prioritas</th>
                <th className="py-3.5 px-3 text-center">Verifikasi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
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
                      <div>
                        <span className="font-mono text-[11px] font-semibold text-[#823296] bg-purple-50 px-1.5 py-0.5 rounded">
                          {orphan.id}
                        </span>
                        <p className="font-semibold text-stone-900 mt-1">
                          {orphan.namaLengkap}
                        </p>
                        <p className="text-xs text-stone-500">
                          Panggilan: &quot;{orphan.namaPanggilan}&quot;
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-stone-800 font-medium">
                        {orphan.usia} th
                      </span>
                      <span className="text-xs text-stone-400 block">
                        {orphan.gender === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
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
                      <div className="flex items-center gap-1 font-semibold text-stone-900 text-xs">
                        <MapPinHouse className="w-3.5 h-3.5 text-[#823296] shrink-0" />
                        <span>{orphan.kampung || orphan.asalDaerah}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-4">
                        {orphan.asalDaerah}, {orphan.kabupaten}
                      </p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-xs text-stone-800 font-medium">
                        {orphan.tempatTinggal}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Wali: {orphan.wali}
                      </p>
                      <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                        PJ AV: {orphan.pjAvNama || "Belum ada"}
                      </p>
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
                      <button
                        type="button"
                        onClick={() => setSelectedOrphan(orphan)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
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

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrphan(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Distrik Asal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Distrik Kurik / Tanah Miring"
                    value={formData.asalDaerah}
                    onChange={(e) =>
                      setFormData({ ...formData, asalDaerah: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
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
                  <label className="block text-stone-700 font-medium mb-1">
                    Kampung Domisili *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kampung Wasur / Urumb"
                    value={formData.kampung}
                    onChange={(e) =>
                      setFormData({ ...formData, kampung: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
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
    </div>
  );
}

