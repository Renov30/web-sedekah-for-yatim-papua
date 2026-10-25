"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  RotateCcw,
  Save,
  Shield,
} from "lucide-react";
import {
  initialRoles,
  moduleList,
  initialPermissions,
  RolePermissionsMap,
  RoleDefinition,
} from "@/data/admin/adminData";
import {
  getStoredRoles,
  getStoredPermissions,
  saveStoredPermissions,
} from "@/lib/adminDataStore";

function PermissionsContent() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role");

  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("bendahara");
  const [permissionsMap, setPermissionsMap] =
    useState<RolePermissionsMap>(initialPermissions);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    queueMicrotask(() => {
      const storedRoles = getStoredRoles();
      const storedPerms = getStoredPermissions();
      setRoles(storedRoles);
      setPermissionsMap(storedPerms);
      const nonDeleted = storedRoles.filter((r) => !r.isDeleted);
      if (requestedRole && nonDeleted.some((r) => r.id === requestedRole)) {
        setSelectedRoleId(requestedRole);
      }
    });
  }, [requestedRole]);

  const activeRoles = roles.filter((r) => !r.isDeleted);

  const currentRole =
    activeRoles.find((r) => r.id === selectedRoleId) ||
    activeRoles[0] ||
    initialRoles[0];

  const isSuperAdminRole = selectedRoleId === "super_admin";
  const currentRolePerms = permissionsMap[selectedRoleId] || {};

  const handleToggleAction = (
    moduleId: string,
    action: "create" | "read" | "update" | "delete"
  ) => {
    if (isSuperAdminRole) return;

    setPermissionsMap((prev) => {
      const currentRoleObj = prev[selectedRoleId] || {};
      const currentModObj = currentRoleObj[moduleId] || {
        create: false,
        read: false,
        update: false,
        delete: false,
      };

      const nextValue = !currentModObj[action];
      const updatedMod = {
        ...currentModObj,
        [action]: nextValue,
      };

      // If create/update/delete is enabled, automatically enable read (so the page is visible)
      if (action !== "read" && nextValue) {
        updatedMod.read = true;
      }
      // If read is disabled, automatically disable create/update/delete
      if (action === "read" && !nextValue) {
        updatedMod.create = false;
        updatedMod.update = false;
        updatedMod.delete = false;
      }

      const nextMap: RolePermissionsMap = {
        ...prev,
        [selectedRoleId]: {
          ...currentRoleObj,
          [moduleId]: updatedMod,
        },
      };

      saveStoredPermissions(nextMap);
      return nextMap;
    });
  };

  const handleSetAll = (enable: boolean) => {
    if (isSuperAdminRole) return;

    setPermissionsMap((prev) => {
      const updatedModObj: {
        [moduleId: string]: {
          create: boolean;
          read: boolean;
          update: boolean;
          delete: boolean;
        };
      } = {};

      moduleList.forEach((m) => {
        updatedModObj[m.id] = {
          create: enable,
          read: enable,
          update: enable,
          delete: enable,
        };
      });

      const nextMap = {
        ...prev,
        [selectedRoleId]: updatedModObj,
      };
      saveStoredPermissions(nextMap);
      return nextMap;
    });
  };

  const handleSetReadOnly = () => {
    if (isSuperAdminRole) return;

    setPermissionsMap((prev) => {
      const updatedModObj: {
        [moduleId: string]: {
          create: boolean;
          read: boolean;
          update: boolean;
          delete: boolean;
        };
      } = {};

      moduleList.forEach((m) => {
        const isSystemMod =
          m.id === "users" || m.id === "roles" || m.id === "permissions";
        updatedModObj[m.id] = {
          create: false,
          read: !isSystemMod,
          update: false,
          delete: false,
        };
      });

      const nextMap = {
        ...prev,
        [selectedRoleId]: updatedModObj,
      };
      saveStoredPermissions(nextMap);
      return nextMap;
    });
  };

  const handleResetRoleDefault = () => {
    const defaultRolePerms = initialPermissions[selectedRoleId];
    if (!defaultRolePerms) return;

    const nextMap: RolePermissionsMap = {
      ...permissionsMap,
      [selectedRoleId]: structuredClone(defaultRolePerms),
    };
    setPermissionsMap(nextMap);
    saveStoredPermissions(nextMap);
    setSavedSuccessMessage(
      `Hak akses untuk role "${currentRole.nama}" berhasil dikembalikan ke pengaturan default.`
    );
    setTimeout(() => {
      setSavedSuccessMessage(null);
    }, 4000);
  };

  const handleSave = () => {
    saveStoredPermissions(permissionsMap);
    setSavedSuccessMessage(
      `Hak akses untuk role "${currentRole.nama}" berhasil disimpan dan langsung diterapkan pada menu & halaman!`
    );
    setTimeout(() => {
      setSavedSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Penentuan Permission Role
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#823296] border border-purple-200">
              Matriks Akses Granular
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Hanya modul yang dicentang pada kolom <strong>Read (Lihat)</strong> yang akan tampil di menu Sidebar untuk role tersebut.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Hak Akses</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {activeRoles.map((r) => {
            const isSelected = r.id === selectedRoleId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleId(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#823296] text-white shadow-2xs"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {r.nama}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Role Scope Card */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentRole.badgeColor}`}
          >
            {currentRole.nama}
          </span>
          <span className="text-xs text-stone-400 font-mono">
            ({currentRole.id})
          </span>
          {isSuperAdminRole && (
            <span className="inline-flex items-center gap-1 text-[11px] text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg font-medium">
              <Shield className="w-3 h-3" />
              Akses Super Admin dikunci penuh
            </span>
          )}
        </div>

        {/* Quick Batch Actions */}
        {!isSuperAdminRole && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {initialPermissions[selectedRoleId] && (
              <button
                type="button"
                onClick={handleResetRoleDefault}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-[#5E2276] hover:bg-purple-100 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Default Role</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSetAll(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer"
            >
              Pilih Semua
            </button>
            <button
              type="button"
              onClick={handleSetReadOnly}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer"
            >
              Hanya Baca
            </button>
            <button
              type="button"
              onClick={() => handleSetAll(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Kosongkan
            </button>
          </div>
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-[36%] min-w-[200px]">Modul Halaman Web</th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Read (Tampil Halaman)</span>
                </th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Create (Tambah)</span>
                </th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Update (Ubah)</span>
                </th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Delete (Hapus)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {moduleList.map((mod) => {
                const actionState = isSuperAdminRole
                  ? { create: true, read: true, update: true, delete: true }
                  : currentRolePerms[mod.id] || {
                      create: false,
                      read: false,
                      update: false,
                      delete: false,
                    };

                return (
                  <tr
                    key={mod.id}
                    className={`hover:bg-purple-50/20 transition-colors ${
                      actionState.read ? "" : "opacity-60 bg-stone-50/40"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-stone-900 text-sm">
                          {mod.name}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            actionState.read
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {actionState.read ? "Tampil di Menu" : "Disembunyikan"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {mod.desc}
                      </p>
                    </td>

                    {/* Read */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        disabled={isSuperAdminRole}
                        checked={actionState.read}
                        onChange={() => handleToggleAction(mod.id, "read")}
                        className="w-4 h-4 rounded text-[#823296] focus:ring-[#823296] cursor-pointer disabled:opacity-50"
                      />
                    </td>

                    {/* Create */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        disabled={isSuperAdminRole}
                        checked={actionState.create}
                        onChange={() => handleToggleAction(mod.id, "create")}
                        className="w-4 h-4 rounded text-[#823296] focus:ring-[#823296] cursor-pointer disabled:opacity-50"
                      />
                    </td>

                    {/* Update */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        disabled={isSuperAdminRole}
                        checked={actionState.update}
                        onChange={() => handleToggleAction(mod.id, "update")}
                        className="w-4 h-4 rounded text-[#823296] focus:ring-[#823296] cursor-pointer disabled:opacity-50"
                      />
                    </td>

                    {/* Delete */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        disabled={isSuperAdminRole}
                        checked={actionState.delete}
                        onChange={() => handleToggleAction(mod.id, "delete")}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PermissionsAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-stone-500">
          Memuat konfigurasi permission...
        </div>
      }
    >
      <PermissionsContent />
    </Suspense>
  );
}
