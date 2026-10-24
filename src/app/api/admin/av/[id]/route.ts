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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.areaVolunteer.findUnique({ where: { id } });
    if (!existing) {
      return jsonResponse(
        { success: false, message: "Data koordinator AV tidak ditemukan." },
        404
      );
    }

    const updated = await prisma.areaVolunteer.update({
      where: { id },
      data: {
        nama:
          body.nama !== undefined ? String(body.nama).trim() : undefined,
        noHp:
          body.noHp !== undefined ? String(body.noHp).trim() : undefined,
        kampung:
          body.kampung !== undefined
            ? String(body.kampung).trim()
            : undefined,
        distrik:
          body.distrik !== undefined
            ? String(body.distrik).trim()
            : undefined,
        kabupaten:
          body.kabupaten !== undefined
            ? String(body.kabupaten).trim()
            : undefined,
        alamat:
          body.alamat !== undefined
            ? String(body.alamat).trim()
            : undefined,
        catatanWilayah:
          body.catatanWilayah !== undefined
            ? body.catatanWilayah
              ? String(body.catatanWilayah).trim()
              : null
            : undefined,
        status:
          body.status !== undefined ? String(body.status) : undefined,
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

    // If AV name changed, also update pjAvNama in linked orphans
    if (body.nama && body.nama.trim() !== existing.nama) {
      await prisma.orphan.updateMany({
        where: { pjAvId: id },
        data: { pjAvNama: String(body.nama).trim() },
      });
    }

    return jsonResponse({ success: true, data: updated });
  } catch (error) {
    console.error("Error PUT /api/admin/av/[id]:", error);
    return jsonResponse(
      { success: false, message: "Gagal memperbarui data koordinator AV." },
      500
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(request, context);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isSoft = request.nextUrl.searchParams.get("soft") === "true";

    const existing = await prisma.areaVolunteer.findUnique({ where: { id } });
    if (!existing) {
      return jsonResponse(
        { success: false, message: "Data koordinator AV tidak ditemukan." },
        404
      );
    }

    if (isSoft) {
      const updated = await prisma.areaVolunteer.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: formatIndonesianTimestamp(),
        },
      });
      return jsonResponse({ success: true, data: updated });
    }

    await prisma.areaVolunteer.delete({ where: { id } });
    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/admin/av/[id]:", error);
    return jsonResponse(
      { success: false, message: "Gagal menghapus data koordinator AV." },
      500
    );
  }
}
