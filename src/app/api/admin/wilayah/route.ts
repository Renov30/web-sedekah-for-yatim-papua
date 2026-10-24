import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatIndonesianTimestamp,
  jsonResponse,
  optionsResponse,
} from "@/lib/apiHelpers";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  try {
    const [districts, villages] = await Promise.all([
      prisma.district.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.village.findMany({
        include: { district: true },
        orderBy: { id: "asc" },
      }),
    ]);

    const distriks = districts.map((d) => ({
      id: d.id,
      nama: d.nama,
      kabupaten: d.kabupaten,
      isDeleted: d.isDeleted,
      deletedAt: d.deletedAt ?? undefined,
    }));

    const kampungs = villages.map((v) => ({
      id: v.id,
      nama: v.nama,
      distrikId: v.districtId,
      distrikNama: v.district?.nama || "Distrik Merauke",
      kabupaten: v.kabupaten,
      catatan: v.catatan ?? undefined,
      isDeleted: v.isDeleted,
      deletedAt: v.deletedAt ?? undefined,
    }));

    return jsonResponse({
      success: true,
      distriks,
      kampungs,
    });
  } catch (error) {
    console.error("Error GET /api/admin/wilayah:", error);
    return jsonResponse(
      { success: false, message: "Gagal mengambil data wilayah." },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body.type || "kampung";

    if (type === "distrik") {
      const nama = String(body.nama || "").trim();
      const kabupaten = String(body.kabupaten || "Kab. Merauke").trim();

      if (!nama) {
        return jsonResponse(
          { success: false, message: "Nama distrik wajib diisi." },
          400
        );
      }

      const existing = await prisma.district.findFirst({
        where: { nama: { equals: nama, mode: "insensitive" } },
      });

      if (existing) {
        return jsonResponse(
          {
            success: false,
            message: `Distrik "${nama}" sudah ada di database.`,
          },
          400
        );
      }

      let id = body.id ? String(body.id).trim() : "";
      if (!id) {
        const allDistriks = await prisma.district.findMany({
          select: { id: true },
        });
        let maxNum = allDistriks.length;
        for (const d of allDistriks) {
          const match = d.id.match(/DST-(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
        id = `DST-${String(maxNum + 1).padStart(3, "0")}`;
      }

      const created = await prisma.district.create({
        data: {
          id,
          nama,
          kabupaten,
        },
      });

      return jsonResponse({ success: true, data: created }, 201);
    } else {
      // Create Kampung
      const nama = String(body.nama || "").trim();
      const distrikNama = String(body.distrikNama || "").trim();
      const kabupaten = String(body.kabupaten || "Kab. Merauke").trim();
      const catatan = body.catatan ? String(body.catatan).trim() : null;

      if (!nama) {
        return jsonResponse(
          { success: false, message: "Nama kampung wajib diisi." },
          400
        );
      }
      if (!distrikNama) {
        return jsonResponse(
          { success: false, message: "Distrik wajib dipilih." },
          400
        );
      }

      let district = await prisma.district.findFirst({
        where: { nama: { equals: distrikNama, mode: "insensitive" } },
      });

      if (!district) {
        const allDistriks = await prisma.district.findMany({
          select: { id: true },
        });
        let maxDistNum = allDistriks.length;
        for (const d of allDistriks) {
          const match = d.id.match(/DST-(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxDistNum) maxDistNum = num;
          }
        }
        const distId = `DST-${String(maxDistNum + 1).padStart(3, "0")}`;
        district = await prisma.district.create({
          data: {
            id: distId,
            nama: distrikNama,
            kabupaten,
          },
        });
      }

      const duplicate = await prisma.village.findFirst({
        where: {
          districtId: district.id,
          nama: { equals: nama, mode: "insensitive" },
        },
      });

      if (duplicate) {
        return jsonResponse(
          {
            success: false,
            message: `"${nama}" sudah terdaftar di ${district.nama}.`,
          },
          400
        );
      }

      let id = body.id ? String(body.id).trim() : "";
      if (!id) {
        const allVillages = await prisma.village.findMany({
          select: { id: true },
        });
        let maxNum = allVillages.length;
        for (const v of allVillages) {
          const match = v.id.match(/KMP-(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
        id = `KMP-${String(maxNum + 1).padStart(3, "0")}`;
      }

      const created = await prisma.village.create({
        data: {
          id,
          nama,
          districtId: district.id,
          kabupaten: kabupaten || district.kabupaten,
          catatan,
        },
      });

      return jsonResponse(
        {
          success: true,
          data: {
            id: created.id,
            nama: created.nama,
            distrikId: created.districtId,
            distrikNama: district.nama,
            kabupaten: created.kabupaten,
            catatan: created.catatan ?? undefined,
            isDeleted: created.isDeleted,
            deletedAt: created.deletedAt ?? undefined,
          },
        },
        201
      );
    }
  } catch (error) {
    console.error("Error POST /api/admin/wilayah:", error);
    return jsonResponse(
      { success: false, message: "Gagal menambahkan data wilayah." },
      500
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Single item update: { type: "distrik" | "kampung", id, ... }
    if (body.id && body.type) {
      const id = String(body.id);
      if (body.type === "distrik") {
        const existing = await prisma.district.findUnique({ where: { id } });
        if (!existing) {
          return jsonResponse(
            { success: false, message: "Distrik tidak ditemukan." },
            404
          );
        }

        // If soft deleting a distrik, check active villages
        if (body.isDeleted === true && !existing.isDeleted) {
          const activeCount = await prisma.village.count({
            where: { districtId: id, isDeleted: false },
          });
          if (activeCount > 0) {
            return jsonResponse(
              {
                success: false,
                message: `Distrik "${existing.nama}" masih memiliki ${activeCount} kampung aktif. Hapus atau pindahkan kampung terlebih dahulu.`,
              },
              400
            );
          }
        }

        const updated = await prisma.district.update({
          where: { id },
          data: {
            nama:
              body.nama !== undefined
                ? String(body.nama).trim()
                : undefined,
            kabupaten:
              body.kabupaten !== undefined
                ? String(body.kabupaten).trim()
                : undefined,
            isDeleted:
              body.isDeleted !== undefined
                ? Boolean(body.isDeleted)
                : undefined,
            deletedAt:
              body.isDeleted === true
                ? body.deletedAt || formatIndonesianTimestamp()
                : body.isDeleted === false
                ? null
                : undefined,
          },
        });

        if (body.kabupaten) {
          await prisma.village.updateMany({
            where: { districtId: id },
            data: { kabupaten: String(body.kabupaten).trim() },
          });
        }

        return jsonResponse({ success: true, data: updated });
      } else {
        const existing = await prisma.village.findUnique({ where: { id } });
        if (!existing) {
          return jsonResponse(
            { success: false, message: "Kampung tidak ditemukan." },
            404
          );
        }

        let districtId: string | undefined = undefined;
        if (body.distrikNama) {
          const matched = await prisma.district.findFirst({
            where: {
              nama: {
                equals: String(body.distrikNama).trim(),
                mode: "insensitive",
              },
            },
          });
          if (matched) {
            districtId = matched.id;
          }
        } else if (body.distrikId) {
          districtId = String(body.distrikId);
        }

        const updated = await prisma.village.update({
          where: { id },
          data: {
            nama:
              body.nama !== undefined
                ? String(body.nama).trim()
                : undefined,
            districtId,
            kabupaten:
              body.kabupaten !== undefined
                ? String(body.kabupaten).trim()
                : undefined,
            catatan:
              body.catatan !== undefined
                ? body.catatan
                  ? String(body.catatan).trim()
                  : null
                : undefined,
            isDeleted:
              body.isDeleted !== undefined
                ? Boolean(body.isDeleted)
                : undefined,
            deletedAt:
              body.isDeleted === true
                ? body.deletedAt || formatIndonesianTimestamp()
                : body.isDeleted === false
                ? null
                : undefined,
          },
          include: { district: true },
        });

        return jsonResponse({
          success: true,
          data: {
            id: updated.id,
            nama: updated.nama,
            distrikId: updated.districtId,
            distrikNama: updated.district?.nama || "Distrik Merauke",
            kabupaten: updated.kabupaten,
            catatan: updated.catatan ?? undefined,
            isDeleted: updated.isDeleted,
            deletedAt: updated.deletedAt ?? undefined,
          },
        });
      }
    }

    // Bulk sync from Web Admin localStorage helpers
    if (Array.isArray(body.distriks)) {
      const incomingIds = new Set(body.distriks.map((d: { id: string }) => String(d.id)));
      const existing = await prisma.district.findMany({ select: { id: true } });
      const toDelete = existing
        .map((e) => e.id)
        .filter((id) => !incomingIds.has(id));
      if (toDelete.length > 0) {
        await prisma.district.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      for (const d of body.distriks) {
        await prisma.district.upsert({
          where: { id: String(d.id) },
          update: {
            nama: String(d.nama || ""),
            kabupaten: String(d.kabupaten || "Kab. Merauke"),
            isDeleted: Boolean(d.isDeleted),
            deletedAt: d.deletedAt ? String(d.deletedAt) : null,
          },
          create: {
            id: String(d.id),
            nama: String(d.nama || ""),
            kabupaten: String(d.kabupaten || "Kab. Merauke"),
            isDeleted: Boolean(d.isDeleted),
            deletedAt: d.deletedAt ? String(d.deletedAt) : null,
          },
        });
      }
    }

    if (Array.isArray(body.kampungs)) {
      const incomingIds = new Set(body.kampungs.map((k: { id: string }) => String(k.id)));
      const existing = await prisma.village.findMany({ select: { id: true } });
      const toDelete = existing
        .map((e) => e.id)
        .filter((id) => !incomingIds.has(id));
      if (toDelete.length > 0) {
        await prisma.village.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      for (const k of body.kampungs) {
        let district = await prisma.district.findUnique({
          where: { id: String(k.distrikId || "") },
        });
        if (!district && k.distrikNama) {
          district = await prisma.district.findFirst({
            where: {
              nama: {
                equals: String(k.distrikNama),
                mode: "insensitive",
              },
            },
          });
        }
        if (!district) {
          district = await prisma.district.upsert({
            where: { nama: String(k.distrikNama || "Distrik Merauke") },
            update: {},
            create: {
              id: `DST-AUTO-${Date.now()}`,
              nama: String(k.distrikNama || "Distrik Merauke"),
              kabupaten: String(k.kabupaten || "Kab. Merauke"),
            },
          });
        }

        await prisma.village.upsert({
          where: { id: String(k.id) },
          update: {
            nama: String(k.nama || ""),
            districtId: district.id,
            kabupaten: String(k.kabupaten || "Kab. Merauke"),
            catatan: k.catatan ? String(k.catatan) : null,
            isDeleted: Boolean(k.isDeleted),
            deletedAt: k.deletedAt ? String(k.deletedAt) : null,
          },
          create: {
            id: String(k.id),
            nama: String(k.nama || ""),
            districtId: district.id,
            kabupaten: String(k.kabupaten || "Kab. Merauke"),
            catatan: k.catatan ? String(k.catatan) : null,
            isDeleted: Boolean(k.isDeleted),
            deletedAt: k.deletedAt ? String(k.deletedAt) : null,
          },
        });
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error PUT /api/admin/wilayah:", error);
    return jsonResponse(
      { success: false, message: "Gagal memperbarui data wilayah." },
      500
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type") || "kampung";
    const id = request.nextUrl.searchParams.get("id") || "";
    const isSoft = request.nextUrl.searchParams.get("soft") === "true";

    if (!id) {
      return jsonResponse(
        { success: false, message: "ID wilayah wajib disertakan." },
        400
      );
    }

    if (type === "distrik") {
      const existing = await prisma.district.findUnique({ where: { id } });
      if (!existing) {
        return jsonResponse(
          { success: false, message: "Distrik tidak ditemukan." },
          404
        );
      }

      const kampungCount = await prisma.village.count({
        where: isSoft
          ? { districtId: id, isDeleted: false }
          : { districtId: id },
      });

      if (kampungCount > 0) {
        return jsonResponse(
          {
            success: false,
            message: `Distrik "${existing.nama}" masih memiliki ${kampungCount} kampung binaan. Hapus atau pindahkan kampung terlebih dahulu.`,
          },
          400
        );
      }

      if (isSoft) {
        await prisma.district.update({
          where: { id },
          data: {
            isDeleted: true,
            deletedAt: formatIndonesianTimestamp(),
          },
        });
        return jsonResponse({ success: true });
      }

      await prisma.district.delete({ where: { id } });
      return jsonResponse({ success: true });
    } else {
      const existing = await prisma.village.findUnique({ where: { id } });
      if (!existing) {
        return jsonResponse(
          { success: false, message: "Kampung tidak ditemukan." },
          404
        );
      }

      if (isSoft) {
        await prisma.village.update({
          where: { id },
          data: {
            isDeleted: true,
            deletedAt: formatIndonesianTimestamp(),
          },
        });
        return jsonResponse({ success: true });
      }

      await prisma.village.delete({ where: { id } });
      return jsonResponse({ success: true });
    }
  } catch (error) {
    console.error("Error DELETE /api/admin/wilayah:", error);
    return jsonResponse(
      { success: false, message: "Gagal menghapus data wilayah." },
      500
    );
  }
}

