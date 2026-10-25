import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, optionsResponse } from "@/lib/apiHelpers";
import {
  initialPermissions,
  initialRoles,
  RolePermissionsMap,
} from "@/data/admin/adminData";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  try {
    const dbPerms = await prisma.rolePermission.findMany();
    if (dbPerms.length === 0) {
      return jsonResponse({ success: true, data: initialPermissions });
    }

    const map: RolePermissionsMap = structuredClone(initialPermissions);
    for (const p of dbPerms) {
      if (!map[p.roleId]) {
        map[p.roleId] = {};
      }
      map[p.roleId][p.moduleId] = {
        create: p.create,
        read: p.read,
        update: p.update,
        delete: p.delete,
      };
    }

    // Ensure super_admin always has full access
    map.super_admin = structuredClone(initialPermissions.super_admin);

    return jsonResponse({ success: true, data: map });
  } catch (error) {
    console.error("Error GET /api/admin/permissions:", error);
    return jsonResponse({ success: true, data: initialPermissions });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const permissions = (body.permissions || {}) as RolePermissionsMap;

    // Ensure default roles exist in DB
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

    for (const [roleId, modules] of Object.entries(permissions)) {
      if (!modules || typeof modules !== "object") continue;

      // Ensure custom role exists before upserting permissions
      await prisma.role.upsert({
        where: { id: roleId },
        update: {},
        create: {
          id: roleId,
          nama: roleId,
          badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
          deskripsi: "Role kustom",
        },
      });

      for (const [moduleId, perms] of Object.entries(modules)) {
        const isSuper = roleId === "super_admin";
        await prisma.rolePermission.upsert({
          where: {
            roleId_moduleId: {
              roleId,
              moduleId,
            },
          },
          update: {
            create: isSuper ? true : Boolean(perms.create),
            read: isSuper ? true : Boolean(perms.read),
            update: isSuper ? true : Boolean(perms.update),
            delete: isSuper ? true : Boolean(perms.delete),
          },
          create: {
            roleId,
            moduleId,
            create: isSuper ? true : Boolean(perms.create),
            read: isSuper ? true : Boolean(perms.read),
            update: isSuper ? true : Boolean(perms.update),
            delete: isSuper ? true : Boolean(perms.delete),
          },
        });
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Error PUT /api/admin/permissions:", error);
    return jsonResponse(
      { success: false, message: "Gagal menyimpan matriks hak akses" },
      500
    );
  }
}

