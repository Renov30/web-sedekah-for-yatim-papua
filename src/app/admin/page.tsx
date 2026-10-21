"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  HeartHandshake,
  Users2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  initialOrphans,
  initialVolunteers,
  initialDonors,
  initialFinances,
} from "@/data/admin/adminData";

export default function AdminDashboardPage() {
  const totalOrphans = initialOrphans.length;
  const verifiedOrphans = initialOrphans.filter(
    (o) => o.statusVerifikasi === "Terverifikasi"
  ).length;
  const pendingOrphans = totalOrphans - verifiedOrphans;

  const totalVolunteers = initialVolunteers.length;
  const activeVolunteers = initialVolunteers.filter(
    (v) => v.status === "Aktif"
  ).length;

  const totalDonors = initialDonors.length;
  const totalDonationAmount = initialDonors.reduce(
    (sum, d) => sum + d.totalDonasi,
    0
  );

  // Calculate current balance from finances
  const totalIncome = initialFinances
    .filter((f) => f.jenis === "Pemasukan")
    .reduce((sum, f) => sum + f.jumlah, 0);
  const totalExpense = initialFinances
    .filter((f) => f.jenis === "Pengeluaran")
    .reduce((sum, f) => sum + f.jumlah, 0);
  const cashBalance = 175000000 + (totalIncome - totalExpense);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Dashboard Operasional
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Ikhtisar data amanah santri yatim, relawan, dan penyaluran sedekah di Papua.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/anak-yatim"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Data Anak Yatim</span>
          </Link>
          <Link
            href="/admin/keuangan"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span>Buku Kas</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Anak Yatim */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#823296]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Santri Yatim Terdata
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#823296] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalOrphans}
            </span>
            <span className="text-xs font-medium text-stone-500">Anak</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span>{verifiedOrphans} Terverifikasi</span>
            {pendingOrphans > 0 && (
              <span className="text-amber-700 font-medium">
                {pendingOrphans} Menunggu survei
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Relawan */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#823296]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Relawan Lapangan
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalVolunteers}
            </span>
            <span className="text-xs font-medium text-stone-500">Personel</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span>{activeVolunteers} Aktif Bertugas</span>
            <span className="text-blue-700 font-medium">4 Wilayah</span>
          </div>
        </div>

        {/* Card 3: Donatur */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#823296]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Donatur Terdaftar
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalDonors}
            </span>
            <span className="text-xs font-medium text-stone-500">Muzakki / Lembaga</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span>Total Komitmen</span>
            <span className="text-stone-800 font-semibold">
              Rp {(totalDonationAmount / 1000000).toFixed(1)} Jt
            </span>
          </div>
        </div>

        {/* Card 4: Saldo Kas */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#823296]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Saldo Kas Amanah
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Rp {cashBalance.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              100% Diaudit
            </span>
            <span>Kas BSI & Mandiri</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Tugas & Sebaran Santri */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today Tasks Section (Reference layout: Today Task) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Agenda & Tugas Lapangan Hari Ini
                </h2>
                <p className="text-xs text-stone-500">
                  Jadwal penyaluran dan pendataan santri yatim di Papua
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-[#823296]">
                4 Agenda
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-stone-200/70 hover:border-purple-200 transition-colors flex items-start justify-between gap-3 bg-stone-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-stone-300 flex items-center justify-center text-white bg-white"></div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      Survei Validasi Calon Santri Yatim Arso Keerom
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      Distrik Arso, Kab. Keerom — Relawan: Daud Kogoya
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  09:00 - 12:00 WIT
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200/70 hover:border-purple-200 transition-colors flex items-start justify-between gap-3 bg-stone-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-stone-300 flex items-center justify-center text-white bg-white"></div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      Penyaluran Paket Pangan & Gizi Asrama Sentani
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      Asrama SFY Sentani — Relawan: Siti Rahmawati
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  14:00 - 16:30 WIT
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200/70 hover:border-purple-200 transition-colors flex items-start justify-between gap-3 bg-stone-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-stone-300 flex items-center justify-center text-white bg-white"></div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      Rekonsiliasi Mutasi Sedekah QRIS & Bank BSI
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      Sekretariat SFY Jayapura — Bendahara: Ustadzah Wardah
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  16:30 - 17:30 WIT
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 line-through text-stone-400">
                      Verifikasi Berkas Calon Relawan Baru (Hendra W.)
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Telah ditinjau oleh Koordinator Relawan Ahmad Faisal
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded shrink-0">
                  Selesai
                </span>
              </div>
            </div>
          </div>

          {/* Regional Orphan Distribution */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Sebaran Santri Yatim per Wilayah
                </h2>
                <p className="text-xs text-stone-500">
                  Cakupan jangkauan program pembinaan dan asrama
                </p>
              </div>
              <Link
                href="/admin/anak-yatim"
                className="text-xs font-semibold text-[#823296] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { reg: "Kota Jayapura", count: "3 Anak", note: "Abepura & Skouw" },
                { reg: "Kab. Jayapura", count: "2 Anak", note: "Sentani & Depapre" },
                { reg: "Kab. Keerom", count: "1 Anak", note: "Distrik Arso" },
                { reg: "Kab. Biak", count: "1 Anak", note: "Biak Kota" },
                { reg: "Kab. Jayawijaya", count: "1 Anak", note: "Asal Wamena" },
                { reg: "Kab. Merauke", count: "1 Anak", note: "MI Al-Ma'arif" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/70"
                >
                  <p className="text-xs text-stone-500">{item.reg}</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">
                    {item.count}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Notifications & Recent Transactions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notification Block (matching the prominent purple card in reference image) */}
          <div className="bg-[#5E2276] text-white p-5 sm:p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-purple-200 font-semibold">
                Pemberitahuan Sistem
              </span>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white">
                Prioritas Tinggi
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
                  <p className="text-xs font-semibold text-white">
                    Survei Santri: Ibrahim S. Yoman (Biak)
                  </p>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  Berkas pendaftaran masuk dari Biak Numfor menunggu verifikasi dokumen dan survei kondisi wali.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-purple-200 font-mono">
                    15 Okt 2024
                  </span>
                  <Link
                    href="/admin/anak-yatim"
                    className="text-xs font-semibold bg-[#facc15] text-[#1c0b27] px-3 py-1 rounded-lg hover:bg-amber-300 transition-colors"
                  >
                    Tinjau Berkas
                  </Link>
                </div>
              </div>

              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-blue-200 shrink-0" />
                  <p className="text-xs font-semibold text-white">
                    Pendaftar Relawan: Hendra Wijaya (Waena)
                  </p>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  Minat divisi Pendidikan & Bimbel Bahasa Inggris. Memerlukan konfirmasi jadwal wawancara awal.
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-purple-200 font-mono">
                    14 Jan 2025
                  </span>
                  <Link
                    href="/admin/relawan"
                    className="text-xs font-semibold bg-white text-[#5E2276] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Verifikasi Relawan
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Financial Movement */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Mutasi Sedekah Terkini
                </h2>
                <p className="text-xs text-stone-500">
                  Arus kas amanah masuk & keluar terbaru
                </p>
              </div>
              <Link
                href="/admin/keuangan"
                className="text-xs font-semibold text-[#823296] hover:underline"
              >
                Buka Buku Kas
              </Link>
            </div>

            <div className="space-y-3">
              {initialFinances.slice(0, 4).map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:bg-stone-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        trx.jenis === "Pemasukan"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {trx.jenis === "Pemasukan" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {trx.kategori}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {trx.tanggal} • {trx.metode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <p
                      className={`text-xs font-bold font-mono ${
                        trx.jenis === "Pemasukan"
                          ? "text-emerald-700"
                          : "text-stone-900"
                      }`}
                    >
                      {trx.jenis === "Pemasukan" ? "+" : "-"}Rp{" "}
                      {trx.jumlah.toLocaleString("id-ID")}
                    </p>
                    <span className="text-[10px] text-stone-400">
                      {trx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

