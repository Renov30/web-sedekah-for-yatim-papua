import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatIndonesianDate,
  jsonResponse,
  optionsResponse,
} from "@/lib/apiHelpers";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  try {
    const orphans = await prisma.orphan.findMany({
      orderBy: { createdAt: "desc" },
    });

    const mapped = orphans.map((o) => ({
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

    return jsonResponse({ success: true, data: mapped });
  } catch (error) {
    console.error("Error GET /api/admin/orphans:", error);
    return jsonResponse(
      { success: false, message: "Gagal mengambil data anak yatim." },
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

    const namaLengkap = String(body.namaLengkap || "").trim();
    if (!namaLengkap) {
      return jsonResponse(
        { success: false, message: "Nama lengkap anak yatim wajib diisi." },
        400
      );
    }

    // Generate next ID if not provided
    let id = body.id ? String(body.id).trim() : "";
    if (!id) {
      const allOrphans = await prisma.orphan.findMany({
        select: { id: true },
      });
      let maxNum = allOrphans.length;
      for (const item of allOrphans) {
        const match = item.id.match(/YTM-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      id = `YTM-${String(maxNum + 1).padStart(3, "0")}`;
    }

    const { pjAvId, pjAvNama } = await resolveValidAv(
      body.pjAvId,
      body.pjAvNama
    );

    const created = await prisma.orphan.upsert({
      where: { id },
      update: {
        namaLengkap,
        namaPanggilan:
          String(body.namaPanggilan || "").trim() ||
          namaLengkap.split(" ")[0],
        gender: body.gender === "P" ? "P" : "L",
        usia: Number(body.usia) || 10,
        status: body.status || "Yatim",
        asalDaerah: String(body.asalDaerah || "Distrik Merauke").trim(),
        kabupaten: String(body.kabupaten || "Kab. Merauke").trim(),
        kampung: body.kampung ? String(body.kampung).trim() : null,
        pjAvId,
        pjAvNama,
        tempatTinggal: String(
          body.tempatTinggal || "Asrama SFY Merauke"
        ).trim(),
        wali: String(body.wali || "-").trim(),
        jenjangPendidikan: String(
          body.jenjangPendidikan || "SD"
        ).trim(),
        kebutuhanMendesak: String(
          body.kebutuhanMendesak || "Perlengkapan Sekolah"
        ).trim(),
        statusVerifikasi: body.statusVerifikasi || "Menunggu Survei",
        tanggalMasuk: body.tanggalMasuk || formatIndonesianDate(),
        isDeleted: Boolean(body.isDeleted),
        deletedAt: body.deletedAt ? String(body.deletedAt) : null,
      },
      create: {
        id,
        namaLengkap,
        namaPanggilan:
          String(body.namaPanggilan || "").trim() ||
          namaLengkap.split(" ")[0],
        gender: body.gender === "P" ? "P" : "L",
        usia: Number(body.usia) || 10,
        status: body.status || "Yatim",
        asalDaerah: String(body.asalDaerah || "Distrik Merauke").trim(),
        kabupaten: String(body.kabupaten || "Kab. Merauke").trim(),
        kampung: body.kampung ? String(body.kampung).trim() : null,
        pjAvId,
        pjAvNama,
        tempatTinggal: String(
          body.tempatTinggal || "Asrama SFY Merauke"
        ).trim(),
        wali: String(body.wali || "-").trim(),
        jenjangPendidikan: String(
          body.jenjangPendidikan || "SD"
        ).trim(),
        kebutuhanMendesak: String(
          body.kebutuhanMendesak || "Perlengkapan Sekolah"
        ).trim(),
        statusVerifikasi: body.statusVerifikasi || "Menunggu Survei",
        tanggalMasuk: body.tanggalMasuk || formatIndonesianDate(),
        isDeleted: Boolean(body.isDeleted),
        deletedAt: body.deletedAt ? String(body.deletedAt) : null,
      },
    });

    return jsonResponse({ success: true, data: created }, 201);
  } catch (error) {
    console.error("Error POST /api/admin/orphans:", error);
    return jsonResponse(
      { success: false, message: "Gagal menambahkan data anak yatim." },
      500
    );
  }
}

// Bulk sync endpoint used when Web Admin calls saveStoredOrphans(list)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body) ? body : body.items;

    if (!Array.isArray(items)) {
      return jsonResponse(
        { success: false, message: "Format data tidak valid." },
        400
      );
    }

    const incomingIds = new Set(items.map((i) => String(i.id)));
    const existing = await prisma.orphan.findMany({ select: { id: true } });

    // Delete records removed permanently from list
    const toDelete = existing
      .map((e) => e.id)
      .filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
      await prisma.orphan.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    // Upsert all items in list
    for (const item of items) {
      const { pjAvId, pjAvNama } = await resolveValidAv(
        item.pjAvId,
        item.pjAvNama
      );

      await prisma.orphan.upsert({
        where: { id: String(item.id) },
        update: {
          namaLengkap: String(item.namaLengkap || ""),
          namaPanggilan: String(item.namaPanggilan || ""),
          gender: item.gender === "P" ? "P" : "L",
          usia: Number(item.usia) || 10,
          status: String(item.status || "Yatim"),
          asalDaerah: String(item.asalDaerah || "Distrik Merauke"),
          kabupaten: String(item.kabupaten || "Kab. Merauke"),
          kampung: item.kampung ? String(item.kampung) : null,
          pjAvId,
          pjAvNama,
          tempatTinggal: String(item.tempatTinggal || ""),
          wali: String(item.wali || ""),
          jenjangPendidikan: String(item.jenjangPendidikan || ""),
          kebutuhanMendesak: String(item.kebutuhanMendesak || ""),
          statusVerifikasi: String(
            item.statusVerifikasi || "Menunggu Survei"
          ),
          tanggalMasuk: String(item.tanggalMasuk || ""),
          isDeleted: Boolean(item.isDeleted),
          deletedAt: item.deletedAt ? String(item.deletedAt) : null,
        },
        create: {
          id: String(item.id),
          namaLengkap: String(item.namaLengkap || ""),
          namaPanggilan: String(item.namaPanggilan || ""),
          gender: item.gender === "P" ? "P" : "L",
          usia: Number(item.usia) || 10,
          status: String(item.status || "Yatim"),
          asalDaerah: String(item.asalDaerah || "Distrik Merauke"),
          kabupaten: String(item.kabupaten || "Kab. Merauke"),
          kampung: item.kampung ? String(item.kampung) : null,
          pjAvId,
          pjAvNama,
          tempatTinggal: String(item.tempatTinggal || ""),
          wali: String(item.wali || ""),
          jenjangPendidikan: String(item.jenjangPendidikan || ""),
          kebutuhanMendesak: String(item.kebutuhanMendesak || ""),
          statusVerifikasi: String(
            item.statusVerifikasi || "Menunggu Survei"
          ),
          tanggalMasuk: String(item.tanggalMasuk || ""),
          isDeleted: Boolean(item.isDeleted),
          deletedAt: item.deletedAt ? String(item.deletedAt) : null,
        },
      });
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error PUT /api/admin/orphans:", error);
    return jsonResponse(
      { success: false, message: "Gagal menyinkronkan data anak yatim." },
      500
    );
  }
}
