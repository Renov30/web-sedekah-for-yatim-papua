"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  X,
  AlertCircle,
  CheckSquare,
} from "lucide-react";
import { initialVolunteers, VolunteerRecord } from "@/data/admin/adminData";
import {
  getStoredVolunteers,
  saveStoredVolunteers,
} from "@/lib/adminDataStore";

export default function RelawanAdminPage() {
  const [volunteers, setVolunteers] =
    useState<VolunteerRecord[]>(initialVolunteers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedVolunteer, setSelectedVolunteer] =
    useState<VolunteerRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewTrash, setViewTrash] = useState(false);
  const [softDeleteTarget, setSoftDeleteTarget] =
    useState<VolunteerRecord | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] =
    useState<VolunteerRecord | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkSoftDeleteModalOpen, setBulkSoftDeleteModalOpen] = useState(false);
  const [bulkPermanentDeleteModalOpen, setBulkPermanentDeleteModalOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setVolunteers(getStoredVolunteers());
    });
  }, []);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    noTelepon: "",
    domisili: "",
    divisi: "Pendidikan & Bimbel" as VolunteerRecord["divisi"],
    keahlian: "",
    status: "Menunggu Verifikasi" as VolunteerRecord["status"],
  });

  // Edit Modal State
  const [editingVolunteer, setEditingVolunteer] =
    useState<VolunteerRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    namaLengkap: "",
    email: "",
    noTelepon: "",
    domisili: "",
    divisi: "Pendidikan & Bimbel" as VolunteerRecord["divisi"],
    keahlian: "",
    status: "Aktif" as VolunteerRecord["status"],
  });

  const activeVolunteers = volunteers.filter((v) => !v.isDeleted);
  const deletedVolunteers = volunteers.filter((v) => v.isDeleted);

  const filteredVolunteers = (viewTrash ? deletedVolunteers : activeVolunteers).filter((item) => {
    const matchesSearch =
      item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domisili.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keahlian.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDivisi =
      filterDivisi === "all" || item.divisi === filterDivisi;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesDivisi && matchesStatus;
  });

  const handleSoftDelete = (volunteer: VolunteerRecord) => {
    const updated = volunteers.map((v) =>
      v.id === volunteer.id
        ? { ...v, isDeleted: true, deletedAt: new Date().toISOString() }
        : v
    );
    setVolunteers(updated);
    saveStoredVolunteers(updated);
    setSoftDeleteTarget(null);
    if (selectedVolunteer && selectedVolunteer.id === volunteer.id) {
      setSelectedVolunteer(null);
    }
  };

  const handleRestore = (volunteer: VolunteerRecord) => {
    const updated = volunteers.map((v) =>
      v.id === volunteer.id
        ? { ...v, isDeleted: false, deletedAt: undefined }
        : v
    );
    setVolunteers(updated);
    saveStoredVolunteers(updated);
  };

  const handlePermanentDelete = (id: string) => {
    const updated = volunteers.filter((v) => v.id !== id);
    setVolunteers(updated);
    saveStoredVolunteers(updated);
    setPermanentDeleteTarget(null);
    if (selectedVolunteer && selectedVolunteer.id === id) {
      setSelectedVolunteer(null);
    }
  };

  const isAllSelected =
    filteredVolunteers.length > 0 &&
    filteredVolunteers.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVolunteers.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkSoftDelete = () => {
    const now = new Date().toISOString();

    const updated = volunteers.map((v) => {
      if (selectedIds.includes(v.id)) {
        return {
          ...v,
          isDeleted: true,
          deletedAt: now,
        };
      }
      return v;
    });

    setVolunteers(updated);
    saveStoredVolunteers(updated);
    setSelectedIds([]);
    setBulkSoftDeleteModalOpen(false);
  };

  const handleBulkRestore = () => {
    const updated = volunteers.map((v) => {
      if (selectedIds.includes(v.id)) {
        return {
          ...v,
          isDeleted: false,
          deletedAt: undefined,
        };
      }
      return v;
    });

    setVolunteers(updated);
    saveStoredVolunteers(updated);
    setSelectedIds([]);
  };

  const handleBulkPermanentDelete = () => {
    const updated = volunteers.filter((v) => !selectedIds.includes(v.id));
    setVolunteers(updated);
    saveStoredVolunteers(updated);
    setSelectedIds([]);
    setBulkPermanentDeleteModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setVolunteers((prev) => {
      const nextList = prev.map((item) => {
        if (item.id === id) {
          const nextStatus: VolunteerRecord["status"] =
            item.status === "Aktif"
              ? "Cuti"
              : item.status === "Cuti"
              ? "Menunggu Verifikasi"
              : "Aktif";
          return { ...item, status: nextStatus };
        }
        return item;
      });
      saveStoredVolunteers(nextList);
      return nextList;
    });

    if (selectedVolunteer && selectedVolunteer.id === id) {
      setSelectedVolunteer((prev) =>
        prev
          ? {
              ...prev,
              status:
                prev.status === "Aktif"
                  ? "Cuti"
                  : prev.status === "Cuti"
                  ? "Menunggu Verifikasi"
                  : "Aktif",
            }
          : null
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VolunteerRecord = {
      id: `RLW-00${volunteers.length + 1}`,
      namaLengkap: formData.namaLengkap,
      email: formData.email,
      noTelepon: formData.noTelepon,
      domisili: formData.domisili,
      divisi: formData.divisi,
      keahlian: formData.keahlian,
      status: formData.status,
      tanggalGabung: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    };

    const updated = [newRecord, ...volunteers];
    setVolunteers(updated);
    saveStoredVolunteers(updated);
    setIsAddModalOpen(false);
    setFormData({
      namaLengkap: "",
      email: "",
      noTelepon: "",
      domisili: "",
      divisi: "Pendidikan & Bimbel",
      keahlian: "",
      status: "Menunggu Verifikasi",
    });
  };

  const handleOpenEdit = (v: VolunteerRecord) => {
    setEditingVolunteer(v);
    setEditFormData({
      namaLengkap: v.namaLengkap,
      email: v.email,
      noTelepon: v.noTelepon,
      domisili: v.domisili,
      divisi: v.divisi,
      keahlian: v.keahlian,
      status: v.status,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVolunteer) return;

    const updated = volunteers.map((v) => {
      if (v.id === editingVolunteer.id) {
        return {
          ...v,
          namaLengkap: editFormData.namaLengkap.trim(),
          email: editFormData.email.trim(),
          noTelepon: editFormData.noTelepon.trim(),
          domisili: editFormData.domisili.trim(),
          divisi: editFormData.divisi,
          keahlian: editFormData.keahlian.trim(),
          status: editFormData.status,
        };
      }
      return v;
    });

    setVolunteers(updated);
    saveStoredVolunteers(updated);
    if (selectedVolunteer && selectedVolunteer.id === editingVolunteer.id) {
      const updatedItem = updated.find((v) => v.id === editingVolunteer.id);
      if (updatedItem) setSelectedVolunteer(updatedItem);
    }
    setEditingVolunteer(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Lengkap",
      "Email",
      "No Telepon",
      "Domisili",
      "Divisi",
      "Keahlian",
      "Status",
      "Tanggal Gabung",
    ];

    const rows = filteredVolunteers.map((v) => [
      v.id,
      `"${v.namaLengkap}"`,
      v.email,
      v.noTelepon,
      `"${v.domisili}"`,
      `"${v.divisi}"`,
      `"${v.keahlian}"`,
      v.status,
      `"${v.tanggalGabung}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_relawan_sfy_papua.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Pendataan Relawan Lapangan
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
            <span>Tambah Relawan Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Personel
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {activeVolunteers.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Relawan</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Terdaftar di SFY</span>
            <span className="font-semibold text-stone-700">Semua Wilayah</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Relawan Aktif
          </p>
          <p className="text-2xl font-extrabold text-emerald-700 my-2">
            {activeVolunteers.filter((v) => v.status === "Aktif").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Orang</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Siap Bertugas</span>
            <span className="font-semibold text-stone-700">Lapangan & Posko</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Menunggu Verifikasi
          </p>
          <p className="text-2xl font-extrabold text-amber-600 my-2">
            {
              activeVolunteers.filter((v) => v.status === "Menunggu Verifikasi")
                .length
            }{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Orang</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Pendaftar Baru</span>
            <span className="font-semibold text-amber-700">Perlu Review</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Divisi Pendidikan
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {
              activeVolunteers.filter((v) => v.divisi === "Pendidikan & Bimbel")
                .length
            }{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Guru</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Divisi Lainnya</span>
            <span className="font-semibold text-stone-700">
              {activeVolunteers.filter((v) => v.divisi !== "Pendidikan & Bimbel").length} Relawan
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama relawan, email, domisili, atau keahlian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          <select
            value={filterDivisi}
            onChange={(e) => setFilterDivisi(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Divisi Relawan</option>
            <option value="Pendidikan & Bimbel">Pendidikan & Bimbel</option>
            <option value="Distribusi & Logistik">Distribusi & Logistik</option>
            <option value="Kesehatan & Gizi">Kesehatan & Gizi</option>
            <option value="Media & Publikasi">Media & Publikasi</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Cuti">Cuti</option>
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
            Data Aktif ({activeVolunteers.length})
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
            <span>Kotak Sampah ({deletedVolunteers.length})</span>
          </button>
        </div>
        {viewTrash && (
          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
            Menampilkan data relawan yang dihapus sementara (Soft Delete). Anda dapat memulihkannya kapan saja.
          </span>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-red-900 font-semibold">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedIds.length} data relawan terpilih</span>
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
                <th className="py-3.5 px-4 w-[20%] min-w-[160px]">Nama Relawan</th>
                <th className="py-3.5 px-3 w-[15%] min-w-[130px]">Kontak WA & Email</th>
                <th className="py-3.5 px-3 w-[18%] min-w-[150px]">Domisili Papua</th>
                <th className="py-3.5 px-3 w-[16%] min-w-[130px]">Divisi Penugasan</th>
                <th className="py-3.5 px-3 w-[16%] min-w-[130px]">Keahlian Lapangan</th>
                <th className="py-3.5 px-3 w-[11%] min-w-[100px]">{viewTrash ? "Tgl Dihapus" : "Tgl Gabung"}</th>
                <th className="py-3.5 px-3 w-[8%] min-w-[80px] text-center">Status</th>
                <th className="py-3.5 px-4 w-[10%] min-w-[120px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    {viewTrash
                      ? "Kotak sampah kosong. Tidak ada data relawan yang terhapus."
                      : "Tidak ditemukan data relawan yang sesuai."}
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((v) => (
                  <tr
                    key={v.id}
                    className={`hover:bg-purple-50/20 transition-colors ${
                      selectedIds.includes(v.id) ? "bg-purple-50/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(v.id)}
                        onChange={() => toggleSelectRow(v.id)}
                        className="w-4 h-4 rounded border-stone-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-stone-900 block">
                        {v.namaLengkap}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-mono font-medium text-stone-800">
                      {v.noTelepon}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{v.domisili}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#823296] border border-purple-100">
                        {v.divisi}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-600 max-w-[200px] truncate">
                      {v.keahlian}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-500">
                      {viewTrash && v.deletedAt
                        ? new Intl.DateTimeFormat("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(v.deletedAt))
                        : v.tanggalGabung}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(v.id)}
                        title="Klik untuk mengubah status keaktifan relawan"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${
                          v.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : v.status === "Menunggu Verifikasi"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {v.status === "Aktif" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : v.status === "Menunggu Verifikasi" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span>{v.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {viewTrash ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRestore(v)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Pulihkan Relawan"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Pulihkan</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPermanentDeleteTarget(v)}
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
                            onClick={() => setSelectedVolunteer(v)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                            title="Lihat Profil"
                          >
                            <span>Profil</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(v)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Edit Data Relawan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSoftDeleteTarget(v)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedVolunteer.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  {selectedVolunteer.namaLengkap}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVolunteer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Divisi Tugas:</span>
                  <span className="font-bold text-[#823296]">
                    {selectedVolunteer.divisi}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Keaktifan:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedVolunteer.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tanggal Bergabung:</span>
                  <span className="font-medium text-stone-700">
                    {selectedVolunteer.tanggalGabung}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">
                  Kontak Resmi:
                </span>
                <div className="space-y-1 text-stone-800 font-medium">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {selectedVolunteer.noTelepon}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    {selectedVolunteer.email}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">
                  Keahlian & Pengalaman:
                </span>
                <p className="p-2.5 bg-purple-50/60 rounded-lg text-stone-800 border border-purple-100">
                  {selectedVolunteer.keahlian}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedVolunteer.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer"
                >
                  Ubah Status: {selectedVolunteer.status}
                </button>
                <div className="flex items-center gap-2">
                  {!selectedVolunteer.isDeleted && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedVolunteer;
                        setSelectedVolunteer(null);
                        setSoftDeleteTarget(target);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(selectedVolunteer)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-[#823296] hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Data</span>
                  </button>
                  <a
                    href={`https://wa.me/${selectedVolunteer.noTelepon.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi WA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Tambah Relawan Lapangan Baru
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
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama relawan..."
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    setFormData({ ...formData, namaLengkap: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    No. WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={formData.noTelepon}
                    onChange={(e) =>
                      setFormData({ ...formData, noTelepon: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@..."
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Domisili Papua
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Merauke / Tanah Miring"
                    value={formData.domisili}
                    onChange={(e) =>
                      setFormData({ ...formData, domisili: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Divisi Penugasan
                  </label>
                  <select
                    value={formData.divisi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        divisi: e.target.value as VolunteerRecord["divisi"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Pendidikan & Bimbel">Pendidikan & Bimbel</option>
                    <option value="Distribusi & Logistik">Distribusi & Logistik</option>
                    <option value="Kesehatan & Gizi">Kesehatan & Gizi</option>
                    <option value="Media & Publikasi">Media & Publikasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Keahlian / Profesi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pengajar Matematika / Perawat Anak"
                  value={formData.keahlian}
                  onChange={(e) =>
                    setFormData({ ...formData, keahlian: e.target.value })
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
                  Simpan Relawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {editingVolunteer.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  Edit Data Relawan Lapangan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingVolunteer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Lengkap Relawan *
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    No Telepon / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.noTelepon}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        noTelepon: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Domisili Papua *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.domisili}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        domisili: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Divisi Penugasan *
                  </label>
                  <select
                    value={editFormData.divisi}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        divisi: e.target.value as VolunteerRecord["divisi"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white font-medium"
                  >
                    <option value="Pendidikan & Bimbel">Pendidikan & Bimbel</option>
                    <option value="Distribusi & Logistik">Distribusi & Logistik</option>
                    <option value="Kesehatan & Gizi">Kesehatan & Gizi</option>
                    <option value="Media & Publikasi">Media & Publikasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Keahlian / Profesi
                </label>
                <input
                  type="text"
                  value={editFormData.keahlian}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      keahlian: e.target.value,
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
                      status: e.target.value as VolunteerRecord["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white font-medium"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Cuti">Cuti</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingVolunteer(null)}
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

      {/* Modal Konfirmasi Hapus Data Relawan (Soft Delete) */}
      {softDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Data Relawan (Soft Delete)</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan data relawan <strong>{softDeleteTarget.namaLengkap}</strong> ({softDeleteTarget.divisi}) ke Kotak Sampah?
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
              Apakah Anda yakin ingin menghapus data relawan <strong>{permanentDeleteTarget.namaLengkap}</strong> secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data relawan ini akan dihapus sepenuhnya dari database lokal.
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
              <span>Hapus {selectedIds.length} Data Relawan Sekaligus</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan <strong>{selectedIds.length} data relawan</strong> yang dipilih ke Kotak Sampah?
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
              <span>Hapus Permanen {selectedIds.length} Relawan</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{selectedIds.length} data relawan</strong> yang dipilih secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat data relawan ini akan dihapus sepenuhnya dari database lokal.
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

