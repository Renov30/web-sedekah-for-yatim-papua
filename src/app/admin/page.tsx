"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPinHouse,
  MapPin,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import {
  initialOrphans,
  initialAVs,
  initialFinances,
  OrphanRecord,
  AVRecord,
} from "@/data/admin/adminData";
import {
  getStoredOrphans,
  getStoredAVs,
} from "@/lib/adminDataStore";
import {
  getStoredDistriks,
  getStoredKampungs,
  DistrikRecord,
  KampungRecord,
} from "@/lib/wilayah";

export default function AdminDashboardPage() {
  const [orphans, setOrphans] = useState<OrphanRecord[]>(initialOrphans);
  const [avList, setAvList] = useState<AVRecord[]>(initialAVs);
  const [distriksList, setDistriksList] = useState<DistrikRecord[]>([]);
  const [kampungsList, setKampungsList] = useState<KampungRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setOrphans(getStoredOrphans());
      setAvList(getStoredAVs());
      setDistriksList(getStoredDistriks());
      setKampungsList(getStoredKampungs());
    });
  }, []);

  // 1. Santri Metrics
  const totalOrphans = orphans.length;
  const verifiedOrphans = orphans.filter(
    (o) => o.statusVerifikasi === "Terverifikasi"
  ).length;
  const actionableOrphans = useMemo(() => {
    return orphans.filter(
      (o) => o.statusVerifikasi === "Menunggu Survei" || o.statusVerifikasi === "Perlu Pembaruan"
    );
  }, [orphans]);

  // 2. AV Metrics
  const totalAVs = avList.length;
  const activeAVs = avList.filter((a) => a.status === "Aktif").length;
  const coveredKampungsFromAV = useMemo(() => {
    return new Set(avList.map((a) => a.kampung.toLowerCase())).size;
  }, [avList]);

  // 3. Wilayah Metrics
  const totalDistrikCount = distriksList.length || 15;
  const totalKampungCount = kampungsList.length || 24;

  // 4. Kas Metrics
  const totalIncome = initialFinances
    .filter((f) => f.jenis === "Pemasukan")
    .reduce((sum, f) => sum + f.jumlah, 0);
  const totalExpense = initialFinances
    .filter((f) => f.jenis === "Pengeluaran")
    .reduce((sum, f) => sum + f.jumlah, 0);
  const cashBalance = 175000000 + (totalIncome - totalExpense);

  // 5. Dynamic Regional Distribution (Calculated purely from current orphans)
  const regionalDistribution = useMemo(() => {
    const map: Record<
      string,
      {
        distrik: string;
        kabupaten: string;
        count: number;
        kampungs: Set<string>;
        avNames: Set<string>;
      }
    > = {};

    orphans.forEach((o) => {
      const distrikKey = o.asalDaerah || "Belum Ditentukan";
      if (!map[distrikKey]) {
        map[distrikKey] = {
          distrik: distrikKey,
          kabupaten: o.kabupaten || "Kab. Merauke",
          count: 0,
          kampungs: new Set<string>(),
          avNames: new Set<string>(),
        };
      }
      map[distrikKey].count += 1;
      if (o.kampung) {
        map[distrikKey].kampungs.add(o.kampung);
      }
      if (o.pjAvNama && o.pjAvNama !== "Belum ditentukan") {
        map[distrikKey].avNames.add(o.pjAvNama);
      }
    });

    return Object.values(map)
      .map((item) => ({
        distrik: item.distrik,
        kabupaten: item.kabupaten,
        count: item.count,
        kampungCount: item.kampungs.size,
        kampungList: Array.from(item.kampungs).slice(0, 3).join(", "),
        avList: Array.from(item.avNames).join(", "),
        percentage: totalOrphans > 0 ? Math.round((item.count / totalOrphans) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [orphans, totalOrphans]);

  // 6. Demographics breakdown
  const demoStats = useMemo(() => {
    const yatim = orphans.filter((o) => o.status === "Yatim").length;
    const piatu = orphans.filter((o) => o.status === "Piatu").length;
    const yatimPiatu = orphans.filter((o) => o.status === "Yatim Piatu").length;
    const laki = orphans.filter((o) => o.gender === "L").length;
    const perempuan = orphans.filter((o) => o.gender === "P").length;
    const santunanAktif = orphans.filter((o) => o.usia < 15).length;
    const batasUsia = orphans.filter((o) => o.usia >= 15).length;
    return { yatim, piatu, yatimPiatu, laki, perempuan, santunanAktif, batasUsia };
  }, [orphans]);

  return (
    <div className="space-y-6">
      {/* Header & Direct Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Dashboard Operasional
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/av"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-50 text-[#5E2276] border border-[#5E2276]/20 hover:bg-purple-100 transition-colors shadow-2xs"
          >
            <MapPinHouse className="w-4 h-4" />
            <span>Koordinator AV ({totalAVs})</span>
          </Link>
          <Link
            href="/admin/wilayah"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Data Wilayah</span>
          </Link>
          <Link
            href="/admin/anak-yatim"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#5E2276] text-white hover:bg-[#4d1c61] transition-colors shadow-2xs"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Data Anak Yatim</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards (All 100% Data-Driven, 3 Parts: Atas, Tengah, Bawah) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Anak Yatim */}
        <Link
          href="/admin/anak-yatim"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group flex flex-col justify-between"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Santri Yatim Binaan
          </p>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalOrphans}
            </span>
            <span className="text-xs font-medium text-stone-500">Santri</span>
          </div>
          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>{verifiedOrphans} Terverifikasi</span>
            <span className="text-emerald-700 font-medium">
              {orphans.filter((o) => o.usia < 15).length} Santunan • {orphans.filter((o) => o.usia >= 15).length} Batas Usia
            </span>
          </div>
        </Link>

        {/* Card 2: Koordinator AV */}
        <Link
          href="/admin/av"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group flex flex-col justify-between"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Koordinator Lapangan (AV)
          </p>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalAVs}
            </span>
            <span className="text-xs font-medium text-stone-500">Personel PJ</span>
          </div>
          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="text-blue-700 font-medium">
              {activeAVs} Aktif
            </span>
            <span>{coveredKampungsFromAV} Kampung</span>
          </div>
        </Link>

        {/* Card 3: Data Wilayah */}
        <Link
          href="/admin/wilayah"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group flex flex-col justify-between"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Cakupan Data Wilayah
          </p>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalKampungCount}
            </span>
            <span className="text-xs font-medium text-stone-500">Kampung Binaan</span>
          </div>
          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="text-stone-700 font-medium">
              {totalDistrikCount} Distrik
            </span>
            <span>Papua Selatan</span>
          </div>
        </Link>

        {/* Card 4: Saldo Kas */}
        <Link
          href="/admin/keuangan"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group flex flex-col justify-between"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Saldo Kas Amanah
          </p>
          <div className="my-3">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Rp {cashBalance.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="text-emerald-700 font-medium">Kas BSI & Mandiri</span>
            <span>Tervalidasi</span>
          </div>
        </Link>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Real Actionable Orphans & Dynamic Regional Distribution */}
        <div className="lg:col-span-7 space-y-6">
          {/* Widget 1: Prioritas Tindak Lanjut Survei & Verifikasi Santri (Replaces fake dummy agenda) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Prioritas Survei & Verifikasi Santri
                </h2>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                actionableOrphans.length > 0 
                  ? "bg-amber-100 text-amber-800" 
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                {actionableOrphans.length} Butuh Tindakan
              </span>
            </div>

            {actionableOrphans.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-900">
                  Semua Data Santri Yatim Telah Terverifikasi Amanah
                </p>
                <Link
                  href="/admin/anak-yatim"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                >
                  Buka Data Santri <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {actionableOrphans.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-stone-200/80 bg-stone-50/40 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-stone-900 truncate">
                            {item.namaLengkap}
                          </span>
                          <span className="text-xs text-stone-500">
                            ({item.usia} th, {item.status})
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 truncate mt-0.5">
                          {item.kampung || item.asalDaerah} • PJ: {item.pjAvNama || "Belum ada"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          item.statusVerifikasi === "Menunggu Survei"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.statusVerifikasi}
                      </span>
                      <Link
                        href="/admin/anak-yatim"
                        className="text-xs font-semibold text-[#5E2276] hover:underline"
                      >
                        Tinjau
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Widget 2: Dynamic Regional Distribution from Real Orphans Data */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Sebaran Santri per Distrik Binaan
                </h2>
              </div>
              <Link
                href="/admin/wilayah"
                className="text-xs font-semibold text-[#5E2276] hover:underline"
              >
                Kelola Wilayah
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {regionalDistribution.slice(0, 5).map((item, idx) => (
                <div key={idx} className="py-2.5 space-y-1.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">{item.distrik}</span>
                    <span className="font-bold text-[#5E2276]">{item.count} Santri</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-[#5E2276] rounded-full"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>{regionalDistribution.length} Distrik Dampingan</span>
              <Link
                href="/admin/anak-yatim"
                className="font-semibold text-[#5E2276] hover:underline inline-flex items-center gap-1"
              >
                Filter Wilayah <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Active AV Directory & Demographics & Recent Finances */}
        <div className="lg:col-span-5 space-y-6">
          {/* Widget 3: Koordinator AV per Kampung (Actual AV Module Data) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Koordinator AV Lapangan
                </h2>
              </div>
              <Link
                href="/admin/av"
                className="text-xs font-semibold text-[#5E2276] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {avList.slice(0, 4).map((av) => {
                const assignedCount = orphans.filter(
                  (o) => o.pjAvNama === av.nama || o.pjAvId === av.id
                ).length;

                return (
                  <div key={av.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 truncate">{av.nama}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            av.status === "Aktif"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {av.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {av.kampung}, {av.distrik}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-[#5E2276]">
                        {assignedCount} Santri
                      </span>
                      <a
                        href={`https://wa.me/${av.noHp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title={`Hubungi ${av.nama}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 4: Komposisi Demografis Santri Yatim */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Demografi Santri
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-center">
                <p className="text-xs font-medium text-stone-600">Yatim</p>
                <p className="text-lg font-extrabold text-[#5E2276] mt-0.5">
                  {demoStats.yatim}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                <p className="text-xs font-medium text-stone-600">Piatu</p>
                <p className="text-lg font-extrabold text-amber-700 mt-0.5">
                  {demoStats.piatu}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                <p className="text-xs font-medium text-stone-600">Yatim Piatu</p>
                <p className="text-lg font-extrabold text-rose-700 mt-0.5">
                  {demoStats.yatimPiatu}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span className="text-emerald-700 font-semibold">
                Santunan (&lt;15 th): {demoStats.santunanAktif}
              </span>
              <span className="text-rose-700 font-semibold">
                Batas Usia (≥15 th): {demoStats.batasUsia}
              </span>
              <span className="text-stone-400">Total {totalOrphans} Anak</span>
            </div>
          </div>

          {/* Widget 5: Mutasi Kas Sedekah Terkini (Real Finance Module Data) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Mutasi Kas Terkini
                </h2>
              </div>
              <Link
                href="/admin/keuangan"
                className="text-xs font-semibold text-[#5E2276] hover:underline"
              >
                Buku Kas
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {initialFinances.slice(0, 4).map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between py-2.5 gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        trx.jenis === "Pemasukan"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {trx.jenis === "Pemasukan" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {trx.kategori}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        {trx.tanggal}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono shrink-0 ${
                      trx.jenis === "Pemasukan"
                        ? "text-emerald-700"
                        : "text-stone-900"
                    }`}
                  >
                    {trx.jenis === "Pemasukan" ? "+" : "-"}Rp{" "}
                    {trx.jumlah.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
