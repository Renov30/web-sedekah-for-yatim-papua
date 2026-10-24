import { prisma } from "@/lib/prisma";
import { jsonResponse, optionsResponse } from "@/lib/apiHelpers";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  try {
    const [orphans, avs, districts, villages, finances, volunteers, donors] =
      await Promise.all([
        prisma.orphan.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.areaVolunteer.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.district.findMany({ orderBy: { id: "asc" } }),
        prisma.village.findMany({
          include: { district: true },
          orderBy: { id: "asc" },
        }),
        prisma.financeTransaction.findMany({
          orderBy: { createdAt: "desc" },
        }),
        prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.donor.findMany({ orderBy: { createdAt: "desc" } }),
      ]);

    const activeOrphans = orphans.filter((o) => !o.isDeleted);

    const mappedOrphans = orphans.map((o) => ({
      id: o.id,
      namaLengkap: o.namaLengkap,
      namaPanggilan: o.namaPanggilan,
      gender: o.gender as "L" | "P",
      usia: o.usia,
      status: o.status as "Yatim" | "Piatu" | "Yatim Piatu",
      asalDaerah: o.asalDaerah,
      kabupaten: o.kabupaten,
      kampung: o.kampung ?? undefined,
      pjAvId: o.pjAvId ?? undefined,
      pjAvNama: o.pjAvNama ?? undefined,
      tempatTinggal: o.tempatTinggal,
      wali: o.wali,
      jenjangPendidikan: o.jenjangPendidikan,
      kebutuhanMendesak: o.kebutuhanMendesak,
      statusVerifikasi: o.statusVerifikasi as
        | "Terverifikasi"
        | "Menunggu Survei"
        | "Perlu Pembaruan",
      tanggalMasuk: o.tanggalMasuk,
      isDeleted: o.isDeleted,
      deletedAt: o.deletedAt ?? undefined,
    }));

    const mappedAvs = avs.map((av) => {
      const supervised = activeOrphans
        .filter(
          (o) =>
            o.pjAvId === av.id ||
            (o.pjAvNama &&
              o.pjAvNama.toLowerCase() === av.nama.toLowerCase())
        )
        .map((o) => o.namaLengkap);

      return {
        id: av.id,
        nama: av.nama,
        noHp: av.noHp,
        kampung: av.kampung,
        distrik: av.distrik,
        kabupaten: av.kabupaten,
        alamat: av.alamat,
        anakDampingan: supervised,
        status: av.status as "Aktif" | "Non-aktif" | "Menunggu Verifikasi",
        tanggalBergabung: av.tanggalBergabung,
        catatanWilayah: av.catatanWilayah ?? undefined,
        isDeleted: av.isDeleted,
        deletedAt: av.deletedAt ?? undefined,
      };
    });

    const mappedDistriks = districts.map((d) => ({
      id: d.id,
      nama: d.nama,
      kabupaten: d.kabupaten,
      isDeleted: d.isDeleted,
      deletedAt: d.deletedAt ?? undefined,
    }));

    const mappedKampungs = villages.map((v) => ({
      id: v.id,
      nama: v.nama,
      distrikId: v.districtId,
      distrikNama: v.district?.nama || "Distrik Merauke",
      kabupaten: v.kabupaten,
      catatan: v.catatan ?? undefined,
      isDeleted: v.isDeleted,
      deletedAt: v.deletedAt ?? undefined,
    }));

    const mappedFinances = finances.map((f) => ({
      id: f.id,
      noRef: f.noRef,
      tanggal: f.tanggal,
      jenis: f.jenis as "Pemasukan" | "Pengeluaran",
      kategori: f.kategori,
      jumlah: Number(f.jumlah),
      keterangan: f.keterangan,
      metode: f.metode,
      status: f.status as "Terverifikasi" | "Review",
      petugas: f.petugas,
      isDeleted: f.isDeleted,
      deletedAt: f.deletedAt ?? undefined,
    }));

    return jsonResponse({
      success: true,
      data: {
        orphans: mappedOrphans,
        avs: mappedAvs,
        distriks: mappedDistriks,
        kampungs: mappedKampungs,
        finances: mappedFinances,
        counts: {
          orphansTotal: activeOrphans.length,
          orphansVerified: activeOrphans.filter(
            (o) => o.statusVerifikasi === "Terverifikasi"
          ).length,
          orphansNeedSurvey: activeOrphans.filter(
            (o) => o.statusVerifikasi === "Menunggu Survei"
          ).length,
          orphansNeedUpdate: activeOrphans.filter(
            (o) => o.statusVerifikasi === "Perlu Pembaruan"
          ).length,
          avsTotal: avs.filter((a) => !a.isDeleted).length,
          avsActive: avs.filter((a) => !a.isDeleted && a.status === "Aktif")
            .length,
          distriksTotal: districts.filter((d) => !d.isDeleted).length,
          kampungsTotal: villages.filter((v) => !v.isDeleted).length,
          volunteersTotal: volunteers.filter((v) => !v.isDeleted).length,
          donorsTotal: donors.filter((d) => !d.isDeleted).length,
        },
      },
    });
  } catch (error) {
    console.error("Error GET /api/admin/dashboard:", error);
    return jsonResponse(
      { success: false, message: "Gagal mengambil data dashboard." },
      500
    );
  }
}

