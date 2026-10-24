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

    const existing = await prisma.orphan.findUnique({ where: { id } });
    if (!existing) {
      return jsonResponse(
        { success: false, message: "Data anak yatim tidak ditemukan." },
        404
      );
    }

    let pjAvId: string | null | undefined = undefined;
    let pjAvNama: string | null | undefined = undefined;

    if ("pjAvId" in body || "pjAvNama" in body) {
      pjAvId = null;
      pjAvNama = body.pjAvNama ? String(body.pjAvNama).trim() : null;

      if (body.pjAvId) {
        const av = await prisma.areaVolunteer.findUnique({
          where: { id: String(body.pjAvId) },
        });
        if (av) {
          pjAvId = av.id;
          pjAvNama = pjAvNama || av.nama;
        }
      } else if (pjAvNama) {
        const av = await prisma.areaVolunteer.findFirst({
          where: {
            nama: {
              equals: pjAvNama,
              mode: "insensitive",
            },
          },
        });
        if (av) {
          pjAvId = av.id;
          pjAvNama = av.nama;
        }
      }
    }

    const updated = await prisma.orphan.update({
      where: { id },
      data: {
        namaLengkap:
          body.namaLengkap !== undefined
            ? String(body.namaLengkap).trim()
            : undefined,
        namaPanggilan:
          body.namaPanggilan !== undefined
            ? String(body.namaPanggilan).trim()
            : undefined,
        gender:
          body.gender !== undefined
            ? body.gender === "P"
              ? "P"
              : "L"
            : undefined,
        usia: body.usia !== undefined ? Number(body.usia) : undefined,
        status:
          body.status !== undefined ? String(body.status) : undefined,
        asalDaerah:
          body.asalDaerah !== undefined
            ? String(body.asalDaerah).trim()
            : undefined,
        kabupaten:
          body.kabupaten !== undefined
            ? String(body.kabupaten).trim()
            : undefined,
        kampung:
          body.kampung !== undefined
            ? body.kampung
              ? String(body.kampung).trim()
              : null
            : undefined,
        pjAvId,
        pjAvNama,
        tempatTinggal:
          body.tempatTinggal !== undefined
            ? String(body.tempatTinggal).trim()
            : undefined,
        wali:
          body.wali !== undefined ? String(body.wali).trim() : undefined,
        jenjangPendidikan:
          body.jenjangPendidikan !== undefined
            ? String(body.jenjangPendidikan).trim()
            : undefined,
        kebutuhanMendesak:
          body.kebutuhanMendesak !== undefined
            ? String(body.kebutuhanMendesak).trim()
            : undefined,
        statusVerifikasi:
          body.statusVerifikasi !== undefined
            ? String(body.statusVerifikasi)
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

    return jsonResponse({ success: true, data: updated });
  } catch (error) {
    console.error("Error PUT /api/admin/orphans/[id]:", error);
    return jsonResponse(
      { success: false, message: "Gagal memperbarui data anak yatim." },
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

    const existing = await prisma.orphan.findUnique({ where: { id } });
    if (!existing) {
      return jsonResponse(
        { success: false, message: "Data anak yatim tidak ditemukan." },
        404
      );
    }

    if (isSoft) {
      const updated = await prisma.orphan.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: formatIndonesianTimestamp(),
        },
      });
      return jsonResponse({ success: true, data: updated });
    }

    await prisma.orphan.delete({ where: { id } });
    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error DELETE /api/admin/orphans/[id]:", error);
    return jsonResponse(
      { success: false, message: "Gagal menghapus data anak yatim." },
      500
    );
  }
}
