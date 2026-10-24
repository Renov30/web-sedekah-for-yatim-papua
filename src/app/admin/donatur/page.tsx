"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Building2,
  User,
  ShieldCheck,
  X,
} from "lucide-react";
import { initialDonors, DonorRecord } from "@/data/admin/adminData";

export default function DonaturAdminPage() {
  const [donors, setDonors] = useState<DonorRecord[]>(initialDonors);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipe, setFilterTipe] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedDonor, setSelectedDonor] = useState<DonorRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    tipe: "Individu" as DonorRecord["tipe"],
    email: "",
    noTelepon: "",
    totalDonasi: 1000000,
    jumlahFrekuensi: 1,
    programFavorit: "Pendidikan Santri Papua",
    status: "Donatur Rutin" as DonorRecord["status"],
  });

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.noTelepon.includes(searchQuery);

    const matchesTipe = filterTipe === "all" || d.tipe === filterTipe;
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;

    return matchesSearch && matchesTipe && matchesStatus;
  });

  const totalAccumulated = donors.reduce((sum, d) => sum + d.totalDonasi, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DonorRecord = {
      id: `DNR-00${donors.length + 1}`,
      nama: formData.nama,
      tipe: formData.tipe,
      email: formData.email,
      noTelepon: formData.noTelepon,
      totalDonasi: Number(formData.totalDonasi),
      jumlahFrekuensi: Number(formData.jumlahFrekuensi),
      programFavorit: formData.programFavorit,
      status: formData.status,
      tanggalTerakhir: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    };

    setDonors([newRecord, ...donors]);
    setIsAddModalOpen(false);
    setFormData({
      nama: "",
      tipe: "Individu",
      email: "",
      noTelepon: "",
      totalDonasi: 1000000,
      jumlahFrekuensi: 1,
      programFavorit: "Pendidikan Santri Papua",
      status: "Donatur Rutin",
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Donatur",
      "Kategori",
      "Email",
      "No Telepon",
      "Total Donasi (Rp)",
      "Frekuensi",
      "Program Favorit",
      "Status",
      "Tanggal Terakhir",
    ];

    const rows = filteredDonors.map((d) => [
      d.id,
      `"${d.nama}"`,
      d.tipe,
      d.email,
      d.noTelepon,
      d.totalDonasi,
      d.jumlahFrekuensi,
      `"${d.programFavorit}"`,
      d.status,
      `"${d.tanggalTerakhir}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `database_donatur_sfy_${Date.now()}.csv`);
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
            Pendataan Donatur & Muzakki
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Rekap</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Donatur</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Donatur
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {donors.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Entitas</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Tercatat di Database</span>
            <span className="font-semibold text-stone-700">Aktif</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Donatur Rutin Bulanan
          </p>
          <p className="text-2xl font-extrabold text-emerald-700 my-2">
            {donors.filter((d) => d.status === "Donatur Rutin").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Orang</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Komitmen Donasi</span>
            <span className="font-semibold text-stone-700">Rutin</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Mitra Lembaga / CSR
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {
              donors.filter((d) => d.tipe === "Lembaga/Komunitas")
                .length
            }{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Lembaga</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Individu & Hamba Allah</span>
            <span className="font-semibold text-stone-700">
              {donors.filter((d) => d.tipe !== "Lembaga/Komunitas").length} Donatur
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Akumulasi Sedekah
          </p>
          <p className="text-2xl font-extrabold text-[#823296] font-mono my-2">
            Rp {(totalAccumulated / 1000000).toFixed(1)}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Juta</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Total Dihimpun</span>
            <span className="font-semibold text-stone-700">Tervalidasi</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama donatur, email, atau no HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          <select
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Kategori</option>
            <option value="Individu">Individu</option>
            <option value="Lembaga/Komunitas">Lembaga / Komunitas</option>
            <option value="Hamba Allah">Hamba Allah (Anonim)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Status</option>
            <option value="Donatur Rutin">Donatur Rutin</option>
            <option value="Donatur Insidental">Donatur Insidental</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Donatur & ID</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3">Kontak</th>
                <th className="py-3.5 px-3">Total Kontribusi</th>
                <th className="py-3.5 px-3 text-center">Frekuensi</th>
                <th className="py-3.5 px-3">Fokus Penyaluran</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Donasi Terakhir</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan data donatur yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                          {d.id}
                        </span>
                        <span className="font-semibold text-stone-900">
                          {d.nama}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                        {d.tipe === "Lembaga/Komunitas" ? (
                          <Building2 className="w-3 h-3 text-stone-500" />
                        ) : d.tipe === "Hamba Allah" ? (
                          <ShieldCheck className="w-3 h-3 text-[#823296]" />
                        ) : (
                          <User className="w-3 h-3 text-stone-500" />
                        )}
                        <span>{d.tipe}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-mono text-stone-800">
                      {d.noTelepon}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold font-mono text-stone-900 text-sm">
                        Rp {d.totalDonasi.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                        {d.jumlahFrekuensi}x
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-700">
                      {d.programFavorit}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          d.status === "Donatur Rutin"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-500">
                      {d.tanggalTerakhir}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDonor(d)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                      >
                        <span>Riwayat</span>
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
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {selectedDonor.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  {selectedDonor.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonor(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                <span className="text-stone-500 text-xs">Total Sedekah Disalurkan:</span>
                <p className="text-2xl font-extrabold font-mono text-[#823296] mt-1">
                  Rp {selectedDonor.totalDonasi.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Telah menyalurkan sebanyak {selectedDonor.jumlahFrekuensi} kali transfer
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Tipe Donatur:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedDonor.tipe}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Keanggotaan:</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedDonor.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Fokus Program:</span>
                  <span className="font-medium text-stone-800">
                    {selectedDonor.programFavorit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Donasi Terakhir:</span>
                  <span className="font-medium text-stone-800">
                    {selectedDonor.tanggalTerakhir}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">
                  Data Kontak Korespondensi:
                </span>
                <p className="text-stone-800 font-mono">
                  {selectedDonor.noTelepon}
                </p>
                <p className="text-stone-500 text-[11px]">
                  {selectedDonor.email}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDonor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Tutup
                </button>
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
                Tambah Donatur Baru
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
                  Nama Donatur / Lembaga *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama donatur atau 'Hamba Allah'..."
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kategori Donatur
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipe: e.target.value as DonorRecord["tipe"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Individu">Individu</option>
                    <option value="Lembaga/Komunitas">Lembaga / Komunitas</option>
                    <option value="Hamba Allah">Hamba Allah (Anonim)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as DonorRecord["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Donatur Rutin">Donatur Rutin</option>
                    <option value="Donatur Insidental">Donatur Insidental</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
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
                    Nominal Awal Donasi (Rp)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={10000}
                    value={formData.totalDonasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalDonasi: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Program Utama
                  </label>
                  <select
                    value={formData.programFavorit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        programFavorit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Pendidikan Santri Papua">Pendidikan Santri Papua</option>
                    <option value="Pangan Halal Bergizi">Pangan Halal Bergizi</option>
                    <option value="Kado Yatim Lebaran">Kado Yatim Lebaran</option>
                    <option value="Kesehatan & Nutrisi">Kesehatan & Nutrisi</option>
                  </select>
                </div>
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
                  Simpan Donatur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

