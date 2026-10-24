import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, optionsResponse } from "@/lib/apiHelpers";
import { MASTER_ADMIN_CREDENTIALS, UserWithAuth } from "@/lib/auth";
import { initialRoles } from "@/data/admin/adminData";

export async function OPTIONS() {
  return optionsResponse();
}

async function ensureRolesAndMasterAdmin() {
  for (const r of initialRoles) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        nama: r.nama,
        badgeColor: r.badgeColor,
        deskripsi: r.deskripsi,
      },
    });
  }

  const existingMaster = await prisma.user.findFirst({
    where: {
      OR: [
        { id: MASTER_ADMIN_CREDENTIALS.id },
        { email: "admin" },
        { email: "admin@sfypapua.org" },
      ],
    },
  });

  if (!existingMaster) {
    await prisma.user.create({
      data: {
        id: MASTER_ADMIN_CREDENTIALS.id,
        nama: MASTER_ADMIN_CREDENTIALS.nama,
        email: MASTER_ADMIN_CREDENTIALS.email,
        passwordHash: MASTER_ADMIN_CREDENTIALS.password,
        roleId: MASTER_ADMIN_CREDENTIALS.roleId,
        status: MASTER_ADMIN_CREDENTIALS.status,
        wilayahTugas: MASTER_ADMIN_CREDENTIALS.wilayahTugas,
        terakhirLogin: MASTER_ADMIN_CREDENTIALS.terakhirLogin,
      },
    });
  } else if (existingMaster.email === "admin@sfypapua.org") {
    const conflict = await prisma.user.findUnique({ where: { email: "admin" } });
    if (!conflict) {
      await prisma.user.update({
        where: { id: existingMaster.id },
        data: { email: "admin" },
      });
    }
  }
}

export async function GET() {
  try {
    await ensureRolesAndMasterAdmin();

    const rows = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });

    const data: UserWithAuth[] = rows.map((u) => ({
      id: u.id,
      nama: u.nama,
      email: u.email,
      password: u.passwordHash || "AdminSFY2025!",
      roleId: u.roleId,
      status: u.status as "Aktif" | "Non-aktif",
      terakhirLogin: u.terakhirLogin || "Belum pernah login",
      wilayahTugas: u.wilayahTugas,
      isDeleted: u.isDeleted,
      deletedAt: u.deletedAt ?? undefined,
    }));

    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error("Error GET /api/admin/users:", error);
    return jsonResponse(
      { success: false, message: "Gagal mengambil data pengguna" },
      500
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? (body.items as UserWithAuth[]) : [];

    await ensureRolesAndMasterAdmin();

    const incomingIds: string[] = [];

    for (const item of items) {
      const id = String(item.id || "").trim();
      const username = String(item.email || "").trim().toLowerCase();
      if (!id || !username) continue;

      incomingIds.push(id);

      // Ensure role exists so foreign key constraint never fails
      const roleId = item.roleId || "staf_lapangan";
      await prisma.role.upsert({
        where: { id: roleId },
        update: {},
        create: {
          id: roleId,
          nama: roleId,
          badgeColor: "bg-stone-100 text-stone-800 border-stone-300",
          deskripsi: "Role pengguna",
        },
      });

      const byId = await prisma.user.findUnique({ where: { id } });
      const byEmail = await prisma.user.findUnique({ where: { email: username } });

      // Handle unique email/username conflict if different id already has this username
      if (byEmail && byEmail.id !== id) {
        await prisma.user.update({
          where: { id: byEmail.id },
          data: {
            nama: item.nama || byEmail.nama,
            passwordHash: item.password || byEmail.passwordHash || "AdminSFY2025!",
            roleId,
            status: item.status || "Aktif",
            terakhirLogin: item.terakhirLogin || byEmail.terakhirLogin,
            wilayahTugas: item.wilayahTugas || byEmail.wilayahTugas,
            isDeleted: Boolean(item.isDeleted),
            deletedAt: item.deletedAt ?? null,
          },
        });
        incomingIds.push(byEmail.id);
        continue;
      }

      if (byId) {
        await prisma.user.update({
          where: { id },
          data: {
            nama: item.nama,
            email: username,
            passwordHash: item.password || byId.passwordHash || "AdminSFY2025!",
            roleId,
            status: item.status || "Aktif",
            terakhirLogin: item.terakhirLogin || byId.terakhirLogin,
            wilayahTugas: item.wilayahTugas || "Merauke",
            isDeleted: Boolean(item.isDeleted),
            deletedAt: item.deletedAt ?? null,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            id,
            nama: item.nama || username,
            email: username,
            passwordHash: item.password || "AdminSFY2025!",
            roleId,
            status: item.status || "Aktif",
            terakhirLogin: item.terakhirLogin || "Belum pernah login",
            wilayahTugas: item.wilayahTugas || "Merauke",
            isDeleted: Boolean(item.isDeleted),
            deletedAt: item.deletedAt ?? null,
          },
        });
      }
    }

    // Permanent delete users that were removed from local list (except Master Admin USR-001)
    if (incomingIds.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: {
            notIn: [...incomingIds, MASTER_ADMIN_CREDENTIALS.id],
          },
          email: {
            notIn: ["admin", "admin@sfypapua.org"],
          },
        },
      });
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error PUT /api/admin/users:", error);
    return jsonResponse(
      { success: false, message: "Gagal menyinkronkan data pengguna" },
      500
    );
  }
}
