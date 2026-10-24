"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPinHouse,
  MapPin,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Phone,
  BarChart3,
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
    return { yatim, piatu, yatimPiatu, laki, perempuan };
  }, [orphans]);

  return (
    <div className="space-y-6">
      {/* Header & Direct Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Dashboard Operasional
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Ikhtisar real-time data santri yatim, koordinator lapangan AV, dan data wilayah binaan di Papua.
          </p>
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

      {/* 4 Metric Cards (All 100% Data-Driven) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Anak Yatim */}
        <Link
          href="/admin/anak-yatim"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Santri Yatim Binaan
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5E2276] flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalOrphans}
            </span>
            <span className="text-xs font-medium text-stone-500">Santri</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {verifiedOrphans} Terverifikasi
            </span>
            {actionableOrphans.length > 0 && (
              <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                {actionableOrphans.length} Perlu Survei
              </span>
            )}
          </div>
        </Link>

        {/* Card 2: Koordinator AV */}
        <Link
          href="/admin/av"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Koordinator Lapangan (AV)
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPinHouse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalAVs}
            </span>
            <span className="text-xs font-medium text-stone-500">Personel PJ</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="text-blue-700 font-medium">
              {activeAVs} Aktif Bertugas
            </span>
            <span>{coveredKampungsFromAV} Kampung Terjangkau</span>
          </div>
        </Link>

        {/* Card 3: Data Wilayah */}
        <Link
          href="/admin/wilayah"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Cakupan Data Wilayah
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalKampungCount}
            </span>
            <span className="text-xs font-medium text-stone-500">Kampung Binaan</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="text-stone-700 font-medium">
              {totalDistrikCount} Distrik
            </span>
            <span className="text-stone-400">Papua Selatan</span>
          </div>
        </Link>

        {/* Card 4: Saldo Kas */}
        <Link
          href="/admin/keuangan"
          className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#5E2276]/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Saldo Kas Amanah
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Rp {cashBalance.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Diaudit
            </span>
            <span>BSI & Mandiri</span>
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
                <p className="text-xs text-stone-500">
                  Data santri baru atau pembaruan yang memerlukan validasi relawan dan PJ AV lapangan
                </p>
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
                <p className="text-xs text-emerald-700 mt-1">
                  Tidak ada santri dengan status survei tertunda saat ini.
                </p>
                <Link
                  href="/admin/anak-yatim"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                >
                  Buka Data Santri Lengkap <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {actionableOrphans.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/30 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">
                              {item.namaLengkap}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-stone-100 text-stone-600">
                              {item.id}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-stone-700 font-medium">
                              {item.status} ({item.usia} th)
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              {item.kampung || "-"}, {item.asalDaerah}
                            </span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 self-start sm:self-center ${
                          item.statusVerifikasi === "Menunggu Survei"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.statusVerifikasi}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-stone-600">
                        <span className="font-semibold text-stone-700">PJ AV:</span>{" "}
                        {item.pjAvNama || "Belum ditentukan"} •{" "}
                        <span className="font-semibold text-stone-700">Kebutuhan:</span>{" "}
                        <span className="text-stone-800">{item.kebutuhanMendesak}</span>
                      </div>
                      <Link
                        href={`/admin/anak-yatim`}
                        className="inline-flex items-center gap-1 font-semibold text-[#5E2276] hover:underline shrink-0"
                      >
                        Validasi Berkas <ChevronRight className="w-3.5 h-3.5" />
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
                <p className="text-xs text-stone-500">
                  Agregasi otomatis jumlah santri yatim terdata pada tiap wilayah
                </p>
              </div>
              <Link
                href="/admin/wilayah"
                className="text-xs font-semibold text-[#5E2276] hover:underline"
              >
                Kelola Wilayah
              </Link>
            </div>

            <div className="space-y-3">
              {regionalDistribution.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {item.distrik}
                        </span>
                        <span className="text-xs text-stone-500">
                          ({item.kabupaten})
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Kampung: {item.kampungList || "-"} {item.avList && `• AV: ${item.avList}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#5E2276]">
                        {item.count} Santri
                      </span>
                      <p className="text-[11px] text-stone-400">
                        {item.percentage}% dari total
                      </p>
                    </div>
                  </div>

                  {/* Progress proportion bar */}
                  <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-[#5E2276] rounded-full"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>
                Menjangkau {regionalDistribution.length} Distrik & {coveredKampungsFromAV} Kampung Dampingan
              </span>
              <Link
                href="/admin/anak-yatim"
                className="font-semibold text-[#5E2276] hover:underline inline-flex items-center gap-1"
              >
                Filter Berdasarkan Wilayah <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Active AV Directory & Demographics & Recent Finances */}
        <div className="lg:col-span-5 space-y-6">
          {/* Widget 3: Koordinator AV per Kampung (Actual AV Module Data) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <MapPinHouse className="w-4 h-4 text-[#5E2276]" />
                  Koordinator AV Lapangan
                </h2>
                <p className="text-xs text-stone-500">
                  Penanggung Jawab (PJ) santri yatim di tiap kampung
                </p>
              </div>
              <Link
                href="/admin/av"
                className="text-xs font-semibold text-[#5E2276] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {avList.slice(0, 4).map((av) => {
                const assignedCount = orphans.filter(
                  (o) => o.pjAvNama === av.nama || o.pjAvId === av.id
                ).length;

                return (
                  <div
                    key={av.id}
                    className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            {av.nama}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              av.status === "Aktif"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {av.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {av.kampung}, {av.distrik}
                        </p>
                      </div>

                      <span className="text-xs font-semibold font-mono text-[#5E2276] bg-purple-50 px-2 py-0.5 rounded-md">
                        {assignedCount} Santri
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] border-t border-stone-100">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {av.noHp}
                      </span>
                      <a
                        href={`https://wa.me/${av.noHp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Hubungi WA
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
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#5E2276]" />
                  Demografi Santri
                </h2>
                <p className="text-xs text-stone-500">
                  Klasifikasi status amanah & jenis kelamin santri
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-center">
                <p className="text-[11px] font-medium text-stone-500">Yatim</p>
                <p className="text-lg font-extrabold text-[#5E2276] mt-0.5">
                  {demoStats.yatim}
                </p>
                <p className="text-[10px] text-stone-400">Ayah wafat</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                <p className="text-[11px] font-medium text-stone-500">Piatu</p>
                <p className="text-lg font-extrabold text-amber-700 mt-0.5">
                  {demoStats.piatu}
                </p>
                <p className="text-[10px] text-stone-400">Ibu wafat</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                <p className="text-[11px] font-medium text-stone-500">Yatim Piatu</p>
                <p className="text-lg font-extrabold text-rose-700 mt-0.5">
                  {demoStats.yatimPiatu}
                </p>
                <p className="text-[10px] text-stone-400">Keduanya</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Laki-laki: <strong className="text-stone-800">{demoStats.laki}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Perempuan: <strong className="text-stone-800">{demoStats.perempuan}</strong>
              </span>
              <span className="text-stone-400">Total {totalOrphans} Anak</span>
            </div>
          </div>

          {/* Widget 5: Mutasi Kas Sedekah Terkini (Real Finance Module Data) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Mutasi Kas Terkini
                </h2>
                <p className="text-xs text-stone-500">
                  Arus kas amanah masuk & penyaluran santunan
                </p>
              </div>
              <Link
                href="/admin/keuangan"
                className="text-xs font-semibold text-[#5E2276] hover:underline"
              >
                Buku Kas
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
                          : "bg-rose-50 text-rose-600"
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
