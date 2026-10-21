"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  X,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { initialVolunteers, VolunteerRecord } from "@/data/admin/adminData";

export default function RelawanAdminPage() {
  const [volunteers, setVolunteers] =
    useState<VolunteerRecord[]>(initialVolunteers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedVolunteer, setSelectedVolunteer] =
    useState<VolunteerRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    noTelepon: "",
    domisili: "",
    divisi: "Pendidikan & Bimbel" as VolunteerRecord["divisi"],
    keahlian: "",
    status: "Menunggu Verifikasi" as VolunteerRecord["status"],
  });

  const filteredVolunteers = volunteers.filter((item) => {
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

  const handleToggleStatus = (id: string) => {
    setVolunteers((prev) =>
      prev.map((item) => {
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
      })
    );

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

    setVolunteers([newRecord, ...volunteers]);
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
    link.setAttribute("download", `relawan_sfy_papua_${Date.now()}.csv`);
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
          <p className="text-sm text-stone-500 mt-0.5">
            Manajemen relawan pendamping santri yatim, tim logistik, dan tenaga medis di tanah Papua.
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
            <span>Tambah Relawan Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Total Personel</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {volunteers.length} Relawan
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Relawan Aktif</p>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">
            {volunteers.filter((v) => v.status === "Aktif").length} Orang
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Menunggu Verifikasi</p>
          <p className="text-xl font-bold text-amber-600 mt-0.5">
            {
              volunteers.filter((v) => v.status === "Menunggu Verifikasi")
                .length
            }{" "}
            Orang
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Divisi Pendidikan</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {
              volunteers.filter((v) => v.divisi === "Pendidikan & Bimbel")
                .length
            }{" "}
            Guru
          </p>
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

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Relawan & ID</th>
                <th className="py-3.5 px-3">Kontak WA & Email</th>
                <th className="py-3.5 px-3">Domisili Papua</th>
                <th className="py-3.5 px-3">Divisi Penugasan</th>
                <th className="py-3.5 px-3">Keahlian Lapangan</th>
                <th className="py-3.5 px-3">Tgl Gabung</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan data relawan yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {v.id}
                        </span>
                        <p className="font-semibold text-stone-900 mt-1">
                          {v.namaLengkap}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-xs font-mono font-medium text-stone-800">
                        {v.noTelepon}
                      </p>
                      <p className="text-[11px] text-stone-400">{v.email}</p>
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
                      {v.tanggalGabung}
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
                      <button
                        type="button"
                        onClick={() => setSelectedVolunteer(v)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                      >
                        <span>Profil</span>
                      </button>
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

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedVolunteer.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                >
                  Ubah Status: {selectedVolunteer.status}
                </button>
                <a
                  href={`https://wa.me/${selectedVolunteer.noTelepon.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hubungi WA</span>
                </a>
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
                    placeholder="Contoh: Sentani / Abepura"
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
    </div>
  );
}

