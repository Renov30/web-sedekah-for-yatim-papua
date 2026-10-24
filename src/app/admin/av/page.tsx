"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPinHouse,
  Search,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  GraduationCap,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { initialAVs, initialOrphans, AVRecord, OrphanRecord } from "@/data/admin/adminData";
import {
  getStoredDistriks,
  getStoredKampungs,
  addKampung,
  DistrikRecord,
  KampungRecord,
} from "@/lib/wilayah";

export default function AVAdminPage() {
  const [avList, setAvList] = useState<AVRecord[]>(initialAVs);
  const [orphans] = useState<OrphanRecord[]>(initialOrphans);
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

  // Filtered List
  const filteredAVs = avList.filter((item) => {
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

  // Unique villages count
  const uniqueKampungCount = new Set(avList.map((av) => av.kampung)).size;
  // Total orphans under AV supervision
  const totalOrphansSupervised = orphans.filter((o) => !!o.pjAvId).length;

  const handleToggleStatus = (id: string) => {
    setAvList((prev) =>
      prev.map((item) => {
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
      })
    );

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

    setAvList([newRecord, ...avList]);
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

    const rows = filteredAVs.map((av) => [
      av.id,
      `"${av.nama}"`,
      `"${av.noHp}"`,
      `"${av.kampung}"`,
      `"${av.distrik}"`,
      `"${av.kabupaten}"`,
      `"${av.alamat}"`,
      av.anakDampingan.length,
      `"${av.anakDampingan.join(", ")}"`,
      av.status,
      `"${av.tanggalBergabung}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_av_koordinator_kampung_sfy_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get orphan records under selected AV
  const getOrphansForAV = (avId: string) => {
    return orphans.filter((o) => o.pjAvId === avId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Pendataan Koordinator Lapangan (AV)
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Data Area Volunteer (PJ kampung) dan santri binaan di wilayah Merauke & sekitarnya.
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
            <span>Tambah Koordinator AV</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Total Koordinator AV</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {avList.length} Personel
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">AV Aktif Bertugas</p>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">
            {avList.filter((a) => a.status === "Aktif").length} Orang
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Kampung Terjangkau</p>
          <p className="text-xl font-bold text-[#823296] mt-0.5">
            {uniqueKampungCount} Kampung
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Santri Dampingan AV</p>
          <p className="text-xl font-bold text-blue-700 mt-0.5">
            {totalOrphansSupervised} Anak Yatim
          </p>
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
            {distriksList.map((d) => (
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

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Koordinator & ID</th>
                <th className="py-3.5 px-3">Kontak WA</th>
                <th className="py-3.5 px-3">Kampung & Distrik</th>
                <th className="py-3.5 px-3">Alamat Lengkap Posko</th>
                <th className="py-3.5 px-3">Anak Asuh (PJ)</th>
                <th className="py-3.5 px-3">Tgl Bergabung</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAVs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan data Koordinator AV yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredAVs.map((av) => (
                  <tr
                    key={av.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono text-[11px] font-semibold text-[#823296] bg-purple-50 px-1.5 py-0.5 rounded">
                          {av.id}
                        </span>
                        <p className="font-semibold text-stone-900 mt-1">
                          {av.nama}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
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
                      <div className="flex items-center gap-1.5">
                        <MapPinHouse className="w-3.5 h-3.5 text-[#823296] shrink-0" />
                        <span className="font-semibold text-stone-900 text-xs">
                          {av.kampung}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-5">
                        {av.distrik}, {av.kabupaten}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-600 max-w-[220px] truncate" title={av.alamat}>
                      {av.alamat}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            av.anakDampingan.length > 0
                              ? "bg-purple-100 text-purple-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {av.anakDampingan.length} Anak
                        </span>
                      </div>
                      {av.anakDampingan.length > 0 && (
                        <p className="text-[11px] text-stone-500 truncate max-w-[160px] mt-0.5">
                          {av.anakDampingan.join(", ")}
                        </p>
                      )}
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
                      <button
                        type="button"
                        onClick={() => setSelectedAV(av)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail & PJ</span>
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
                    {getOrphansForAV(selectedAV.id).length} Santri
                  </span>
                </div>

                {getOrphansForAV(selectedAV.id).length === 0 ? (
                  <p className="text-stone-500 p-3 bg-stone-50 rounded-xl text-center">
                    Belum ada anak yatim yang ditugaskan ke PJ AV ini.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getOrphansForAV(selectedAV.id).map((orphan) => (
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
                      <span>Master Wilayah</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                  <select
                    value={formData.distrik}
                    onChange={(e) => {
                      const sel = distriksList.find((d) => d.nama === e.target.value);
                      setFormData({
                        ...formData,
                        distrik: e.target.value,
                        kabupaten: sel ? sel.kabupaten : formData.kabupaten,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    {distriksList.map((d) => (
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
                        {kampungsList.map((k) => (
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
    </div>
  );
}

