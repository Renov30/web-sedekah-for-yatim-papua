import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, optionsResponse } from "@/lib/apiHelpers";
import { MASTER_ADMIN_CREDENTIALS, roleDisplayNames } from "@/lib/auth";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUsername = String(body.username || body.email || "")
      .trim()
      .toLowerCase();
    const passwordInput = String(body.password || "");

    if (!rawUsername || !passwordInput) {
      return jsonResponse(
        {
          success: false,
          message: "Username dan kata sandi wajib diisi.",
        },
        400
      );
    }

    const isMasterAlias =
      rawUsername === "admin" ||
      rawUsername === "admin@sfypapua.org" ||
      rawUsername === MASTER_ADMIN_CREDENTIALS.email.toLowerCase();

    let user = await prisma.user.findFirst({
      where: isMasterAlias
        ? {
            OR: [
              { id: MASTER_ADMIN_CREDENTIALS.id },
              { email: { equals: "admin", mode: "insensitive" } },
              { email: { equals: "admin@sfypapua.org", mode: "insensitive" } },
            ],
          }
        : {
            OR: [
              { email: { equals: rawUsername, mode: "insensitive" } },
              { nama: { equals: rawUsername, mode: "insensitive" } },
            ],
          },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // Ensure master admin exists in DB if logging in as master admin
    if (!user && isMasterAlias) {
      await prisma.role.upsert({
        where: { id: "super_admin" },
        update: {},
        create: {
          id: "super_admin",
          nama: "Super Admin",
          badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
          deskripsi:
            "Akses mutlak untuk seluruh modul sistem, konfigurasi akun pengguna, role, dan hak akses.",
        },
      });

      user = await prisma.user.create({
        data: {
          id: MASTER_ADMIN_CREDENTIALS.id,
          nama: MASTER_ADMIN_CREDENTIALS.nama,
          email: MASTER_ADMIN_CREDENTIALS.email.toLowerCase(),
          passwordHash: MASTER_ADMIN_CREDENTIALS.password,
          roleId: MASTER_ADMIN_CREDENTIALS.roleId,
          status: MASTER_ADMIN_CREDENTIALS.status,
          wilayahTugas: MASTER_ADMIN_CREDENTIALS.wilayahTugas,
          terakhirLogin: MASTER_ADMIN_CREDENTIALS.terakhirLogin,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });
    } else if (user && isMasterAlias && user.email === "admin@sfypapua.org") {
      // Auto-migrate legacy master admin email to plain username "admin"
      const conflict = await prisma.user.findUnique({ where: { email: "admin" } });
      if (!conflict) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { email: "admin" },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        });
      }
    }

    if (!user) {
      return jsonResponse(
        {
          success: false,
          message: "Username pengguna belum terdaftar di sistem SFY Papua.",
        },
        401
      );
    }

    if (user.isDeleted) {
      return jsonResponse(
        {
          success: false,
          message: "Akun ini telah dihapus dari sistem.",
        },
        403
      );
    }

    if (user.status !== "Aktif") {
      return jsonResponse(
        {
          success: false,
          message: "Akun ini telah dinonaktifkan oleh administrator.",
        },
        403
      );
    }

    if ((user.passwordHash || "AdminSFY2025!") !== passwordInput) {
      return jsonResponse(
        {
          success: false,
          message:
            "Kata sandi salah. Silakan periksa kembali huruf besar, huruf kecil, dan simbol.",
        },
        401
      );
    }

    const now = new Date();
    const formattedTime =
      new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now) + " WIT";

    const terakhirLogin = `Hari ini, ${formattedTime}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { terakhirLogin },
    });

    const userAccount = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      roleId: user.roleId,
      status: user.status as "Aktif" | "Non-aktif",
      terakhirLogin,
      wilayahTugas: user.wilayahTugas,
    };

    const session = {
      user: userAccount,
      roleName:
        user.role?.nama ||
        roleDisplayNames[user.roleId] ||
        "Staf Lembaga",
      token: `sfy_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    return jsonResponse({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Error POST /api/admin/auth/login:", error);
    return jsonResponse(
      {
        success: false,
        message: "Terjadi kesalahan server saat memverifikasi akun.",
      },
      500
    );
  }
}
