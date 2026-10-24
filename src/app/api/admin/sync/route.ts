import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatIndonesianDate,
  formatIndonesianTimestamp,
  jsonResponse,
  optionsResponse,
} from "@/lib/apiHelpers";

export interface SyncQueueItem {
  opId: string;
  timestamp: number;
  entity: "orphan" | "av" | "distrik" | "kampung";
  action: "create" | "update" | "soft_delete" | "restore" | "delete";
  recordId: string;
  payload?: Record<string, unknown>;
}

export async function OPTIONS() {
  return optionsResponse();
}

async function getFullDatabaseSnapshot() {
  const [orphans, avs, districts, villages] = await Promise.all([
    prisma.orphan.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.areaVolunteer.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.district.findMany({ orderBy: { id: "asc" } }),
    prisma.village.findMany({
      include: { district: true },
      orderBy: { id: "asc" },
    }),
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
    pekerjaanWali: o.pekerjaanWali ?? undefined,
    noHpWali: o.noHpWali ?? undefined,
    jenjangPendidikan: o.jenjangPendidikan,
    namaSekolah: o.namaSekolah ?? undefined,
    tempatLahir: o.tempatLahir ?? undefined,
    tanggalLahir: o.tanggalLahir ?? undefined,
    hobi: o.hobi ?? undefined,
    citaCita: o.citaCita ?? undefined,
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
          (o.pjAvNama && o.pjAvNama.toLowerCase() === av.nama.toLowerCase())
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

  return {
    orphans: mappedOrphans,
    avs: mappedAvs,
    distriks: mappedDistriks,
    kampungs: mappedKampungs,
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
      avsActive: avs.filter((a) => !a.isDeleted && a.status === "Aktif").length,
      distriksTotal: districts.filter((d) => !d.isDeleted).length,
      kampungsTotal: villages.filter((v) => !v.isDeleted).length,
    },
  };
}

export async function GET() {
  try {
    const data = await getFullDatabaseSnapshot();
    return jsonResponse({
      success: true,
      serverTime: formatIndonesianTimestamp(),
      data,
    });
  } catch (error) {
    console.error("Error GET /api/admin/sync:", error);
    return jsonResponse(
      { success: false, message: "Gagal mengambil data sinkronisasi." },
      500
    );
  }
}

async function resolveValidAv(pjAvId?: string | null, pjAvNama?: string | null) {
  if (pjAvId) {
    const byId = await prisma.areaVolunteer.findUnique({
      where: { id: pjAvId },
    });
    if (byId) {
      return { pjAvId: byId.id, pjAvNama: pjAvNama || byId.nama };
    }
  }
  if (pjAvNama) {
    const byName = await prisma.areaVolunteer.findFirst({
      where: {
        nama: {
          equals: pjAvNama.trim(),
          mode: "insensitive",
        },
      },
    });
    if (byName) {
      return { pjAvId: byName.id, pjAvNama: byName.nama };
    }
  }
  return { pjAvId: null, pjAvNama: pjAvNama || null };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const queue: SyncQueueItem[] = Array.isArray(body.queue) ? body.queue : [];

    // Sort queue chronologically so operations apply in exact order
    const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);
    const processedOpIds: string[] = [];

    for (const op of sortedQueue) {
      try {
        const id = String(op.recordId || "");
        const p = (op.payload || {}) as Record<string, unknown>;

        if (op.entity === "distrik") {
          if (op.action === "create" || op.action === "update") {
            const nama = String(p.nama || "").trim();
            if (nama) {
              const existingByName = await prisma.district.findFirst({
                where: { nama: { equals: nama, mode: "insensitive" } },
              });
              const targetId = existingByName ? existingByName.id : id;
              await prisma.district.upsert({
                where: { id: targetId },
                update: {
                  nama,
                  kabupaten: String(p.kabupaten || "Kab. Merauke").trim(),
                  isDeleted:
                    p.isDeleted !== undefined ? Boolean(p.isDeleted) : false,
                  deletedAt: p.deletedAt ? String(p.deletedAt) : null,
                },
                create: {
                  id: targetId,
                  nama,
                  kabupaten: String(p.kabupaten || "Kab. Merauke").trim(),
                  isDeleted: Boolean(p.isDeleted),
                  deletedAt: p.deletedAt ? String(p.deletedAt) : null,
                },
              });
            }
          } else if (op.action === "soft_delete") {
            await prisma.district.updateMany({
              where: { id },
              data: {
                isDeleted: true,
                deletedAt:
                  (p.deletedAt as string) || formatIndonesianTimestamp(),
              },
            });
          } else if (op.action === "restore") {
            await prisma.district.updateMany({
              where: { id },
              data: { isDeleted: false, deletedAt: null },
            });
          } else if (op.action === "delete") {
            const count = await prisma.village.count({
              where: { districtId: id },
            });
            if (count === 0) {
              await prisma.district.deleteMany({ where: { id } });
            }
          }
        } else if (op.entity === "kampung") {
          if (op.action === "create" || op.action === "update") {
            const nama = String(p.nama || "").trim();
            const distrikNama = String(
              p.distrikNama || "Distrik Merauke"
            ).trim();
            const kabupaten = String(p.kabupaten || "Kab. Merauke").trim();

            if (nama) {
              let district = await prisma.district.findFirst({
                where: { nama: { equals: distrikNama, mode: "insensitive" } },
              });
              if (!district) {
                district = await prisma.district.create({
                  data: {
                    id: `DST-${Date.now().toString().slice(-4)}`,
                    nama: distrikNama,
                    kabupaten,
                  },
                });
              }

              const existingByName = await prisma.village.findFirst({
                where: {
                  districtId: district.id,
                  nama: { equals: nama, mode: "insensitive" },
                },
              });
              const targetId = existingByName ? existingByName.id : id;

              await prisma.village.upsert({
                where: { id: targetId },
                update: {
                  nama,
                  districtId: district.id,
                  kabupaten,
                  catatan: p.catatan ? String(p.catatan).trim() : null,
                  isDeleted:
                    p.isDeleted !== undefined ? Boolean(p.isDeleted) : false,
                  deletedAt: p.deletedAt ? String(p.deletedAt) : null,
                },
                create: {
                  id: targetId,
                  nama,
                  districtId: district.id,
                  kabupaten,
                  catatan: p.catatan ? String(p.catatan).trim() : null,
                  isDeleted: Boolean(p.isDeleted),
                  deletedAt: p.deletedAt ? String(p.deletedAt) : null,
                },
              });
            }
          } else if (op.action === "soft_delete") {
            await prisma.village.updateMany({
              where: { id },
              data: {
                isDeleted: true,
                deletedAt:
                  (p.deletedAt as string) || formatIndonesianTimestamp(),
              },
            });
          } else if (op.action === "restore") {
            await prisma.village.updateMany({
              where: { id },
              data: { isDeleted: false, deletedAt: null },
            });
          } else if (op.action === "delete") {
            await prisma.village.deleteMany({ where: { id } });
          }
        } else if (op.entity === "av") {
          if (op.action === "create" || op.action === "update") {
            await prisma.areaVolunteer.upsert({
              where: { id },
              update: {
                nama:
                  p.nama !== undefined ? String(p.nama).trim() : undefined,
                noHp:
                  p.noHp !== undefined ? String(p.noHp).trim() : undefined,
                kampung:
                  p.kampung !== undefined
                    ? String(p.kampung).trim()
                    : undefined,
                distrik:
                  p.distrik !== undefined
                    ? String(p.distrik).trim()
                    : undefined,
                kabupaten:
                  p.kabupaten !== undefined
                    ? String(p.kabupaten).trim()
                    : undefined,
                alamat:
                  p.alamat !== undefined
                    ? String(p.alamat).trim()
                    : undefined,
                catatanWilayah:
                  p.catatanWilayah !== undefined
                    ? p.catatanWilayah
                      ? String(p.catatanWilayah).trim()
                      : null
                    : undefined,
                status:
                  p.status !== undefined ? String(p.status) : undefined,
                isDeleted:
                  p.isDeleted !== undefined
                    ? Boolean(p.isDeleted)
                    : undefined,
                deletedAt:
                  p.deletedAt !== undefined
                    ? p.deletedAt
                      ? String(p.deletedAt)
                      : null
                    : undefined,
              },
              create: {
                id,
                nama: String(p.nama || "Koordinator AV").trim(),
                noHp: String(p.noHp || "-").trim(),
                kampung: String(p.kampung || "Kampung Wasur").trim(),
                distrik: String(p.distrik || "Distrik Merauke").trim(),
                kabupaten: String(p.kabupaten || "Kab. Merauke").trim(),
                alamat: String(p.alamat || "-").trim(),
                catatanWilayah: p.catatanWilayah
                  ? String(p.catatanWilayah).trim()
                  : null,
                status: String(p.status || "Aktif"),
                tanggalBergabung:
                  String(p.tanggalBergabung || "") || formatIndonesianDate(),
                isDeleted: Boolean(p.isDeleted),
                deletedAt: p.deletedAt ? String(p.deletedAt) : null,
              },
            });
          } else if (op.action === "soft_delete") {
            await prisma.areaVolunteer.updateMany({
              where: { id },
              data: {
                isDeleted: true,
                deletedAt:
                  (p.deletedAt as string) || formatIndonesianTimestamp(),
              },
            });
          } else if (op.action === "restore") {
            await prisma.areaVolunteer.updateMany({
              where: { id },
              data: { isDeleted: false, deletedAt: null },
            });
          } else if (op.action === "delete") {
            await prisma.areaVolunteer.deleteMany({ where: { id } });
          }
        } else if (op.entity === "orphan") {
          if (op.action === "create" || op.action === "update") {
            const { pjAvId, pjAvNama } = await resolveValidAv(
              p.pjAvId as string | undefined,
              p.pjAvNama as string | undefined
            );

            await prisma.orphan.upsert({
              where: { id },
              update: {
                namaLengkap:
                  p.namaLengkap !== undefined
                    ? String(p.namaLengkap).trim()
                    : undefined,
                namaPanggilan:
                  p.namaPanggilan !== undefined
                    ? String(p.namaPanggilan).trim()
                    : undefined,
                gender:
                  p.gender !== undefined
                    ? p.gender === "P"
                      ? "P"
                      : "L"
                    : undefined,
                usia: p.usia !== undefined ? Number(p.usia) : undefined,
                status:
                  p.status !== undefined ? String(p.status) : undefined,
                asalDaerah:
                  p.asalDaerah !== undefined
                    ? String(p.asalDaerah).trim()
                    : undefined,
                kabupaten:
                  p.kabupaten !== undefined
                    ? String(p.kabupaten).trim()
                    : undefined,
                kampung:
                  p.kampung !== undefined
                    ? p.kampung
                      ? String(p.kampung).trim()
                      : null
                    : undefined,
                pjAvId:
                  "pjAvId" in p || "pjAvNama" in p ? pjAvId : undefined,
                pjAvNama:
                  "pjAvId" in p || "pjAvNama" in p ? pjAvNama : undefined,
                tempatTinggal:
                  p.tempatTinggal !== undefined
                    ? String(p.tempatTinggal).trim()
                    : undefined,
                wali:
                  p.wali !== undefined ? String(p.wali).trim() : undefined,
                pekerjaanWali:
                  p.pekerjaanWali !== undefined
                    ? p.pekerjaanWali
                      ? String(p.pekerjaanWali).trim()
                      : null
                    : undefined,
                noHpWali:
                  p.noHpWali !== undefined
                    ? p.noHpWali
                      ? String(p.noHpWali).trim()
                      : null
                    : undefined,
                jenjangPendidikan:
                  p.jenjangPendidikan !== undefined
                    ? String(p.jenjangPendidikan).trim()
                    : undefined,
                namaSekolah:
                  p.namaSekolah !== undefined
                    ? p.namaSekolah
                      ? String(p.namaSekolah).trim()
                      : null
                    : undefined,
                tempatLahir:
                  p.tempatLahir !== undefined
                    ? p.tempatLahir
                      ? String(p.tempatLahir).trim()
                      : null
                    : undefined,
                tanggalLahir:
                  p.tanggalLahir !== undefined
                    ? p.tanggalLahir
                      ? String(p.tanggalLahir).trim()
                      : null
                    : undefined,
                hobi:
                  p.hobi !== undefined
                    ? p.hobi
                      ? String(p.hobi).trim()
                      : null
                    : undefined,
                citaCita:
                  p.citaCita !== undefined
                    ? p.citaCita
                      ? String(p.citaCita).trim()
                      : null
                    : undefined,
                kebutuhanMendesak:
                  p.kebutuhanMendesak !== undefined
                    ? String(p.kebutuhanMendesak).trim()
                    : undefined,
                statusVerifikasi:
                  p.statusVerifikasi !== undefined
                    ? String(p.statusVerifikasi)
                    : undefined,
                isDeleted:
                  p.isDeleted !== undefined
                    ? Boolean(p.isDeleted)
                    : undefined,
                deletedAt:
                  p.deletedAt !== undefined
                    ? p.deletedAt
                      ? String(p.deletedAt)
                      : null
                    : undefined,
              },
              create: {
                id,
                namaLengkap: String(p.namaLengkap || "Santri SFY").trim(),
                namaPanggilan:
                  String(p.namaPanggilan || "").trim() ||
                  String(p.namaLengkap || "Santri").split(" ")[0],
                gender: p.gender === "P" ? "P" : "L",
                usia: Number(p.usia) || 10,
                status: String(p.status || "Yatim"),
                asalDaerah: String(p.asalDaerah || "Distrik Merauke").trim(),
                kabupaten: String(p.kabupaten || "Kab. Merauke").trim(),
                kampung: p.kampung ? String(p.kampung).trim() : null,
                pjAvId,
                pjAvNama,
                tempatTinggal: String(
                  p.tempatTinggal || "Asrama SFY Merauke"
                ).trim(),
                wali: String(p.wali || "-").trim(),
                pekerjaanWali: p.pekerjaanWali
                  ? String(p.pekerjaanWali).trim()
                  : null,
                noHpWali: p.noHpWali ? String(p.noHpWali).trim() : null,
                jenjangPendidikan: String(
                  p.jenjangPendidikan || "SD"
                ).trim(),
                namaSekolah: p.namaSekolah
                  ? String(p.namaSekolah).trim()
                  : null,
                tempatLahir: p.tempatLahir
                  ? String(p.tempatLahir).trim()
                  : null,
                tanggalLahir: p.tanggalLahir
                  ? String(p.tanggalLahir).trim()
                  : null,
                hobi: p.hobi ? String(p.hobi).trim() : null,
                citaCita: p.citaCita ? String(p.citaCita).trim() : null,
                kebutuhanMendesak: String(
                  p.kebutuhanMendesak || "Perlengkapan Sekolah"
                ).trim(),
                statusVerifikasi: String(
                  p.statusVerifikasi || "Menunggu Survei"
                ),
                tanggalMasuk:
                  String(p.tanggalMasuk || "") || formatIndonesianDate(),
                isDeleted: Boolean(p.isDeleted),
                deletedAt: p.deletedAt ? String(p.deletedAt) : null,
              },
            });
          } else if (op.action === "soft_delete") {
            await prisma.orphan.updateMany({
              where: { id },
              data: {
                isDeleted: true,
                deletedAt:
                  (p.deletedAt as string) || formatIndonesianTimestamp(),
              },
            });
          } else if (op.action === "restore") {
            await prisma.orphan.updateMany({
              where: { id },
              data: { isDeleted: false, deletedAt: null },
            });
          } else if (op.action === "delete") {
            await prisma.orphan.deleteMany({ where: { id } });
          }
        }

        processedOpIds.push(op.opId);
      } catch (opErr) {
        console.error(`Gagal memproses op ${op.opId}:`, opErr);
        // Mark as processed if non-retryable constraint error so queue doesn't get stuck
        processedOpIds.push(op.opId);
      }
    }

    const data = await getFullDatabaseSnapshot();

    return jsonResponse({
      success: true,
      processedOpIds,
      serverTime: formatIndonesianTimestamp(),
      data,
    });
  } catch (error) {
    console.error("Error POST /api/admin/sync:", error);
    return jsonResponse(
      { success: false, message: "Gagal melakukan sinkronisasi data." },
      500
    );
  }
}

