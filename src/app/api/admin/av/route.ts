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
    const [avs, orphans] = await Promise.all([
      prisma.areaVolunteer.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.orphan.findMany({
        where: { isDeleted: false },
        select: { id: true, namaLengkap: true, pjAvId: true, pjAvNama: true },
      }),
    ]);

    const mapped = avs.map((av) => {
      const supervised = orphans
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

    return jsonResponse({ success: true, data: mapped });
  } catch (error) {
    console.error("Error GET /api/admin/av:", error);
    return jsonResponse(
      { success: false, message: "Gagal mengambil data koordinator AV." },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nama = String(body.nama || "").trim();

    if (!nama) {
      return jsonResponse(
        { success: false, message: "Nama koordinator AV wajib diisi." },
        400
      );
    }

    let id = body.id ? String(body.id).trim() : "";
    if (!id) {
      const allAvs = await prisma.areaVolunteer.findMany({
        select: { id: true },
      });
      let maxNum = allAvs.length;
      for (const item of allAvs) {
        const match = item.id.match(/AV-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      id = `AV-${String(maxNum + 1).padStart(3, "0")}`;
    }

    const created = await prisma.areaVolunteer.upsert({
      where: { id },
      update: {
        nama,
        noHp: String(body.noHp || "-").trim(),
        kampung: String(body.kampung || "Kampung Wasur").trim(),
        distrik: String(body.distrik || "Distrik Merauke").trim(),
        kabupaten: String(body.kabupaten || "Kab. Merauke").trim(),
        alamat: String(body.alamat || "-").trim(),
        catatanWilayah: body.catatanWilayah
          ? String(body.catatanWilayah).trim()
          : null,
        status: body.status || "Aktif",
        tanggalBergabung: body.tanggalBergabung || formatIndonesianDate(),
        isDeleted: Boolean(body.isDeleted),
        deletedAt: body.deletedAt ? String(body.deletedAt) : null,
      },
      create: {
        id,
        nama,
        noHp: String(body.noHp || "-").trim(),
        kampung: String(body.kampung || "Kampung Wasur").trim(),
        distrik: String(body.distrik || "Distrik Merauke").trim(),
        kabupaten: String(body.kabupaten || "Kab. Merauke").trim(),
        alamat: String(body.alamat || "-").trim(),
        catatanWilayah: body.catatanWilayah
          ? String(body.catatanWilayah).trim()
          : null,
        status: body.status || "Aktif",
        tanggalBergabung: body.tanggalBergabung || formatIndonesianDate(),
        isDeleted: Boolean(body.isDeleted),
        deletedAt: body.deletedAt ? String(body.deletedAt) : null,
      },
    });

    return jsonResponse(
      {
        success: true,
        data: {
          ...created,
          anakDampingan: [],
        },
      },
      201
    );
  } catch (error) {
    console.error("Error POST /api/admin/av:", error);
    return jsonResponse(
      { success: false, message: "Gagal menambahkan data koordinator AV." },
      500
    );
  }
}

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
    const existing = await prisma.areaVolunteer.findMany({
      select: { id: true },
    });

    const toDelete = existing
      .map((e) => e.id)
      .filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
      await prisma.areaVolunteer.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    for (const item of items) {
      await prisma.areaVolunteer.upsert({
        where: { id: String(item.id) },
        update: {
          nama: String(item.nama || ""),
          noHp: String(item.noHp || ""),
          kampung: String(item.kampung || ""),
          distrik: String(item.distrik || ""),
          kabupaten: String(item.kabupaten || "Kab. Merauke"),
          alamat: String(item.alamat || ""),
          catatanWilayah: item.catatanWilayah
            ? String(item.catatanWilayah)
            : null,
          status: String(item.status || "Aktif"),
          tanggalBergabung: String(item.tanggalBergabung || ""),
          isDeleted: Boolean(item.isDeleted),
          deletedAt: item.deletedAt ? String(item.deletedAt) : null,
        },
        create: {
          id: String(item.id),
          nama: String(item.nama || ""),
          noHp: String(item.noHp || ""),
          kampung: String(item.kampung || ""),
          distrik: String(item.distrik || ""),
          kabupaten: String(item.kabupaten || "Kab. Merauke"),
          alamat: String(item.alamat || ""),
          catatanWilayah: item.catatanWilayah
            ? String(item.catatanWilayah)
            : null,
          status: String(item.status || "Aktif"),
          tanggalBergabung: String(item.tanggalBergabung || ""),
          isDeleted: Boolean(item.isDeleted),
          deletedAt: item.deletedAt ? String(item.deletedAt) : null,
        },
      });
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error PUT /api/admin/av:", error);
    return jsonResponse(
      { success: false, message: "Gagal menyinkronkan data AV." },
      500
    );
  }
}

