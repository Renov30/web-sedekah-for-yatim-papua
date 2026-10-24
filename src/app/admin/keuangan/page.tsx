"use client";

import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  X,
} from "lucide-react";
import {
  initialFinances,
  FinanceTransaction,
} from "@/data/admin/adminData";

export default function KeuanganAdminPage() {
  const [transactions, setTransactions] =
    useState<FinanceTransaction[]>(initialFinances);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedTx, setSelectedTx] = useState<FinanceTransaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    jenis: "Pemasukan" as "Pemasukan" | "Pengeluaran",
    kategori: "Sedekah Rutin",
    jumlah: 1000000,
    keterangan: "",
    metode: "Bank BSI",
    petugas: "Ustadzah Wardah (Bendahara)",
    status: "Terverifikasi" as "Terverifikasi" | "Review",
  });

  const totalIncome = transactions
    .filter((t) => t.jenis === "Pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalExpense = transactions
    .filter((t) => t.jenis === "Pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const currentBalance = 175000000 + (totalIncome - totalExpense);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.noRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.petugas.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJenis = filterJenis === "all" || t.jenis === filterJenis;
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;

    return matchesSearch && matchesJenis && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus =
            t.status === "Terverifikasi" ? "Review" : "Terverifikasi";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );

    if (selectedTx && selectedTx.id === id) {
      setSelectedTx((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Terverifikasi" ? "Review" : "Terverifikasi",
            }
          : null
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = formData.jenis === "Pemasukan" ? "IN" : "OUT";
    const dateNow = new Date();
    const monthYear = `${dateNow.getFullYear()}${String(
      dateNow.getMonth() + 1
    ).padStart(2, "0")}`;

    const newRecord: FinanceTransaction = {
      id: `TRX-00${transactions.length + 1}`,
      noRef: `SFY-${prefix}-${monthYear}-${String(
        transactions.length + 1
      ).padStart(3, "0")}`,
      tanggal: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(dateNow),
      jenis: formData.jenis,
      kategori: formData.kategori,
      jumlah: Number(formData.jumlah),
      keterangan: formData.keterangan,
      metode: formData.metode,
      status: formData.status,
      petugas: formData.petugas,
    };

    setTransactions([newRecord, ...transactions]);
    setIsAddModalOpen(false);
    setFormData({
      jenis: "Pemasukan",
      kategori: "Sedekah Rutin",
      jumlah: 1000000,
      keterangan: "",
      metode: "Bank BSI",
      petugas: "Ustadzah Wardah (Bendahara)",
      status: "Terverifikasi",
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "No Referensi",
      "Tanggal",
      "Jenis",
      "Kategori",
      "Nominal (Rp)",
      "Metode Pembayaran",
      "Keterangan Penggunaan",
      "Status Verifikasi",
      "Petugas Pencatat",
    ];

    const rows = filteredTransactions.map((t) => [
      t.noRef,
      `"${t.tanggal}"`,
      t.jenis,
      `"${t.kategori}"`,
      t.jumlah,
      `"${t.metode}"`,
      `"${t.keterangan}"`,
      t.status,
      `"${t.petugas}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `buku_kas_sfy_papua_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Manajemen Arus Kas & Sedekah
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              100% Diaudit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Kas</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Kas</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Metric Cards (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Saldo Kas Berjalan
          </p>
          <p className="text-2xl font-extrabold font-mono text-stone-900 my-2">
            Rp {currentBalance.toLocaleString("id-ID")}
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Kas Operasional</span>
            <span>BSI & Mandiri</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Sedekah Masuk
          </p>
          <p className="text-2xl font-extrabold font-mono text-emerald-700 my-2">
            +Rp {totalIncome.toLocaleString("id-ID")}
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Transaksi Masuk</span>
            <span>{transactions.filter((t) => t.jenis === "Pemasukan").length} Transaksi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Penyaluran & Belanja
          </p>
          <p className="text-2xl font-extrabold font-mono text-stone-900 my-2">
            -Rp {totalExpense.toLocaleString("id-ID")}
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Pos Program Dakwah</span>
            <span>{transactions.filter((t) => t.jenis === "Pengeluaran").length} Penyaluran</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Review Bendahara
          </p>
          <p className="text-2xl font-extrabold text-amber-600 my-2">
            {transactions.filter((t) => t.status === "Review").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Nota</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Verifikasi Nota</span>
            <span className="text-amber-700 font-semibold">Perlu Tinjauan</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari no referensi, pos anggaran, atau nama petugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Jenis Transaksi</option>
            <option value="Pemasukan">Pemasukan (Sedekah Masuk)</option>
            <option value="Pengeluaran">Pengeluaran (Program / Operasional)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Status Audit</option>
            <option value="Terverifikasi">Terverifikasi</option>
            <option value="Review">Menunggu Review</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-[13%] min-w-[110px]">Tanggal</th>
                <th className="py-3.5 px-3 w-[12%] min-w-[110px]">Jenis Kas</th>
                <th className="py-3.5 px-3 w-[16%] min-w-[130px]">Pos Alokasi</th>
                <th className="py-3.5 px-3 w-[24%] min-w-[190px]">Rincian Keterangan</th>
                <th className="py-3.5 px-3 w-[14%] min-w-[120px] text-right">Nominal (Rp)</th>
                <th className="py-3.5 px-3 w-[16%] min-w-[140px]">Metode & Petugas</th>
                <th className="py-3.5 px-3 w-[9%] min-w-[85px] text-center">Audit</th>
                <th className="py-3.5 px-4 w-[6%] min-w-[70px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan riwayat mutasi kas yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-stone-800">
                        {trx.tanggal}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          trx.jenis === "Pemasukan"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {trx.jenis === "Pemasukan" ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-stone-500" />
                        )}
                        <span>{trx.jenis}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-stone-900 text-xs">
                        {trx.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-600 max-w-[240px] truncate">
                      {trx.keterangan}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          trx.jenis === "Pemasukan"
                            ? "text-emerald-700"
                            : "text-stone-900"
                        }`}
                      >
                        {trx.jenis === "Pemasukan" ? "+" : "-"}Rp{" "}
                        {trx.jumlah.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-800">
                      {trx.metode}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(trx.id)}
                        title="Klik untuk verifikasi status audit nota"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${
                          trx.status === "Terverifikasi"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {trx.status === "Terverifikasi" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{trx.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTx(trx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Kuitansi</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                  {selectedTx.noRef}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  Bukti Kuitansi Kas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl text-center border border-stone-200/60">
                <span className="text-stone-500 text-xs">
                  {selectedTx.jenis === "Pemasukan"
                    ? "Jumlah Penerimaan Sedekah"
                    : "Jumlah Penyaluran Program"}
                </span>
                <p
                  className={`text-2xl font-extrabold font-mono mt-1 ${
                    selectedTx.jenis === "Pemasukan"
                      ? "text-emerald-700"
                      : "text-stone-900"
                  }`}
                >
                  Rp {selectedTx.jumlah.toLocaleString("id-ID")}
                </p>
                <span
                  className={`inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    selectedTx.status === "Terverifikasi"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Status: {selectedTx.status}
                </span>
              </div>

              <div className="space-y-2 p-3 bg-stone-50/70 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-stone-500">Tanggal Transaksi:</span>
                  <span className="font-semibold text-stone-900">
                    {selectedTx.tanggal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pos / Kategori:</span>
                  <span className="font-bold text-[#823296]">
                    {selectedTx.kategori}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Metode Transaksi:</span>
                  <span className="font-medium text-stone-800">
                    {selectedTx.metode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Petugas Bertanggung Jawab:</span>
                  <span className="font-medium text-stone-800">
                    {selectedTx.petugas}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">
                  Keterangan & Peruntukan:
                </span>
                <p className="p-3 bg-white rounded-lg border border-stone-200 text-stone-800 leading-relaxed">
                  {selectedTx.keterangan}
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedTx.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                >
                  Toggle Audit Status
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Tutup Kuitansi
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
                Catat Transaksi Kas Baru
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Jenis Kas *
                  </label>
                  <select
                    value={formData.jenis}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenis: e.target.value as "Pemasukan" | "Pengeluaran",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white font-semibold"
                  >
                    <option value="Pemasukan">Pemasukan (+ Sedekah)</option>
                    <option value="Pengeluaran">Pengeluaran (- Program)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Metode Kas
                  </label>
                  <select
                    value={formData.metode}
                    onChange={(e) =>
                      setFormData({ ...formData, metode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Bank BSI">Bank Syariah Indonesia (BSI)</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="QRIS BSI">QRIS Lembaga</option>
                    <option value="Tunai / Kas Kecil">Tunai / Kas Kecil Lapangan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kategori Pos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sedekah Rutin / Paket Sembako"
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Nominal Transaksi (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={formData.jumlah}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jumlah: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Keterangan Penggunaan Lengkap *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Rincian peruntukan sedekah / pembelian barang..."
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({ ...formData, keterangan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Petugas Pencatat
                  </label>
                  <input
                    type="text"
                    value={formData.petugas}
                    onChange={(e) =>
                      setFormData({ ...formData, petugas: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Status Verifikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Terverifikasi" | "Review",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Terverifikasi">Terverifikasi (Sah)</option>
                    <option value="Review">Menunggu Review Nota</option>
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
                  Simpan Transaksi Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

